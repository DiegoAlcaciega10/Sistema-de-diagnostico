-- Sesiones abiertas. Cada token lleva el identificador de su sesión; al cerrar sesión se marca como
-- revocada y el token deja de aceptarse aunque todavía no haya vencido.

CREATE TABLE sesion (
    id           uuid        PRIMARY KEY,
    usuario_id   bigint      NOT NULL REFERENCES usuario (id) ON DELETE CASCADE,
    creada_en    timestamptz NOT NULL DEFAULT now(),
    expira_en    timestamptz NOT NULL,
    revocada_en  timestamptz,
    CONSTRAINT sesion_vigencia_ck CHECK (expira_en > creada_en)
);

CREATE INDEX sesion_usuario_activa_idx ON sesion (usuario_id) WHERE revocada_en IS NULL;

COMMENT ON TABLE sesion IS 'Sesiones emitidas; una sesión revocada o vencida invalida su token.';
