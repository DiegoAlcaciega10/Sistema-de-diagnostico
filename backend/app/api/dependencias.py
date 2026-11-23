"""Dependencias de FastAPI: conexión por solicitud, usuario autenticado y control de roles."""

from __future__ import annotations

from collections.abc import Callable, Iterator
from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import Configuracion
from app.db import Conexion, Fila
from app.servicios.autenticacion import MENSAJE_SESION, usuario_desde_token

_esquema_bearer = HTTPBearer(auto_error=False)


def obtener_config(request: Request) -> Configuracion:
    config: Configuracion = request.app.state.config
    return config


def obtener_conexion(request: Request) -> Iterator[Conexion]:
    conexion: Conexion = request.app.state.abrir_conexion()
    try:
        yield conexion
    finally:
        conexion.close()


ConexionDep = Annotated[Conexion, Depends(obtener_conexion)]
ConfigDep = Annotated[Configuracion, Depends(obtener_config)]


def usuario_actual(
    conexion: ConexionDep,
    config: ConfigDep,
    credenciales: Annotated[HTTPAuthorizationCredentials | None, Depends(_esquema_bearer)],
) -> Fila:
    if credenciales is None or credenciales.scheme.lower() != "bearer":
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED, MENSAJE_SESION, headers={"WWW-Authenticate": "Bearer"}
        )
    return usuario_desde_token(conexion, config, credenciales.credentials)


UsuarioActualDep = Annotated[Fila, Depends(usuario_actual)]


def requiere_rol(*roles: str) -> Callable[[Fila], Fila]:
    """Dependencia que admite solo a usuarios con alguno de los roles indicados."""

    def verificar(usuario: UsuarioActualDep) -> Fila:
        if usuario["rol"] not in roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "No tiene permiso para esta operación.")
        return usuario

    return verificar


AdministradorDep = Annotated[Fila, Depends(requiere_rol("administrador"))]
