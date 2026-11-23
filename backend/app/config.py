"""Configuración del backend, leída de variables de entorno o del archivo ``backend/.env``."""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

RAIZ_BACKEND = Path(__file__).resolve().parents[1]
LONGITUD_MINIMA_SECRETO = 32


class ErrorConfiguracion(RuntimeError):
    """Falta una variable obligatoria o tiene un valor no válido."""


def cargar_archivo_env(ruta: Path = RAIZ_BACKEND / ".env") -> None:
    """Carga líneas ``CLAVE=valor`` de ``.env`` sin sobrescribir variables ya definidas."""
    if not ruta.is_file():
        return
    for linea in ruta.read_text(encoding="utf-8").splitlines():
        linea = linea.strip()
        if not linea or linea.startswith("#") or "=" not in linea:
            continue
        clave, valor = (parte.strip() for parte in linea.split("=", 1))
        if len(valor) >= 2 and valor[0] == valor[-1] and valor[0] in "\"'":
            valor = valor[1:-1]
        os.environ.setdefault(clave, valor)


@dataclass(frozen=True)
class Configuracion:
    url_base_datos: str
    secreto_jwt: str
    minutos_validez_token: int = 480
    origenes_cors: tuple[str, ...] = ("http://localhost:5173",)

    @classmethod
    def desde_entorno(cls) -> Configuracion:
        url = os.environ.get("DATABASE_URL", "").strip()
        if not url:
            raise ErrorConfiguracion("Falta DATABASE_URL")
        secreto = os.environ.get("JWT_SECRETO", "")
        if len(secreto) < LONGITUD_MINIMA_SECRETO:
            raise ErrorConfiguracion(
                f"JWT_SECRETO debe tener al menos {LONGITUD_MINIMA_SECRETO} caracteres"
            )
        minutos = os.environ.get("JWT_MINUTOS_VALIDEZ", "480").strip()
        if not minutos.isdigit() or int(minutos) <= 0:
            raise ErrorConfiguracion("JWT_MINUTOS_VALIDEZ debe ser un entero positivo")
        origenes = tuple(
            origen.strip()
            for origen in os.environ.get("ORIGENES_CORS", "http://localhost:5173").split(",")
            if origen.strip()
        )
        return cls(
            url_base_datos=url,
            secreto_jwt=secreto,
            minutos_validez_token=int(minutos),
            origenes_cors=origenes,
        )
