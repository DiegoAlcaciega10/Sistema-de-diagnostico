"""Sesiones del lado del servidor: vencimiento informado, cierre de sesión y renovación."""

from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone

import jwt
from fastapi.testclient import TestClient

from app.seguridad import emitir_token
from tests.conftest import CONTRASENA, SECRETO_PRUEBAS


def _entrar(cliente: TestClient, correo: str = "docente@espe.edu.ec") -> dict[str, object]:
    respuesta = cliente.post("/api/auth/login", json={"correo": correo, "contrasena": CONTRASENA})
    assert respuesta.status_code == 200, respuesta.text
    datos: dict[str, object] = respuesta.json()
    return datos


def _cabeceras(sesion: dict[str, object]) -> dict[str, str]:
    return {"Authorization": f"Bearer {sesion['token']}"}


def test_login_informa_el_vencimiento(cliente: TestClient, crear_cuenta) -> None:  # type: ignore[no-untyped-def]
    crear_cuenta("docente@espe.edu.ec")
    sesion = _entrar(cliente)
    expira_en = datetime.fromisoformat(str(sesion["expira_en"]).replace("Z", "+00:00"))
    restante = expira_en - datetime.now(timezone.utc)
    assert timedelta(hours=7, minutes=58) < restante <= timedelta(hours=8)
    contenido = jwt.decode(str(sesion["token"]), SECRETO_PRUEBAS, algorithms=["HS256"])
    assert contenido["exp"] == int(expira_en.timestamp())


def test_cerrar_sesion_invalida_el_token(cliente: TestClient, crear_cuenta) -> None:  # type: ignore[no-untyped-def]
    crear_cuenta("docente@espe.edu.ec")
    sesion = _entrar(cliente)
    assert cliente.get("/api/auth/sesion", headers=_cabeceras(sesion)).status_code == 200
    assert cliente.post("/api/auth/logout", headers=_cabeceras(sesion)).status_code == 204
    # El token copiado antes del cierre ya no sirve, aunque no haya vencido.
    assert cliente.get("/api/auth/sesion", headers=_cabeceras(sesion)).status_code == 401
    assert cliente.post("/api/auth/logout", headers=_cabeceras(sesion)).status_code == 401


def test_cerrar_una_sesion_no_afecta_a_las_demas(cliente: TestClient, crear_cuenta) -> None:  # type: ignore[no-untyped-def]
    crear_cuenta("docente@espe.edu.ec")
    portatil, laboratorio = _entrar(cliente), _entrar(cliente)
    assert cliente.post("/api/auth/logout", headers=_cabeceras(portatil)).status_code == 204
    assert cliente.get("/api/auth/sesion", headers=_cabeceras(laboratorio)).status_code == 200


def test_renovar_reemplaza_la_sesion(cliente: TestClient, crear_cuenta) -> None:  # type: ignore[no-untyped-def]
    crear_cuenta("docente@espe.edu.ec")
    original = _entrar(cliente)
    respuesta = cliente.post("/api/auth/renovar", headers=_cabeceras(original))
    assert respuesta.status_code == 200, respuesta.text
    renovada = respuesta.json()
    assert renovada["token"] != original["token"]
    assert renovada["usuario"]["correo"] == "docente@espe.edu.ec"
    assert "sesion_id" not in renovada["usuario"]
    assert cliente.get("/api/auth/sesion", headers=_cabeceras(original)).status_code == 401
    assert cliente.get("/api/auth/sesion", headers=_cabeceras(renovada)).status_code == 200


def test_tokens_sin_sesion_registrada_se_rechazan(cliente: TestClient, crear_cuenta) -> None:  # type: ignore[no-untyped-def]
    usuario_id = crear_cuenta("docente@espe.edu.ec")
    ahora = datetime.now(timezone.utc)
    # Firma válida, pero la sesión no existe en la base de datos.
    falso = emitir_token(usuario_id, "docente", str(uuid.uuid4()), SECRETO_PRUEBAS, ahora, ahora + timedelta(hours=1))
    assert cliente.get("/api/auth/sesion", headers={"Authorization": f"Bearer {falso}"}).status_code == 401
    # Formato anterior, sin identificador de sesión.
    antiguo = jwt.encode({"sub": str(usuario_id), "iat": ahora, "exp": ahora + timedelta(hours=1)},
                         SECRETO_PRUEBAS, algorithm="HS256")
    assert cliente.get("/api/auth/sesion", headers={"Authorization": f"Bearer {antiguo}"}).status_code == 401


def test_la_sesion_de_otro_usuario_no_sirve(cliente: TestClient, crear_cuenta) -> None:  # type: ignore[no-untyped-def]
    crear_cuenta("docente@espe.edu.ec")
    otro_id = crear_cuenta("otro@espe.edu.ec")
    sesion = _entrar(cliente)
    sid = jwt.decode(str(sesion["token"]), SECRETO_PRUEBAS, algorithms=["HS256"])["sid"]
    ahora = datetime.now(timezone.utc)
    ajeno = emitir_token(otro_id, "docente", sid, SECRETO_PRUEBAS, ahora, ahora + timedelta(hours=1))
    assert cliente.get("/api/auth/sesion", headers={"Authorization": f"Bearer {ajeno}"}).status_code == 401
