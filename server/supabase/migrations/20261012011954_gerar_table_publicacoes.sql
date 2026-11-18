create table public.publicacoes (
  id uuid not null default gen_random_uuid (),
  criado_em date not null,
  autor_email text not null,
  titulo text not null,
  descricao text not null,
  categoria public.categoria not null,
  imagem text null,
  contato text null,
  anexos text[] null,
  expiracao date not null,
  qtd_visualizacoes smallint not null,
  constraint publicacoes_pkey primary key (id),
  constraint publicacoes_autor_email_fkey foreign KEY (autor_email) references usuarios (email)
) TABLESPACE pg_default;