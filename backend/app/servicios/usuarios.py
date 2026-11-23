"""Gestión de cuentas, reservada al administrador."""

from __future__ import annotations

from typing import Any

from app.db import Conexion, Fila
from app.repositorios import usuarios
from app.seguridad import generar_hash
from app.servicios.errores import ErrorServicio

ROLES = ("administrador", "docente")


def listar(conexion: Conexion) -> list[Fila]:
    return usuarios.listar(conexion)


def crear(conexion: Conexion, nombre: str, correo: str, contrasena: str, rol: str) -> Fila:
    if rol not in ROLES:
        raise ErrorServicio(422, "Rol no válido.")
    try:
        hash_contrasena = generar_hash(contrasena)
    except ValueError as exc:
        raise ErrorServicio(422, str(exc)) from exc
    usuario = usuarios.crear(conexion, nombre, correo, hash_contrasena, rol)
    if usuario is None:
        raise ErrorServicio(409, "Ya existe una cuenta con ese correo.")
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
        try:
            datos["hash_contrasena"] = generar_hash(cambios["contrasena"])
        except ValueError as exc:
            raise ErrorServicio(422, str(exc)) from exc
    usuario = usuarios.actualizar(conexion, usuario_id, datos)
    if usuario is None:
        raise ErrorServicio(404, "La cuenta no existe.")
    return usuario
