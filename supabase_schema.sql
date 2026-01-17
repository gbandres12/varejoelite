  -- ==============================================================================
-- 1. LIMPEZA (CUIDADO: Isso apaga dados existentes se você rodar novamente)
-- ==============================================================================
DROP TABLE IF EXISTS public.stores;

-- ==============================================================================
-- 2. CRIAÇÃO DA TABELA 'STORES' (LOJAS)
-- Armazena os dados cadastrais, KPIs e configurações de cada unidade.
-- ==============================================================================
CREATE TABLE public.stores (
    -- Identificador único (usamos text para compatibilidade com o frontend atual)
    id text PRIMARY KEY,
    
    -- Código da Loja (ex: "1001"), deve ser único
    code text UNIQUE NOT NULL,
    
    -- Razão Social oficial
    razao_social text NOT NULL,
    
    -- Nome Fantasia exibido no painel
    fantasia text NOT NULL,
    
    -- Nome do Gerente responsável
    manager text NOT NULL,
    
    -- KPIs (Indicadores) armazenados como JSONB para flexibilidade total
    -- Ex: [{ "id": "k1", "name": "Vendas", "target": 100, "actual": 80 ... }]
    kpis jsonb DEFAULT '[]'::jsonb,
    
    -- Configurações de Premiação customizadas por nível (Bronze, Prata, Ouro...)
    custom_rewards jsonb DEFAULT '{}'::jsonb,
    
    -- Cores customizadas por nível
    tier_colors jsonb DEFAULT '{}'::jsonb,
    
    -- Data da última atualização (formatada como texto pelo frontend)
    last_update text,
    
    -- Controle interno de criação (opcional, bom para auditoria)
    created_at timestamptz DEFAULT now()
);

-- ==============================================================================
-- 3. SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- ==============================================================================
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 4. POLÍTICAS DE ACESSO (PERMISSÕES)
-- IMPORTANTE: Para este MVP, estamos permitindo leitura e escrita pública (Anon).
-- Em um cenário real de produção, você deve restringir isso.
-- ==============================================================================

-- Permitir LEITURA (SELECT) para todos (qualquer usuário com a chave pública/anon)
CREATE POLICY "Permitir Leitura Pública" 
ON public.stores
FOR SELECT 
USING (true);

-- Permitir ESCRITA (INSERT/UPDATE/DELETE) para todos
-- Isso permite que o Frontend atualize os dados. 
CREATE POLICY "Permitir Escrita Pública" 
ON public.stores
FOR ALL 
USING (true) 
WITH CHECK (true);

-- ==============================================================================
-- 5. DADOS INICIAIS (SEED) - Opcional
-- Insere a loja de exemplo "Supermercado Central"
-- ==============================================================================
INSERT INTO public.stores (id, code, razao_social, fantasia, manager, last_update, kpis, custom_rewards, tier_colors)
VALUES (
  '1', 
  '1001', 
  'CENTRAL DE ALIMENTOS LTDA', 
  'Supermercado Central', 
  'Carlos Silva',
  '2024-01-16',
  '[
      {"id": "k1", "name": "Meta do Trimestre", "unit": "R$", "actual": 1250000, "target": 1500000, "weight": 30, "category": "FINANCE", "description": "Volume total de vendas brutas faturadas no período."},
      {"id": "k2", "name": "Crescimento vs Ano Anterior", "unit": "%", "actual": 12, "target": 15, "weight": 25, "category": "GROWTH", "description": "Percentual de evolução real comparado ao mesmo trimestre do ano passado."},
      {"id": "k3", "name": "Participação no PDV", "unit": "%", "actual": 22, "target": 25, "weight": 25, "category": "MARKET", "description": "Presença de nossos produtos em gôndola e pontos extras."},
      {"id": "k4", "name": "Volume (Toneladas)", "unit": "ton", "actual": 72, "target": 80, "weight": 20, "category": "LOGISTICS", "description": "Peso total líquido de mercadorias entregues e aceitas."}
   ]'::jsonb,
   '{
      "NONE": 0,
      "GOLD": 8000,
      "ELITE": 15000,
      "BRONZE": 1500,
      "SILVER": 4000
    }'::jsonb,
    '{
      "NONE": "#94a3b8",
      "GOLD": "#facc15",
      "ELITE": "#22d3ee",
      "BRONZE": "#d97706",
      "SILVER": "#cbd5e1"
    }'::jsonb
);
