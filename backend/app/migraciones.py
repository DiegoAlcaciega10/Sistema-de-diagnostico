"""Aplicación ordenada de las migraciones SQL de ``app/sql/``.

Cada archivo se aplica una sola vez, dentro de una transacción, y queda registrado en la tabla
``migracion_aplicada``. Las sentencias se separan por un ";" al final de la línea.
"""

from __future__ import annotations

import re
from pathlib import Path

from app.db import Conexion

DIRECTORIO_SQL = Path(__file__).with_name("sql")
_FIN_SENTENCIA = re.compile(r";[ \t]*(?:\r?\n|$)")


def sentencias(texto: str) -> list[str]:
    sin_comentarios = "\n".join(
        linea for linea in texto.splitlines() if not linea.lstrip().startswith("--")
    )
    return [s.strip() for s in _FIN_SENTENCIA.split(sin_comentarios) if s.strip()]


def aplicar_migraciones(conexion: Conexion) -> list[str]:
    """Aplica las migraciones pendientes y devuelve los nombres de las aplicadas."""
    conexion.execute(
        "CREATE TABLE IF NOT EXISTS migracion_aplicada ("
        " version varchar(100) PRIMARY KEY,"
        " aplicada_en timestamptz NOT NULL DEFAULT now())"
    )
    aplicadas = {
        fila["version"] for fila in conexion.execute("SELECT version FROM migracion_aplicada").fetchall()
    }
    nuevas: list[str] = []
    for archivo in sorted(DIRECTORIO_SQL.glob("[0-9][0-9][0-9]_*.sql")):
        if archivo.stem in aplicadas:
            continue
        with conexion.transaction():
            for sentencia in sentencias(archivo.read_text(encoding="utf-8")):
                conexion.execute(sentencia)
            conexion.execute("INSERT INTO migracion_aplicada (version) VALUES (%s)", [archivo.stem])
        nuevas.append(archivo.stem)
    return nuevas
