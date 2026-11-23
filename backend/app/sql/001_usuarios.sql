-- Usuarios del sistema y sus roles (administrador o docente).
-- Cada sentencia termina en ";" al final de la línea: así las separa el aplicador de migraciones.

CREATE TABLE usuario (
    id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre           varchar(120) NOT NULL CHECK (btrim(nombre) <> ''),
    correo           varchar(254) NOT NULL CHECK (correo ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
    hash_contrasena  text         NOT NULL,
    rol              varchar(20)  NOT NULL CHECK (rol IN ('administrador', 'docente')),
    activo           boolean      NOT NULL DEFAULT true,
    creado_en        timestamptz  NOT NULL DEFAULT now(),
    actualizado_en   timestamptz  NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX usuario_correo_uk ON usuario (lower(correo));

COMMENT ON TABLE usuario IS 'Cuentas de acceso. El correo es único sin distinguir mayúsculas.';
