"""Gestión de cuentas por el administrador: crear, editar, activar, desactivar y eliminar."""

from __future__ import annotations

from fastapi.testclient import TestClient

from app.db import AbridorConexiones
from tests.conftest import CONTRASENA, iniciar


def _administrador(cliente: TestClient, crear_cuenta) -> dict[str, str]:  # type: ignore[no-untyped-def]
    crear_cuenta("admin@espe.edu.ec", rol="administrador")
    return iniciar(cliente, "admin@espe.edu.ec")


def _nueva(cliente: TestClient, cabeceras: dict[str, str], correo: str, **extra: object) -> dict[str, object]:
    cuerpo = {"nombre": "Marta Ruiz", "correo": correo, "contrasena": CONTRASENA, "rol": "docente", **extra}
    respuesta = cliente.post("/api/usuarios", headers=cabeceras, json=cuerpo)
    assert respuesta.status_code == 201, respuesta.text
    datos: dict[str, object] = respuesta.json()
    return datos


def test_crear_cuenta_inactiva(cliente: TestClient, crear_cuenta) -> None:  # type: ignore[no-untyped-def]
    admin = _administrador(cliente, crear_cuenta)
    cuenta = _nueva(cliente, admin, "marta@espe.edu.ec", activo=False)
    assert cuenta["activo"] is False
    respuesta = cliente.post("/api/auth/login", json={"correo": "marta@espe.edu.ec", "contrasena": CONTRASENA})
    assert respuesta.status_code == 403


def test_editar_correo_y_rechazar_correo_repetido(cliente: TestClient, crear_cuenta) -> None:  # type: ignore[no-untyped-def]
    admin = _administrador(cliente, crear_cuenta)
    marta = _nueva(cliente, admin, "marta@espe.edu.ec")
    _nueva(cliente, admin, "luis@espe.edu.ec")
    cambio = cliente.patch(f"/api/usuarios/{marta['id']}", headers=admin, json={"correo": "m.ruiz@espe.edu.ec"})
    assert cambio.status_code == 200 and cambio.json()["correo"] == "m.ruiz@espe.edu.ec"
    assert iniciar(cliente, "m.ruiz@espe.edu.ec")
    repetido = cliente.patch(f"/api/usuarios/{marta['id']}", headers=admin, json={"correo": "LUIS@espe.edu.ec"})
    assert repetido.status_code == 409
    invalido = cliente.patch(f"/api/usuarios/{marta['id']}", headers=admin, json={"correo": "sin-arroba"})
    assert invalido.status_code == 422


def test_cambiar_contrasena_y_rol(cliente: TestClient, crear_cuenta) -> None:  # type: ignore[no-untyped-def]
    admin = _administrador(cliente, crear_cuenta)
    marta = _nueva(cliente, admin, "marta@espe.edu.ec")
    cambio = cliente.patch(f"/api/usuarios/{marta['id']}", headers=admin,
                           json={"contrasena": "nueva-clave-456", "rol": "administrador"})
    assert cambio.status_code == 200 and cambio.json()["rol"] == "administrador"
    assert iniciar(cliente, "marta@espe.edu.ec", "nueva-clave-456")
    corta = cliente.patch(f"/api/usuarios/{marta['id']}", headers=admin, json={"contrasena": "corta"})
    assert corta.status_code == 422


def test_eliminar_cuenta(cliente: TestClient, crear_cuenta) -> None:  # type: ignore[no-untyped-def]
    admin = _administrador(cliente, crear_cuenta)
    marta = _nueva(cliente, admin, "marta@espe.edu.ec")
    respuesta = cliente.delete(f"/api/usuarios/{marta['id']}", headers=admin)
    assert respuesta.status_code == 204 and respuesta.content == b""
    assert cliente.delete(f"/api/usuarios/{marta['id']}", headers=admin).status_code == 404
    correos = [u["correo"] for u in cliente.get("/api/usuarios", headers=admin).json()]
    assert correos == ["admin@espe.edu.ec"]


def test_no_puede_eliminarse_a_si_mismo(cliente: TestClient, crear_cuenta) -> None:  # type: ignore[no-untyped-def]
    admin = _administrador(cliente, crear_cuenta)
    propio = cliente.get("/api/auth/sesion", headers=admin).json()["id"]
    assert cliente.delete(f"/api/usuarios/{propio}", headers=admin).status_code == 409


def test_docente_no_puede_eliminar(cliente: TestClient, crear_cuenta) -> None:  # type: ignore[no-untyped-def]
    otro = crear_cuenta("otro@espe.edu.ec")
    crear_cuenta("docente@espe.edu.ec")
    docente = iniciar(cliente, "docente@espe.edu.ec")
    assert cliente.delete(f"/api/usuarios/{otro}", headers=docente).status_code == 403


def test_cuenta_con_informacion_asociada_no_se_elimina(
    cliente: TestClient, crear_cuenta, abrir_conexion: AbridorConexiones  # type: ignore[no-untyped-def]
) -> None:
    admin = _administrador(cliente, crear_cuenta)
    marta = _nueva(cliente, admin, "marta@espe.edu.ec")
    conexion = abrir_conexion()
    try:
        # Tabla temporal que simula datos futuros (grupos, diagnósticos) que referencian la cuenta.
        conexion.execute("CREATE TABLE prueba_referencia (usuario_id bigint REFERENCES usuario (id))")
        conexion.execute("INSERT INTO prueba_referencia VALUES (%s)", [marta["id"]])
        respuesta = cliente.delete(f"/api/usuarios/{marta['id']}", headers=admin)
        assert respuesta.status_code == 409
        assert "Desactívela" in respuesta.json()["detail"]
    finally:
        conexion.execute("DROP TABLE prueba_referencia")
        conexion.close()
