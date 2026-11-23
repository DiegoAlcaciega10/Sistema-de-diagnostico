"""Aplicación FastAPI.

Desarrollo: ``fastapi dev app/main.py`` (o ``uvicorn app.main:app --reload``) desde ``backend/``.
"""

from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.rutas import router
from app.config import Configuracion, cargar_archivo_env
from app.db import AbridorConexiones, abridor_psycopg
from app.servicios.errores import ErrorServicio


async def _manejar_error_servicio(_: Request, exc: Exception) -> JSONResponse:
    assert isinstance(exc, ErrorServicio)
    cabeceras = {"WWW-Authenticate": "Bearer"} if exc.estado_http == 401 else None
    return JSONResponse({"detail": exc.mensaje}, status_code=exc.estado_http, headers=cabeceras)


def crear_app(config: Configuracion, abrir_conexion: AbridorConexiones | None = None) -> FastAPI:
    app = FastAPI(title="Sistema de diagnóstico POO", version="0.1.0")
    app.state.config = config
    app.state.abrir_conexion = abrir_conexion or abridor_psycopg(config.url_base_datos)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(config.origenes_cors),
        allow_methods=["GET", "POST", "PATCH"],
        allow_headers=["Authorization", "Content-Type"],
    )
    app.add_exception_handler(ErrorServicio, _manejar_error_servicio)
    app.include_router(router)
    return app


def _app_desde_entorno() -> FastAPI:
    cargar_archivo_env()
    return crear_app(Configuracion.desde_entorno())


app = _app_desde_entorno()
