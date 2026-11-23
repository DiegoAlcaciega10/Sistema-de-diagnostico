"""Consultas SQL sobre la tabla ``usuario``."""

from __future__ import annotations

from typing import Any

from app.db import Conexion, Fila

COLUMNAS_PUBLICAS = "id, nombre, correo, rol, activo, creado_en"
_COLUMNAS_ACTUALIZABLES = ("nombre", "rol", "activo", "hash_contrasena")


def buscar_por_correo(conexion: Conexion, correo: str) -> Fila | None:
    return conexion.execute(
        f"SELECT {COLUMNAS_PUBLICAS}, hash_contrasena FROM usuario WHERE lower(correo) = lower(%s)",
        [correo.strip()],
    ).fetchone()


def buscar_por_id(conexion: Conexion, usuario_id: int) -> Fila | None:
    return conexion.execute(
        f"SELECT {COLUMNAS_PUBLICAS} FROM usuario WHERE id = %s", [usuario_id]
    ).fetchone()


def listar(conexion: Conexion) -> list[Fila]:
    return conexion.execute(
        f"SELECT {COLUMNAS_PUBLICAS} FROM usuario ORDER BY rol, nombre, id"
    ).fetchall()


def crear(conexion: Conexion, nombre: str, correo: str, hash_contrasena: str, rol: str) -> Fila | None:
    """Inserta un usuario. Devuelve ``None`` si el correo ya está registrado."""
    return conexion.execute(
        "INSERT INTO usuario (nombre, correo, hash_contrasena, rol) VALUES (%s, %s, %s, %s) "
        f"ON CONFLICT DO NOTHING RETURNING {COLUMNAS_PUBLICAS}",
        [nombre.strip(), correo.strip(), hash_contrasena, rol],
    ).fetchone()


def actualizar(conexion: Conexion, usuario_id: int, cambios: dict[str, Any]) -> Fila | None:
    """Actualiza solo las columnas permitidas. Devuelve ``None`` si el usuario no existe."""
    columnas = [c for c in _COLUMNAS_ACTUALIZABLES if c in cambios]
    if not columnas:
        return buscar_por_id(conexion, usuario_id)
    asignaciones = ", ".join(f"{columna} = %s" for columna in columnas)
    return conexion.execute(
        f"UPDATE usuario SET {asignaciones}, actualizado_en = now() WHERE id = %s "
        f"RETURNING {COLUMNAS_PUBLICAS}",
        [*(cambios[c] for c in columnas), usuario_id],
    ).fetchone()
