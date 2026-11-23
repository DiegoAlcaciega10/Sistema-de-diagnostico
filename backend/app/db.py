"""Conexión a PostgreSQL con psycopg 3.

Las conexiones trabajan en modo *autocommit*: cada sentencia se confirma al ejecutarse. Cuando una
operación necesite varias sentencias atómicas, se agrupan con ``conexion.transaction()``.
"""

from __future__ import annotations

from collections.abc import Callable, Sequence
from contextlib import AbstractContextManager
from typing import Any, Protocol

Fila = dict[str, Any]


class Cursor(Protocol):
    def fetchone(self) -> Fila | None: ...

    def fetchall(self) -> list[Fila]: ...


class Conexion(Protocol):
    def execute(self, consulta: str, parametros: Sequence[Any] | None = None) -> Cursor: ...

    def transaction(self) -> AbstractContextManager[Any]: ...

    def close(self) -> None: ...


AbridorConexiones = Callable[[], Conexion]


def abridor_psycopg(url_base_datos: str) -> AbridorConexiones:
    """Devuelve una función que abre conexiones psycopg con filas en forma de diccionario."""
    import psycopg
    from psycopg.rows import dict_row

    def abrir() -> Conexion:
        conexion: Conexion = psycopg.connect(url_base_datos, row_factory=dict_row, autocommit=True)
        return conexion

    return abrir
