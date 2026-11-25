# Backend · Sistema de diagnóstico POO

API REST en Python con FastAPI, PostgreSQL (psycopg) y sesiones con JWT (PyJWT).
Alcance actual: conexión a PostgreSQL y autenticación de usuarios con roles **administrador** y
**docente**. El análisis de código, los diagnósticos y las integraciones se incorporarán después.

## Estructura

```text
backend/
  app/
    main.py            aplicación FastAPI (CORS, rutas, manejo de errores)
    config.py          configuración desde variables de entorno o backend/.env
    db.py              conexión a PostgreSQL
    migraciones.py     aplica los archivos de app/sql/ en orden
    sql/               esquema de la base (001_usuarios.sql, 002_sesiones.sql)
    seguridad.py       hash de contraseñas (scrypt) y tokens JWT
    repositorios/      consultas SQL
    servicios/         reglas de autenticación y gestión de cuentas
    api/               rutas, esquemas de entrada/salida y dependencias (sesión y roles)
    cli.py             comandos: migrar y crear-usuario
  tests/               pruebas con PostgreSQL real
```

## Puesta en marcha (Windows, PowerShell)

Requisitos: Python 3.10 o superior y PostgreSQL 18 en `localhost:5432`, con la base
`Sistema-de-diagnostico` creada.

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
copy .env.example .env      # luego edite .env: DATABASE_URL y JWT_SECRETO
python -m app.cli migrar
python -m app.cli crear-usuario --nombre "Administrador" --correo admin@espe.edu.ec --rol administrador
fastapi dev app/main.py     # http://localhost:8000 · documentación en http://localhost:8000/docs
```

Comprobación: `http://localhost:8000/api/salud` debe responder `{"estado":"ok","base_datos":true}`.

## Rutas

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/salud` | público | Verifica la conexión con PostgreSQL |
| POST | `/api/auth/login` | público | `{correo, contrasena}` → `{token, tipo, expira_en, usuario}` |
| POST | `/api/auth/logout` | autenticado | Cierra la sesión del token (204); el token deja de aceptarse |
| POST | `/api/auth/renovar` | autenticado | Reemplaza la sesión por una nueva con otro vencimiento |
| GET | `/api/auth/sesion` | autenticado | Usuario de la sesión (restaura la sesión en el frontend) |
| GET | `/api/usuarios` | administrador | Lista de cuentas |
| POST | `/api/usuarios` | administrador | Crea una cuenta `{nombre, correo, contrasena, rol, activo}` (`activo` opcional, por defecto `true`) |
| PATCH | `/api/usuarios/{id}` | administrador | Cambia `nombre`, `correo`, `rol`, `activo` o `contrasena` |
| DELETE | `/api/usuarios/{id}` | administrador | Elimina una cuenta sin información asociada (204) |

Las rutas protegidas requieren `Authorization: Bearer <token>`. Los errores responden
`{"detail": "mensaje"}` con 401 (sin sesión o credenciales incorrectas), 403 (cuenta inactiva o rol
sin permiso), 404, 409 (correo repetido o cambio no permitido) o 422 (datos no válidos).

Reglas de acceso:
- Las contraseñas se guardan con hash `scrypt`; mínimo 10 caracteres.
- Un correo inexistente y una contraseña incorrecta reciben la misma respuesta.
- Cada token pertenece a una sesión registrada en la tabla `sesion`. Al cerrar sesión o renovarla,
  el token anterior deja de aceptarse aunque no haya vencido. Cerrar una sesión no afecta a las demás.
- Una cuenta desactivada no puede ingresar y pierde la sesión que tuviera abierta.
- El administrador no puede desactivarse, eliminarse ni quitarse su propio rol.
- Una cuenta con información asociada (grupos, diagnósticos) no se elimina: se desactiva.

## Pruebas

Cree una base **solo para pruebas** (su esquema `public` se borra en cada ejecución), indíquela en
`TEST_DATABASE_URL` dentro de `.env` y ejecute:

```powershell
createdb -U postgres sistema_diagnostico_pruebas
pytest
```
