-- CRIAÇÃO DA TABELA DE LOJAS
create table public.stores (
  id text primary key,
  code text unique not null,
  razao_social text not null,
  fantasia text not null,
  manager text not null,
  kpis jsonb default '[]'::jsonb,
  custom_rewards jsonb default '{}'::jsonb,
  tier_colors jsonb default '{}'::jsonb,
  last_update text
);

-- HABILITAR RLS (Segurança)
alter table public.stores enable row level security;

-- POLÍTICAS DE ACESSO (Simples para MVP: todos podem ler/escrever se tiverem a chave)
-- Em produção, você deve restringir isso com Autenticação
create policy "Acesso público irrestrito" on public.stores
for all using (true) with check (true);
