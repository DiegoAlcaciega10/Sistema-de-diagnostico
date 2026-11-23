"""Inicio de sesión y obtención del usuario a partir del token."""

from __future__ import annotations

from app.config import Configuracion
from app.db import Conexion, Fila
from app.repositorios import usuarios
from app.seguridad import HASH_FICTICIO, TokenInvalido, emitir_token, leer_token, verificar_contrasena
from app.servicios.errores import ErrorServicio

MENSAJE_CREDENCIALES = "Correo o contraseña incorrectos."
MENSAJE_INACTIVA = "La cuenta está inactiva. Solicite su reactivación al administrador."
MENSAJE_SESION = "La sesión no es válida o expiró. Inicie sesión nuevamente."


def iniciar_sesion(
    conexion: Conexion, config: Configuracion, correo: str, contrasena: str
) -> tuple[str, Fila]:
    usuario = usuarios.buscar_por_correo(conexion, correo)
    hash_guardado = usuario["hash_contrasena"] if usuario else HASH_FICTICIO
    contrasena_valida = verificar_contrasena(contrasena, hash_guardado)
    if usuario is None or not contrasena_valida:
        raise ErrorServicio(401, MENSAJE_CREDENCIALES)
    # El estado de la cuenta solo se informa a quien conoce la contraseña.
    if not usuario["activo"]:
        raise ErrorServicio(403, MENSAJE_INACTIVA)
    token = emitir_token(usuario["id"], usuario["rol"], config.secreto_jwt, config.minutos_validez_token)
    del usuario["hash_contrasena"]
    return token, usuario


def usuario_desde_token(conexion: Conexion, config: Configuracion, token: str) -> Fila:
    """Valida el token y devuelve el usuario vigente; una cuenta desactivada pierde la sesión."""
    try:
        usuario_id = leer_token(token, config.secreto_jwt)
    except TokenInvalido as exc:
        raise ErrorServicio(401, MENSAJE_SESION) from exc
    usuario = usuarios.buscar_por_id(conexion, usuario_id)
    if usuario is None or not usuario["activo"]:
        raise ErrorServicio(401, MENSAJE_SESION)
    return usuario
