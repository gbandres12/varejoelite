
import React from 'react';
import { KPI, KPICategory } from '../types';

interface GoalCardProps {
  kpi: KPI;
}

const GoalCard: React.FC<GoalCardProps> = ({ kpi }) => {
  const isBetterLower = kpi.name.toLowerCase().includes('perda') || kpi.name.toLowerCase().includes('custo');
  
  let percentage = 0;
  if (isBetterLower) {
    percentage = (kpi.target / kpi.actual) * 100;
  } else {
    percentage = (kpi.actual / kpi.target) * 100;
  }
  
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  // Categorical Theme Mapping
  const themes = {
    [KPICategory.FINANCE]: {
      bg: 'from-emerald-50 to-white',
      border: 'border-emerald-100',
      accent: 'bg-emerald-500',
      text: 'text-emerald-700',
      lightText: 'text-emerald-400',
      icon: 'fa-money-bill-trend-up'
    },
    [KPICategory.GROWTH]: {
      bg: 'from-indigo-50 to-white',
      border: 'border-indigo-100',
      accent: 'bg-indigo-500',
      text: 'text-indigo-700',
      lightText: 'text-indigo-400',
      icon: 'fa-arrow-up-right-dots'
    },
    [KPICategory.MARKET]: {
      bg: 'from-amber-50 to-white',
      border: 'border-amber-100',
      accent: 'bg-amber-500',
      text: 'text-amber-700',
      lightText: 'text-amber-400',
      icon: 'fa-shop'
    },
    [KPICategory.LOGISTICS]: {
      bg: 'from-violet-50 to-white',
      border: 'border-violet-100',
      accent: 'bg-violet-500',
      text: 'text-violet-700',
      lightText: 'text-violet-400',
      icon: 'fa-truck-ramp-box'
    }
  };

  const theme = themes[kpi.category] || themes[KPICategory.FINANCE];

  return (
    <div className={`bg-gradient-to-b ${theme.bg} rounded-2xl shadow-sm border ${theme.border} p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}>
      {/* Background Icon Decoration */}
      <i className={`fa-solid ${theme.icon} absolute -right-4 -bottom-4 text-6xl opacity-5 group-hover:scale-110 transition-transform duration-500`}></i>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${theme.accent} text-white`}>
                {kpi.category}
              </span>
            </div>
            <h3 className="text-slate-800 text-sm font-black uppercase tracking-tight">{kpi.name}</h3>
          </div>
          <div className={`w-10 h-10 rounded-xl ${theme.accent} bg-opacity-10 flex items-center justify-center`}>
             <i className={`fa-solid ${theme.icon} ${theme.text}`}></i>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2">
          {kpi.description}
        </p>

        <div className="flex items-end justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Realizado</span>
            <span className={`text-2xl font-black ${theme.text}`}>
              {kpi.unit === 'R$' ? `R$ ${kpi.actual.toLocaleString('pt-BR')}` : `${kpi.actual}${kpi.unit}`}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Meta</span>
            <span className="block text-sm font-bold text-slate-600">
              {kpi.unit === 'R$' ? `R$ ${kpi.target.toLocaleString('pt-BR')}` : `${kpi.target}${kpi.unit}`}
            </span>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="relative pt-1">
          <div className="overflow-hidden h-3 mb-2 text-xs flex rounded-full bg-slate-100 shadow-inner">
            <div 
              style={{ width: `${clampedPercentage}%` }} 
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ${theme.accent}`}
            ></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-black">PESO: {kpi.weight}%</span>
            <span className={`text-xs font-black ${theme.text}`}>
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Decorative colored strip at the bottom */}
      <div className={`absolute bottom-0 left-0 w-full h-1 ${theme.accent} opacity-50`}></div>
    </div>
  );
};

export default GoalCard;
