
import { StoreTier, TierConfig, Store, KPICategory } from './types';

export const TIER_CONFIGS: TierConfig[] = [
  {
    tier: StoreTier.NONE,
    minPercentage: 0,
    rewardValue: 0,
    color: 'bg-slate-400',
    icon: 'fa-star-half-stroke'
  },
  {
    tier: StoreTier.BRONZE,
    minPercentage: 60,
    rewardValue: 1500,
    color: 'bg-amber-600',
    icon: 'fa-medal'
  },
  {
    tier: StoreTier.SILVER,
    minPercentage: 75,
    rewardValue: 4000,
    color: 'bg-slate-300',
    icon: 'fa-award'
  },
  {
    tier: StoreTier.GOLD,
    minPercentage: 85,
    rewardValue: 8000,
    color: 'bg-yellow-400',
    icon: 'fa-trophy'
  },
  {
    tier: StoreTier.ELITE,
    minPercentage: 95,
    rewardValue: 15000,
    color: 'bg-cyan-400',
    icon: 'fa-crown'
  }
];

export const INITIAL_REWARDS: Record<StoreTier, number> = {
  [StoreTier.NONE]: 0,
  [StoreTier.BRONZE]: 1500,
  [StoreTier.SILVER]: 4000,
  [StoreTier.GOLD]: 8000,
  [StoreTier.ELITE]: 15000,
};

export const INITIAL_COLORS: Record<StoreTier, string> = {
  [StoreTier.NONE]: '#94a3b8',
  [StoreTier.BRONZE]: '#d97706',
  [StoreTier.SILVER]: '#cbd5e1',
  [StoreTier.GOLD]: '#facc15',
  [StoreTier.ELITE]: '#22d3ee',
};

export const INITIAL_STORES: Store[] = [
  {
    id: '1',
    code: '1001',
    razaoSocial: 'CENTRAL DE ALIMENTOS LTDA',
    fantasia: 'Supermercado Central',
    manager: 'Carlos Silva',
    lastUpdate: '2023-11-20',
    customRewards: { ...INITIAL_REWARDS },
    tierColors: { ...INITIAL_COLORS },
    kpis: [
      { id: 'k1', name: 'Meta do Trimestre', description: 'Volume total de vendas brutas faturadas no período.', category: KPICategory.FINANCE, target: 1500000, actual: 1250000, unit: 'R$', weight: 30 },
      { id: 'k2', name: 'Crescimento vs Ano Anterior', description: 'Percentual de evolução real comparado ao mesmo trimestre do ano passado.', category: KPICategory.GROWTH, target: 15, actual: 12, unit: '%', weight: 25 },
      { id: 'k3', name: 'Participação no PDV', description: 'Presença de nossos produtos em gôndola e pontos extras.', category: KPICategory.MARKET, target: 25, actual: 22, unit: '%', weight: 25 },
      { id: 'k4', name: 'Volume (Toneladas)', description: 'Peso total líquido de mercadorias entregues e aceitas.', category: KPICategory.LOGISTICS, target: 80, actual: 72, unit: 'ton', weight: 20 },
    ]
  }
];
