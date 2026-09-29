ALTER TABLE usuarios
RENAME COLUMN nome TO nome_completo;

ALTER TABLE usuarios
ADD COLUMN username VARCHAR(50);

ALTER TABLE usuarios
ADD CONSTRAINT usuarios_username_unique UNIQUE (username);