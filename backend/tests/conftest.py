"""Configuración de las pruebas.

Requieren una base PostgreSQL **exclusiva para pruebas** en ``TEST_DATABASE_URL``: al iniciar, su
esquema ``public`` se elimina y se vuelve a crear.
"""

from __future__ import annotations

import os
from collections.abc import Iterator

import pytest

from app.config import cargar_archivo_env

cargar_archivo_env()
URL_PRUEBAS = os.environ.get("TEST_DATABASE_URL", "").strip()
SECRETO_PRUEBAS = "secreto-solo-para-pruebas-0123456789-abcdefghij"
# app.main crea la aplicación al importarse; estas variables evitan que use la base de desarrollo.
os.environ["DATABASE_URL"] = URL_PRUEBAS or "postgresql://sin-configurar"
os.environ["JWT_SECRETO"] = SECRETO_PRUEBAS

from fastapi.testclient import TestClient  # noqa: E402

from app.config import Configuracion  # noqa: E402
from app.db import AbridorConexiones, abridor_psycopg  # noqa: E402
from app.main import crear_app  # noqa: E402
from app.migraciones import aplicar_migraciones  # noqa: E402
from app.servicios import usuarios  # noqa: E402

CONTRASENA = "clave-de-prueba-123"


@pytest.fixture(scope="session")
def abrir_conexion() -> AbridorConexiones:
    if not URL_PRUEBAS:
        pytest.skip("Defina TEST_DATABASE_URL (base exclusiva para pruebas) para ejecutar estas pruebas")
    abrir = abridor_psycopg(URL_PRUEBAS)
    conexion = abrir()
    try:
        conexion.execute("DROP SCHEMA public CASCADE")
        conexion.execute("CREATE SCHEMA public")
        aplicar_migraciones(conexion)
    finally:
        conexion.close()
    return abrir


@pytest.fixture
def config() -> Configuracion:
    return Configuracion(url_base_datos=URL_PRUEBAS, secreto_jwt=SECRETO_PRUEBAS)


@pytest.fixture
def cliente(abrir_conexion: AbridorConexiones, config: Configuracion) -> Iterator[TestClient]:
    conexion = abrir_conexion()
    try:
        conexion.execute("TRUNCATE usuario RESTART IDENTITY")
    finally:
        conexion.close()
    with TestClient(crear_app(config, abrir_conexion)) as cliente_http:
        yield cliente_http


@pytest.fixture
def crear_cuenta(abrir_conexion: AbridorConexiones):  # type: ignore[no-untyped-def]
    def crear(correo: str, rol: str = "docente", activo: bool = True) -> int:
        conexion = abrir_conexion()
        try:
            usuario = usuarios.crear(conexion, "Usuario de prueba", correo, CONTRASENA, rol)
            if not activo:
                conexion.execute("UPDATE usuario SET activo = false WHERE id = %s", [usuario["id"]])
            identificador: int = usuario["id"]
            return identificador
        finally:
            conexion.close()

    return crear


def iniciar(cliente: TestClient, correo: str, contrasena: str = CONTRASENA) -> dict[str, str]:
    respuesta = cliente.post("/api/auth/login", json={"correo": correo, "contrasena": contrasena})
    assert respuesta.status_code == 200, respuesta.text
    return {"Authorization": f"Bearer {respuesta.json()['token']}"}
