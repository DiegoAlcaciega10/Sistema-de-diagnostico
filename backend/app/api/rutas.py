"""Rutas de la API: salud, autenticación y gestión de cuentas."""

from __future__ import annotations

from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.api.dependencias import AdministradorDep, ConexionDep, ConfigDep, UsuarioActualDep
from app.api.esquemas import CambiosUsuario, InicioSesion, NuevoUsuario, Salud, Sesion, Usuario
from app.db import Fila
from app.servicios import autenticacion, usuarios

router = APIRouter(prefix="/api")


@router.get("/salud", response_model=Salud, tags=["sistema"])
def salud(conexion: ConexionDep) -> Salud | JSONResponse:
    """Comprueba que el backend se comunica con PostgreSQL."""
    try:
        conexion.execute("SELECT 1")
    except Exception:  # noqa: BLE001 - el chequeo informa el estado sin propagar el error.
        contenido = Salud(estado="degradado", base_datos=False).model_dump()
        return JSONResponse(contenido, status_code=status.HTTP_503_SERVICE_UNAVAILABLE)
    return Salud(estado="ok", base_datos=True)


@router.post("/auth/login", response_model=Sesion, tags=["autenticación"])
def iniciar_sesion(entrada: InicioSesion, conexion: ConexionDep, config: ConfigDep) -> dict[str, object]:
    token, usuario = autenticacion.iniciar_sesion(conexion, config, entrada.correo, entrada.contrasena)
    return {"token": token, "usuario": usuario}


@router.get("/auth/sesion", response_model=Usuario, tags=["autenticación"])
def sesion_actual(usuario: UsuarioActualDep) -> Fila:
    """Devuelve el usuario del token; el frontend lo usa para restaurar la sesión."""
    return usuario


@router.get("/usuarios", response_model=list[Usuario], tags=["usuarios"])
def listar_usuarios(_: AdministradorDep, conexion: ConexionDep) -> list[Fila]:
    return usuarios.listar(conexion)


@router.post(
    "/usuarios", response_model=Usuario, status_code=status.HTTP_201_CREATED, tags=["usuarios"]
)
def crear_usuario(entrada: NuevoUsuario, _: AdministradorDep, conexion: ConexionDep) -> Fila:
    return usuarios.crear(conexion, entrada.nombre, entrada.correo, entrada.contrasena, entrada.rol)


@router.patch("/usuarios/{usuario_id}", response_model=Usuario, tags=["usuarios"])
def actualizar_usuario(
    usuario_id: int, entrada: CambiosUsuario, administrador: AdministradorDep, conexion: ConexionDep
) -> Fila:
    return usuarios.actualizar(
        conexion, administrador, usuario_id, entrada.model_dump(exclude_none=True)
    )
