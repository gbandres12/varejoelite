
import React, { useState, useEffect } from 'react';
import { Store, StoreTier } from '../types';
import GoalCard from './GoalCard';
import TierProgressBar from './TierProgressBar';
import { getStoreInsights } from '../geminiService';
import { TIER_CONFIGS } from '../constants';

interface ClientDashboardProps {
  store: Store;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ store }) => {
  const [insights, setInsights] = useState<string>('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  const calculatePerformance = () => {
    const total = store.kpis.reduce((acc, k) => {
      let p = (k.actual / k.target) * 100;
      if (k.name.toLowerCase().includes('perda')) {
         p = (k.target / k.actual) * 100;
      }
      return acc + (Math.min(p, 100) * (k.weight / 100));
    }, 0);
    return Math.round(total);
  };

  const performance = calculatePerformance();
  
  const currentTierConfig = TIER_CONFIGS.slice().reverse().find(c => performance >= c.minPercentage) || TIER_CONFIGS[0];
  const nextTierIndex = TIER_CONFIGS.findIndex(c => c.tier === currentTierConfig.tier) + 1;
  const nextTierConfig = nextTierIndex < TIER_CONFIGS.length ? TIER_CONFIGS[nextTierIndex] : null;

  // Use custom rewards from store
  const currentReward = store.customRewards[currentTierConfig.tier] || 0;
  const nextReward = nextTierConfig ? (store.customRewards[nextTierConfig.tier] || 0) : 0;

  const fetchInsights = async () => {
    setLoadingInsights(true);
    const data = await getStoreInsights(store);
    setInsights(data || '');
    setLoadingInsights(false);
  };

  useEffect(() => {
    fetchInsights();
  }, [store.id]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span 
              className="px-4 py-1.5 rounded-full text-white text-sm font-black uppercase tracking-tighter shadow-lg ring-4 ring-white"
              style={{ backgroundColor: store.tierColors[currentTierConfig.tier] }}
            >
              Nível {currentTierConfig.tier}
            </span>
            <span className="text-slate-400 text-sm font-bold">Atualizado em: {store.lastUpdate}</span>
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-4">
            <span className="text-orange-500 uppercase">{store.fantasia}</span>
          </h2>
          <p className="text-slate-500 max-w-lg mb-6 leading-relaxed">
            Bem-vindo ao seu painel de excelência. Abaixo você confere o progresso da sua unidade em direção aos prêmios deste ciclo.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
              <span className="block text-[10px] text-slate-400 uppercase font-black mb-1">Premiação Alcançada</span>
              <span className="text-2xl font-black text-emerald-600">R$ {currentReward.toLocaleString('pt-BR')}</span>
            </div>
            {nextTierConfig && (
              <div className="bg-orange-50 px-6 py-4 rounded-2xl border border-orange-100">
                <span className="block text-[10px] text-orange-400 uppercase font-black mb-1">Próximo Nível: {nextTierConfig.tier}</span>
                <span className="text-2xl font-black text-orange-600">R$ {nextReward.toLocaleString('pt-BR')}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="relative z-10 hidden lg:block">
           <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-100" />
                <circle 
                  cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" 
                  strokeDasharray={552.92} strokeDashoffset={552.92 - (552.92 * performance) / 100} 
                  className="transition-all duration-1000 ease-out" 
                  style={{ color: store.tierColors[currentTierConfig.tier] }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black text-slate-800">{performance}%</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Score Geral</span>
              </div>
           </div>
        </div>

        <div className="absolute -right-20 -top-20 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <TierProgressBar 
        currentPercentage={performance} 
        nextTierConfig={nextTierConfig ? { ...nextTierConfig, rewardValue: nextReward } : null} 
        currentTierConfig={{ ...currentTierConfig, rewardValue: currentReward }}
        tierColors={store.tierColors}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {store.kpis.map(kpi => (
          <GoalCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles text-indigo-500"></i>
              Análise Inteligente (IA)
            </h3>
            <button onClick={fetchInsights} disabled={loadingInsights} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
              {loadingInsights ? 'Processando...' : 'Recarregar Análise'}
            </button>
          </div>
          <div className="p-8 prose prose-slate max-w-none text-slate-600 leading-relaxed">
            {loadingInsights ? (
              <div className="flex flex-col items-center py-12">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-sm text-slate-400 font-medium">O consultor virtual está analisando seus dados...</p>
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br/>') }} />
            )}
          </div>
        </div>

        <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl flex flex-col">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <i className="fa-solid fa-lightbulb text-yellow-400"></i>
            Dicas Estratégicas
          </h3>
          <ul className="space-y-6 flex-1">
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold text-xs">1</div>
              <div>
                <p className="font-bold text-sm mb-1">Aumente o Ticket Médio</p>
                <p className="text-xs text-blue-200 leading-relaxed">Promova combos de produtos complementares no checkout.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold text-xs">2</div>
              <div>
                <p className="font-bold text-sm mb-1">Ruptura Zero</p>
                <p className="text-xs text-blue-200 leading-relaxed">Garanta que os itens curva A nunca faltem no final de semana.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold text-xs">3</div>
              <div>
                <p className="font-bold text-sm mb-1">Volume em Toneladas</p>
                <p className="text-xs text-blue-200 leading-relaxed">Ações de atacarejo para grandes volumes de um mesmo SKU.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
