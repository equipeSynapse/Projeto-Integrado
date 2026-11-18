export const schema = `

-- ENUMs

-- ENUM de Categorias

DO $$ BEGIN
    CREATE TYPE categoria AS ENUM ('Avisos Administrativos', 'Bolsas', 'Comunidade', 'Divulgação', 'Estágio', 'Eventos');
    EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ENUM de Status de Denúncia

DO $$ BEGIN
    CREATE TYPE status_denuncia AS ENUM ('PENDENTE', 'APROVADA', 'REJEITADA');
    EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- Tabelas

-- 1. Usuários

create table if not exists public.usuarios (
  email text not null,
  nome_completo text not null,
  nome_usuario text not null,
  senha text not null,
  ativo boolean not null default false,
  token json null,
  bio text null,
  constraint usuarios_pkey primary key (email),
  constraint usuarios_nome_usuario_key unique (nome_usuario)
) TABLESPACE pg_default;

-- 2. Usuários_Categorias

create table if not exists public.usuarios_categorias (
  email_usuario text not null,
  categoria public.categoria not null,
  constraint usuarios_categorias_pkey primary key (email_usuario, categoria),
  constraint usuarios_categorias_email_usuario_fkey foreign KEY (email_usuario) references usuarios (email) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

-- 3. Publicações

create table if not exists public.publicacoes (
  id uuid not null default gen_random_uuid (),
  criado_em timestamp without time zone not null default now(),
  autor_email text not null,
  titulo text not null,
  descricao text not null,
  categoria categoria[] null,
  imagem json null,
  link text null,
  expiracao date not null,
  qtd_visualizacoes smallint not null default '0'::smallint,
  telefone text null,
  email text null,
  anexo json null,
  constraint publicacoes_pkey primary key (id),
  constraint publicacoes_autor_email_fkey foreign KEY (autor_email) references usuarios (email)
) TABLESPACE pg_default;

-- 4. Denúncias

create table if not exists public.denuncias (
  id uuid not null default gen_random_uuid (),
  usuario_email text not null,
  publicacao_id uuid null,
  titulo_publicacao text not null,
  motivo text not null,
  descricao text null,
  status public.status_denuncia not null default 'PENDENTE'::status_denuncia,
  criada_em timestamp without time zone not null default now(),
  constraint denuncias_pkey primary key (id),
  constraint unique_denuncia_user_publicacao unique (usuario_email, publicacao_id),
  constraint denuncias_publicacao_id_fkey foreign KEY (publicacao_id) references publicacoes (id) on update CASCADE on delete set null,
  constraint denuncias_usuario_email_fkey foreign KEY (usuario_email) references usuarios (email) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

-- 5. Notificações

create table if not exists public.notificacoes (
  id uuid not null default gen_random_uuid (),
  gerada_em timestamp without time zone not null default now(),
  tipo text not null,
  publicacao_id uuid null,
  denuncia_id uuid null,
  constraint notificacoes_pkey primary key (id),
  constraint notificacoes_denuncia_id_fkey foreign KEY (denuncia_id) references denuncias (id) on update CASCADE on delete CASCADE,
  constraint notificacoes_publicacao_id_fkey foreign KEY (publicacao_id) references publicacoes (id) on update CASCADE on delete CASCADE,
  constraint check_notificacao_origem check (
    (
      (
        (tipo = 'PUBLICACAO_NOVA'::text)
        and (publicacao_id is not null)
        and (denuncia_id is null)
      )
      or (
        (tipo = 'STATUS_DENUNCIA'::text)
        and (denuncia_id is not null)
        and (publicacao_id is null)
      )
    )
  )
) TABLESPACE pg_default;

-- 6. Notificações-Usuários

create table if not exists public.notificacoes_usuarios (
  notificacao_id uuid not null,
  usuario_email text not null default ''::text,
  lida boolean not null default false,
  constraint notificacoes_usuarios_pkey primary key (notificacao_id, usuario_email),
  constraint notificacoes_usuarios_notificacao_id_fkey foreign KEY (notificacao_id) references notificacoes (id) on update CASCADE on delete CASCADE,
  constraint notificacoes_usuarios_usuario_email_fkey foreign KEY (usuario_email) references usuarios (email) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;`