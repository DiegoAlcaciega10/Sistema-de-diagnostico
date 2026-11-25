"""Hash de contraseñas con scrypt y emisión o lectura de tokens JWT."""

from __future__ import annotations

import base64
import hashlib
import hmac
import secrets
from datetime import datetime

import jwt

LONGITUD_MINIMA_CONTRASENA = 10
_SCRYPT_N, _SCRYPT_R, _SCRYPT_P = 2**15, 8, 1
_SCRYPT_MEMORIA = 64 * 1024 * 1024
_ALGORITMO_JWT = "HS256"


def _b64(datos: bytes) -> str:
    return base64.b64encode(datos).decode("ascii")


def generar_hash(contrasena: str) -> str:
    if len(contrasena) < LONGITUD_MINIMA_CONTRASENA:
        raise ValueError(
            f"La contraseña debe tener al menos {LONGITUD_MINIMA_CONTRASENA} caracteres."
        )
    sal = secrets.token_bytes(16)
    clave = hashlib.scrypt(
        contrasena.encode(), salt=sal, n=_SCRYPT_N, r=_SCRYPT_R, p=_SCRYPT_P,
        maxmem=_SCRYPT_MEMORIA, dklen=32,
    )
    return f"scrypt${_SCRYPT_N}${_SCRYPT_R}${_SCRYPT_P}${_b64(sal)}${_b64(clave)}"


def verificar_contrasena(contrasena: str, hash_guardado: str) -> bool:
    try:
        algoritmo, n, r, p, sal, clave = hash_guardado.split("$")
        if algoritmo != "scrypt":
            return False
        esperado = base64.b64decode(clave)
        calculado = hashlib.scrypt(
            contrasena.encode(), salt=base64.b64decode(sal), n=int(n), r=int(r), p=int(p),
            maxmem=_SCRYPT_MEMORIA, dklen=len(esperado),
        )
    except (ValueError, TypeError):
        return False
    return hmac.compare_digest(calculado, esperado)


# Se verifica contra este hash cuando el correo no existe, para que el tiempo de respuesta no
# revele qué correos están registrados.
HASH_FICTICIO = generar_hash(secrets.token_urlsafe(24))


class TokenInvalido(Exception):
    """El token falta, está mal formado, expiró o su firma no es válida."""


def emitir_token(
    usuario_id: int, rol: str, sesion_id: str, secreto: str, emitido_en: datetime, expira_en: datetime
) -> str:
    """Firma un token ligado a una sesión; ``sid`` permite revocarlo antes de su vencimiento."""
    contenido = {
        "sub": str(usuario_id),
        "rol": rol,
        "sid": sesion_id,
        "iat": emitido_en,
        "exp": expira_en,
    }
    return jwt.encode(contenido, secreto, algorithm=_ALGORITMO_JWT)


def leer_token(token: str, secreto: str) -> tuple[int, str]:
    """Devuelve ``(usuario_id, sesion_id)`` del token o lanza ``TokenInvalido``."""
    try:
        contenido = jwt.decode(
            token, secreto, algorithms=[_ALGORITMO_JWT],
            options={"require": ["sub", "sid", "exp", "iat"]},
        )
        return int(contenido["sub"]), str(contenido["sid"])
    except (jwt.PyJWTError, ValueError) as exc:
        raise TokenInvalido(str(exc)) from exc
