"""Gestión de cuentas, reservada al administrador."""

from __future__ import annotations

from typing import Any

from app.db import Conexion, Fila
from app.repositorios import usuarios
from app.seguridad import generar_hash
from app.servicios.errores import ErrorServicio

ROLES = ("administrador", "docente")
# Códigos de error de PostgreSQL (SQLSTATE).
_VIOLACION_UNICA = "23505"
_VIOLACION_CLAVE_FORANEA = "23503"
MENSAJE_CORREO_REPETIDO = "Ya existe una cuenta con ese correo."


def _sqlstate(exc: Exception) -> str | None:
    estado = getattr(exc, "sqlstate", None)
    return estado if isinstance(estado, str) else None


def _hash_valido(contrasena: str) -> str:
    try:
        return generar_hash(contrasena)
    except ValueError as exc:
        raise ErrorServicio(422, str(exc)) from exc


def listar(conexion: Conexion) -> list[Fila]:
    return usuarios.listar(conexion)


def crear(
    conexion: Conexion, nombre: str, correo: str, contrasena: str, rol: str, activo: bool = True
) -> Fila:
    if rol not in ROLES:
        raise ErrorServicio(422, "Rol no válido.")
    usuario = usuarios.crear(conexion, nombre, correo, _hash_valido(contrasena), rol, activo)
    if usuario is None:
        raise ErrorServicio(409, MENSAJE_CORREO_REPETIDO)
    return usuario


def actualizar(
    conexion: Conexion, usuario_actual: Fila, usuario_id: int, cambios: dict[str, Any]
) -> Fila:
    if usuario_id == usuario_actual["id"] and (
        cambios.get("activo") is False or cambios.get("rol", "administrador") != "administrador"
    ):
        raise ErrorServicio(409, "No puede desactivar su propia cuenta ni quitarse el rol de administrador.")
    if "rol" in cambios and cambios["rol"] not in ROLES:
        raise ErrorServicio(422, "Rol no válido.")
    datos = {k: v for k, v in cambios.items() if k != "contrasena"}
    if cambios.get("contrasena") is not None:
        datos["hash_contrasena"] = _hash_valido(cambios["contrasena"])
    if "correo" in datos:
        datos["correo"] = datos["correo"].strip()
    try:
        usuario = usuarios.actualizar(conexion, usuario_id, datos)
    except Exception as exc:
        if _sqlstate(exc) == _VIOLACION_UNICA:
            raise ErrorServicio(409, MENSAJE_CORREO_REPETIDO) from exc
        raise
    if usuario is None:
        raise ErrorServicio(404, "La cuenta no existe.")
    return usuario


def eliminar(conexion: Conexion, usuario_actual: Fila, usuario_id: int) -> None:
    """Borra una cuenta sin datos asociados; las demás deben desactivarse para conservar el historial."""
    if usuario_id == usuario_actual["id"]:
        raise ErrorServicio(409, "No puede eliminar su propia cuenta.")
    try:
        eliminado = usuarios.eliminar(conexion, usuario_id)
    except Exception as exc:
        if _sqlstate(exc) == _VIOLACION_CLAVE_FORANEA:
            raise ErrorServicio(
                409, "La cuenta tiene información asociada y no puede eliminarse. Desactívela."
            ) from exc
        raise
    if not eliminado:
        raise ErrorServicio(404, "La cuenta no existe.")
