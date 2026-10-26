alter type public.categoria rename to categoria_old;

create type public.categoria as enum (
    'Avisos Administrativos',
    'Bolsas',
    'Comunidade',
    'Divulgação',
    'Estágios',
    'Eventos'
);

alter table public.publicacoes
  alter column categoria type public.categoria
  using (
    case categoria::text
      when 'Bolsa' then 'Bolsas'
      when 'Estágio' then 'Estágios'
      when 'Evento' then 'Eventos'
      when 'Oficina' then 'Eventos'
      when 'Processo Seletivo' then 'Divulgação'
    end
  )::public.categoria;

drop type public.categoria_old;
