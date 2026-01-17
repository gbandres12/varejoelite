
export enum StoreTier {
  NONE = 'Iniciante',
  BRONZE = 'Bronze',
  SILVER = 'Prata',
  GOLD = 'Ouro',
  ELITE = 'Elite (Diamante)'
}

export enum KPICategory {
  FINANCE = 'Financeiro',
  GROWTH = 'Crescimento',
  MARKET = 'Mercado',
  LOGISTICS = 'Operacional'
}

export interface KPI {
  id: string;
  name: string;
  description: string;
  category: KPICategory;
  target: number;
  actual: number;
  unit: string;
  weight: number;
}

export interface Store {
  id: string;
  code: string;
  razaoSocial: string;
  fantasia: string;
  manager: string;
  kpis: KPI[];
  lastUpdate: string;
  customRewards: Record<StoreTier, number>;
  tierColors: Record<StoreTier, string>;
}

export interface TierConfig {
  tier: StoreTier;
  minPercentage: number;
  rewardValue: number; // Default value
  color: string;
  icon: string;
}

export type UserRole = 'ADMIN' | 'CLIENT';
