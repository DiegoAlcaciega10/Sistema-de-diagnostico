"""Inicio, verificación, renovación y cierre de sesión."""

from __future__ import annotations

import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

from app.config import Configuracion
from app.db import Conexion, Fila
from app.repositorios import sesiones, usuarios
from app.seguridad import HASH_FICTICIO, TokenInvalido, emitir_token, leer_token, verificar_contrasena
from app.servicios.errores import ErrorServicio

MENSAJE_CREDENCIALES = "Correo o contraseña incorrectos."
MENSAJE_INACTIVA = "La cuenta está inactiva. Solicite su reactivación al administrador."
MENSAJE_SESION = "La sesión no es válida o expiró. Inicie sesión nuevamente."


@dataclass(frozen=True)
class SesionEmitida:
    token: str
    expira_en: datetime


def _abrir_sesion(conexion: Conexion, config: Configuracion, usuario: Fila) -> SesionEmitida:
    """Registra una sesión nueva y emite su token con la misma fecha de vencimiento."""
    sesion_id = str(uuid.uuid4())
    # Se descartan los microsegundos para que el vencimiento del token y el de la base coincidan.
    ahora = datetime.now(timezone.utc).replace(microsecond=0)
    expira_en = ahora + timedelta(minutes=config.minutos_validez_token)
    sesiones.crear(conexion, sesion_id, usuario["id"], ahora, expira_en)
    token = emitir_token(usuario["id"], usuario["rol"], sesion_id, config.secreto_jwt, ahora, expira_en)
    return SesionEmitida(token=token, expira_en=expira_en)


def iniciar_sesion(
    conexion: Conexion, config: Configuracion, correo: str, contrasena: str
) -> tuple[SesionEmitida, Fila]:
    usuario = usuarios.buscar_por_correo(conexion, correo)
    hash_guardado = usuario["hash_contrasena"] if usuario else HASH_FICTICIO
    contrasena_valida = verificar_contrasena(contrasena, hash_guardado)
    if usuario is None or not contrasena_valida:
        raise ErrorServicio(401, MENSAJE_CREDENCIALES)
    # El estado de la cuenta solo se informa a quien conoce la contraseña.
    if not usuario["activo"]:
        raise ErrorServicio(403, MENSAJE_INACTIVA)
    del usuario["hash_contrasena"]
    return _abrir_sesion(conexion, config, usuario), usuario


def usuario_desde_token(conexion: Conexion, config: Configuracion, token: str) -> Fila:
    """Valida el token y su sesión; devuelve el usuario vigente con el id de la sesión.

    Una sesión cerrada, vencida o de una cuenta desactivada deja de ser válida.
    """
    try:
        usuario_id, sesion_id = leer_token(token, config.secreto_jwt)
    except TokenInvalido as exc:
        raise ErrorServicio(401, MENSAJE_SESION) from exc
    if not sesiones.esta_vigente(conexion, sesion_id, usuario_id):
        raise ErrorServicio(401, MENSAJE_SESION)
    usuario = usuarios.buscar_por_id(conexion, usuario_id)
    if usuario is None or not usuario["activo"]:
        raise ErrorServicio(401, MENSAJE_SESION)
    usuario["sesion_id"] = sesion_id
    return usuario


def cerrar_sesion(conexion: Conexion, usuario: Fila) -> None:
    sesiones.revocar(conexion, usuario["sesion_id"])


def renovar_sesion(conexion: Conexion, config: Configuracion, usuario: Fila) -> SesionEmitida:
    """Cierra la sesión actual y abre otra con un vencimiento nuevo."""
    with conexion.transaction():
        sesiones.revocar(conexion, usuario["sesion_id"])
        return _abrir_sesion(conexion, config, usuario)
