"""Error de negocio con el código HTTP y el mensaje que verá el usuario."""

from __future__ import annotations


class ErrorServicio(Exception):
    def __init__(self, estado_http: int, mensaje: str) -> None:
        super().__init__(mensaje)
        self.estado_http = estado_http
        self.mensaje = mensaje
