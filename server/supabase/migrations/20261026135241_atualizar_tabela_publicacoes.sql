alter table public.publicacoes
  alter column criado_em type timestamp without time zone using criado_em::timestamp,
  alter column criado_em set default now(),
  alter column qtd_visualizacoes set default 0;

alter table public.publicacoes
  add column link text null,
  add column telefone text null,
  add column email text null;

alter table public.publicacoes drop column contato;

alter table public.publicacoes drop column anexos;
alter table public.publicacoes add column anexos json[] null;