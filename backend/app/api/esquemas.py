"""Modelos de entrada y salida de la API."""

from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

PATRON_CORREO = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
Rol = Literal["administrador", "docente"]


class _Entrada(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class InicioSesion(_Entrada):
    correo: str = Field(min_length=3, max_length=254, pattern=PATRON_CORREO)
    contrasena: str = Field(min_length=1, max_length=200)


class NuevoUsuario(_Entrada):
    nombre: str = Field(min_length=1, max_length=120)
    correo: str = Field(min_length=3, max_length=254, pattern=PATRON_CORREO)
    contrasena: str = Field(min_length=10, max_length=200)
    rol: Rol


class CambiosUsuario(_Entrada):
    nombre: Optional[str] = Field(default=None, min_length=1, max_length=120)
    rol: Optional[Rol] = None
    activo: Optional[bool] = None
    contrasena: Optional[str] = Field(default=None, min_length=10, max_length=200)


class Usuario(BaseModel):
    id: int
    nombre: str
    correo: str
    rol: Rol
    activo: bool
    creado_en: datetime


class Sesion(BaseModel):
    token: str
    tipo: Literal["Bearer"] = "Bearer"
    usuario: Usuario


class Salud(BaseModel):
    estado: Literal["ok", "degradado"]
    base_datos: bool
