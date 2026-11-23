"""Comandos de administración (ejecutar desde ``backend/``).

    python -m app.cli migrar
    python -m app.cli crear-usuario --nombre "Nombre" --correo admin@espe.edu.ec --rol administrador
"""

from __future__ import annotations

import argparse
import getpass
import sys

from app.config import Configuracion, ErrorConfiguracion, cargar_archivo_env
from app.db import abridor_psycopg
from app.migraciones import aplicar_migraciones
from app.servicios import usuarios
from app.servicios.errores import ErrorServicio


def main(argumentos: list[str] | None = None) -> int:
    analizador = argparse.ArgumentParser(prog="python -m app.cli")
    comandos = analizador.add_subparsers(dest="comando", required=True)
    comandos.add_parser("migrar", help="Crea o actualiza las tablas de la base de datos")
    nuevo = comandos.add_parser("crear-usuario", help="Crea una cuenta (pide la contraseña)")
    nuevo.add_argument("--nombre", required=True)
    nuevo.add_argument("--correo", required=True)
    nuevo.add_argument("--rol", required=True, choices=usuarios.ROLES)
    args = analizador.parse_args(argumentos)

    cargar_archivo_env()
    try:
        config = Configuracion.desde_entorno()
    except ErrorConfiguracion as exc:
        print(f"Configuración incompleta: {exc}", file=sys.stderr)
        return 2
    conexion = abridor_psycopg(config.url_base_datos)()
    try:
        if args.comando == "migrar":
            aplicadas = aplicar_migraciones(conexion)
            print("Migraciones aplicadas: " + (", ".join(aplicadas) or "ninguna pendiente"))
            return 0
        contrasena = getpass.getpass("Contraseña (mínimo 10 caracteres): ")
        if contrasena != getpass.getpass("Repita la contraseña: "):
            print("Las contraseñas no coinciden.", file=sys.stderr)
            return 1
        try:
            usuario = usuarios.crear(conexion, args.nombre, args.correo, contrasena, args.rol)
        except ErrorServicio as exc:
            print(exc.mensaje, file=sys.stderr)
            return 1
        print(f"Cuenta creada: {usuario['correo']} ({usuario['rol']}), id {usuario['id']}.")
        return 0
    finally:
        conexion.close()


if __name__ == "__main__":
    sys.exit(main())
