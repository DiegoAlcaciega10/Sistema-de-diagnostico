"""Rutas de la API: salud, autenticación y gestión de cuentas."""

from __future__ import annotations

from fastapi import APIRouter, Response, status
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
    sesion, usuario = autenticacion.iniciar_sesion(conexion, config, entrada.correo, entrada.contrasena)
    return {"token": sesion.token, "expira_en": sesion.expira_en, "usuario": usuario}


@router.post("/auth/logout", status_code=status.HTTP_204_NO_CONTENT, tags=["autenticación"])
def cerrar_sesion(usuario: UsuarioActualDep, conexion: ConexionDep) -> Response:
    """Revoca la sesión del token: deja de aceptarse aunque todavía no haya vencido."""
    autenticacion.cerrar_sesion(conexion, usuario)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/auth/renovar", response_model=Sesion, tags=["autenticación"])
def renovar_sesion(usuario: UsuarioActualDep, conexion: ConexionDep, config: ConfigDep) -> dict[str, object]:
    """Reemplaza la sesión vigente por una nueva con otro plazo de vencimiento."""
    sesion = autenticacion.renovar_sesion(conexion, config, usuario)
    return {"token": sesion.token, "expira_en": sesion.expira_en, "usuario": usuario}


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
    return usuarios.crear(
        conexion, entrada.nombre, entrada.correo, entrada.contrasena, entrada.rol, entrada.activo
    )


@router.patch("/usuarios/{usuario_id}", response_model=Usuario, tags=["usuarios"])
def actualizar_usuario(
    usuario_id: int, entrada: CambiosUsuario, administrador: AdministradorDep, conexion: ConexionDep
) -> Fila:
    return usuarios.actualizar(
        conexion, administrador, usuario_id, entrada.model_dump(exclude_none=True)
    )


@router.delete(
    "/usuarios/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["usuarios"]
)
def eliminar_usuario(usuario_id: int, administrador: AdministradorDep, conexion: ConexionDep) -> Response:
    """Elimina una cuenta sin información asociada. No se puede eliminar la propia cuenta."""
    usuarios.eliminar(conexion, administrador, usuario_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
