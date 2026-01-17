
import React from 'react';
import { TIER_CONFIGS } from '../constants';
import { StoreTier, TierConfig } from '../types';

interface TierProgressBarProps {
  currentPercentage: number;
  nextTierConfig: TierConfig | null;
  currentTierConfig: TierConfig;
  tierColors: Record<StoreTier, string>;
}

const TierProgressBar: React.FC<TierProgressBarProps> = ({ currentPercentage, nextTierConfig, currentTierConfig, tierColors }) => {
  const missingPercentage = nextTierConfig ? Math.max(0, nextTierConfig.minPercentage - currentPercentage) : 0;
  const missingReward = nextTierConfig ? nextTierConfig.rewardValue - currentTierConfig.rewardValue : 0;

  // Find the color of the current progress based on the current tier
  const activeColor = tierColors[currentTierConfig.tier];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-800 p-6 text-white flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <i className="fa-solid fa-ranking-star text-orange-400"></i>
            Trilha da Excelência
          </h2>
          <p className="text-slate-400 text-sm mt-1">Acompanhe sua evolução e desbloqueie prêmios incríveis.</p>
        </div>
        <div className="mt-4 md:mt-0 bg-white/10 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md text-center">
          <span className="text-xs uppercase font-bold text-slate-300 block">Sua Pontuação Geral</span>
          <span className="text-3xl font-black" style={{ color: activeColor === tierColors[StoreTier.NONE] ? '#fb923c' : activeColor }}>{currentPercentage}%</span>
        </div>
      </div>

      <div className="p-8">
        <div className="relative mb-12">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 -translate-y-1/2 z-10 transition-all duration-1000"
            style={{ width: `${currentPercentage}%`, backgroundColor: activeColor }}
          ></div>

          <div className="flex justify-between items-center relative z-20">
            {TIER_CONFIGS.map((config, idx) => {
              const isReached = currentPercentage >= config.minPercentage;
              const customColor = tierColors[config.tier];
              const isNext = !isReached && (idx === 0 || currentPercentage >= TIER_CONFIGS[idx-1].minPercentage);

              return (
                <div key={config.tier} className="flex flex-col items-center group">
                  <div 
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-4
                      ${isReached ? `shadow-lg scale-110` : 'bg-white border-slate-100 shadow-sm'}
                      ${isNext ? 'ring-4 ring-orange-500/20 animate-pulse' : ''}
                    `}
                    style={{ 
                      backgroundColor: isReached ? customColor : 'white',
                      borderColor: isReached ? 'white' : '#f1f5f9'
                    }}
                  >
                    <i className={`fa-solid ${config.icon} ${isReached ? 'text-white' : 'text-slate-300'} text-lg`}></i>
                  </div>
                  <div className="mt-4 text-center">
                    <span className={`block text-xs font-black uppercase tracking-tighter ${isReached ? 'text-slate-800' : 'text-slate-400'}`}>
                      {config.tier}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-bold">
                      {config.minPercentage}%+
                    </span>
                    {config.rewardValue > 0 && (
                      <span className={`mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${isReached ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        R$ {config.rewardValue.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {nextTierConfig && (
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-4">
              <div 
                className="text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                style={{ backgroundColor: tierColors[nextTierConfig.tier] }}
              >
                <i className="fa-solid fa-flag-checkered"></i>
              </div>
              <div>
                <p className="text-sm font-bold text-orange-800">
                  Faltam apenas <span className="text-lg font-black">{missingPercentage}%</span> para o nível <span className="uppercase">{nextTierConfig.tier}</span>!
                </p>
                <p className="text-xs text-orange-600 font-medium">
                  Garanta mais <span className="font-bold">R$ {missingReward.toLocaleString('pt-BR')}</span> em premiação alcançando este objetivo.
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-2 bg-orange-200 rounded-full overflow-hidden">
                <div 
                  className="h-full" 
                  style={{ 
                    width: `${(currentPercentage / nextTierConfig.minPercentage) * 100}%`,
                    backgroundColor: activeColor
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TierProgressBar;
