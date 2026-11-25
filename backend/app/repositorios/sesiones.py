"""Consultas SQL sobre la tabla ``sesion``."""

from __future__ import annotations

from datetime import datetime

from app.db import Conexion


def crear(conexion: Conexion, sesion_id: str, usuario_id: int, creada_en: datetime, expira_en: datetime) -> None:
    conexion.execute(
        "INSERT INTO sesion (id, usuario_id, creada_en, expira_en) VALUES (%s::uuid, %s, %s, %s)",
        [sesion_id, usuario_id, creada_en, expira_en],
    )


def esta_vigente(conexion: Conexion, sesion_id: str, usuario_id: int) -> bool:
    """La sesión existe, pertenece al usuario, no fue revocada y no ha vencido."""
    fila = conexion.execute(
        "SELECT 1 AS vigente FROM sesion WHERE id = %s::uuid AND usuario_id = %s"
        " AND revocada_en IS NULL AND expira_en > now()",
        [sesion_id, usuario_id],
    ).fetchone()
    return fila is not None


def revocar(conexion: Conexion, sesion_id: str) -> None:
    conexion.execute(
        "UPDATE sesion SET revocada_en = now() WHERE id = %s::uuid AND revocada_en IS NULL",
        [sesion_id],
    )
