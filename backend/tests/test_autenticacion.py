"""Conexión a PostgreSQL, inicio de sesión y protección de rutas por rol."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.seguridad import TokenInvalido, emitir_token, generar_hash, leer_token, verificar_contrasena
from tests.conftest import CONTRASENA, SECRETO_PRUEBAS, iniciar


def test_salud_confirma_conexion_con_postgresql(cliente: TestClient) -> None:
    respuesta = cliente.get("/api/salud")
    assert respuesta.status_code == 200
    assert respuesta.json() == {"estado": "ok", "base_datos": True}


def test_inicio_de_sesion_correcto(cliente: TestClient, crear_cuenta) -> None:  # type: ignore[no-untyped-def]
    crear_cuenta("Docente@ESPE.edu.ec")
    respuesta = cliente.post(
        "/api/auth/login", json={"correo": "docente@espe.edu.ec", "contrasena": CONTRASENA}
    )
    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert datos["tipo"] == "Bearer" and datos["token"]
    assert datos["usuario"]["rol"] == "docente"
    assert "hash_contrasena" not in datos["usuario"]
    sesion = cliente.get("/api/auth/sesion", headers={"Authorization": f"Bearer {datos['token']}"})
    assert sesion.status_code == 200 and sesion.json()["correo"] == "Docente@ESPE.edu.ec"


def test_credenciales_incorrectas_no_revelan_si_el_correo_existe(
    cliente: TestClient, crear_cuenta  # type: ignore[no-untyped-def]
) -> None:
    crear_cuenta("docente@espe.edu.ec")
    clave_incorrecta = cliente.post(
        "/api/auth/login", json={"correo": "docente@espe.edu.ec", "contrasena": "otra-clave-999"}
    )
    correo_inexistente = cliente.post(
        "/api/auth/login", json={"correo": "nadie@espe.edu.ec", "contrasena": CONTRASENA}
    )
    assert clave_incorrecta.status_code == correo_inexistente.status_code == 401
    assert clave_incorrecta.json() == correo_inexistente.json()


def test_cuenta_inactiva_no_puede_ingresar(cliente: TestClient, crear_cuenta) -> None:  # type: ignore[no-untyped-def]
    crear_cuenta("inactivo@espe.edu.ec", activo=False)
    respuesta = cliente.post(
        "/api/auth/login", json={"correo": "inactivo@espe.edu.ec", "contrasena": CONTRASENA}
    )
    assert respuesta.status_code == 403
    assert "inactiva" in respuesta.json()["detail"]


@pytest.mark.parametrize(
    "cuerpo",
    [{"correo": "no-es-correo", "contrasena": "x"}, {"correo": "a@b.ec"}, {"correo": "a@b.ec", "contrasena": "x", "rol": "administrador"}],
)
def test_entradas_invalidas_en_login(cliente: TestClient, cuerpo: dict[str, str]) -> None:
    assert cliente.post("/api/auth/login", json=cuerpo).status_code == 422


@pytest.mark.parametrize("cabecera", [None, "Bearer token-falso", "Basic abc"])
def test_rutas_protegidas_exigen_sesion(cliente: TestClient, cabecera: str | None) -> None:
    cabeceras = {"Authorization": cabecera} if cabecera else {}
    for metodo, ruta in [("GET", "/api/auth/sesion"), ("GET", "/api/usuarios"),
                         ("POST", "/api/usuarios"), ("PATCH", "/api/usuarios/1")]:
        respuesta = cliente.request(metodo, ruta, headers=cabeceras, json={})
        assert respuesta.status_code == 401, ruta


def test_token_expirado_o_de_cuenta_desactivada(
    cliente: TestClient, crear_cuenta  # type: ignore[no-untyped-def]
) -> None:
    usuario_id = crear_cuenta("docente@espe.edu.ec")
    expirado = emitir_token(usuario_id, "docente", SECRETO_PRUEBAS, minutos_validez=-1)
    assert cliente.get("/api/auth/sesion", headers={"Authorization": f"Bearer {expirado}"}).status_code == 401

    administrador = iniciar(cliente, correo=_crear_admin(crear_cuenta))
    docente = iniciar(cliente, "docente@espe.edu.ec")
    assert cliente.get("/api/auth/sesion", headers=docente).status_code == 200
    cliente.patch(f"/api/usuarios/{usuario_id}", headers=administrador, json={"activo": False})
    assert cliente.get("/api/auth/sesion", headers=docente).status_code == 401


def _crear_admin(crear_cuenta) -> str:  # type: ignore[no-untyped-def]
    crear_cuenta("admin@espe.edu.ec", rol="administrador")
    return "admin@espe.edu.ec"


def test_docente_no_accede_a_la_gestion_de_cuentas(
    cliente: TestClient, crear_cuenta  # type: ignore[no-untyped-def]
) -> None:
    crear_cuenta("docente@espe.edu.ec")
    docente = iniciar(cliente, "docente@espe.edu.ec")
    assert cliente.get("/api/usuarios", headers=docente).status_code == 403
    nuevo = {"nombre": "X", "correo": "x@espe.edu.ec", "contrasena": CONTRASENA, "rol": "docente"}
    assert cliente.post("/api/usuarios", headers=docente, json=nuevo).status_code == 403


def test_administrador_gestiona_cuentas(cliente: TestClient, crear_cuenta) -> None:  # type: ignore[no-untyped-def]
    administrador = iniciar(cliente, _crear_admin(crear_cuenta))
    nuevo = {"nombre": "Luis Ramírez", "correo": "luis@espe.edu.ec", "contrasena": CONTRASENA,
             "rol": "docente"}
    creado = cliente.post("/api/usuarios", headers=administrador, json=nuevo)
    assert creado.status_code == 201 and creado.json()["activo"] is True
    assert cliente.post("/api/usuarios", headers=administrador, json=nuevo).status_code == 409
    corta = {**nuevo, "correo": "otro@espe.edu.ec", "contrasena": "corta"}
    assert cliente.post("/api/usuarios", headers=administrador, json=corta).status_code == 422
    assert iniciar(cliente, "luis@espe.edu.ec")

    lista = cliente.get("/api/usuarios", headers=administrador).json()
    assert [u["correo"] for u in lista] == ["admin@espe.edu.ec", "luis@espe.edu.ec"]

    luis_id = creado.json()["id"]
    cambio = cliente.patch(f"/api/usuarios/{luis_id}", headers=administrador,
                           json={"activo": False, "nombre": "Luis R."})
    assert cambio.status_code == 200 and cambio.json()["activo"] is False
    assert cliente.patch("/api/usuarios/999", headers=administrador, json={"activo": True}).status_code == 404


def test_administrador_no_puede_desactivarse_a_si_mismo(
    cliente: TestClient, crear_cuenta  # type: ignore[no-untyped-def]
) -> None:
    administrador = iniciar(cliente, _crear_admin(crear_cuenta))
    propio_id = cliente.get("/api/auth/sesion", headers=administrador).json()["id"]
    for cambio in ({"activo": False}, {"rol": "docente"}):
        assert cliente.patch(f"/api/usuarios/{propio_id}", headers=administrador, json=cambio).status_code == 409


def test_hash_y_token() -> None:
    hash_guardado = generar_hash("una-clave-larga")
    assert hash_guardado.startswith("scrypt$") and "una-clave-larga" not in hash_guardado
    assert verificar_contrasena("una-clave-larga", hash_guardado)
    assert not verificar_contrasena("otra-clave-larga", hash_guardado)
    with pytest.raises(ValueError):
        generar_hash("corta")
    token = emitir_token(7, "docente", SECRETO_PRUEBAS, 5)
    assert leer_token(token, SECRETO_PRUEBAS) == 7
    with pytest.raises(TokenInvalido):
        leer_token(token, "otro-secreto" * 4)
