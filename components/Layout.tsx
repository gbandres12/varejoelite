
import React from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  activeStore: string;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, activeStore, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Header */}
      <header className="bg-slate-900 text-white shadow-xl px-6 py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <div className="bg-orange-500 p-2 rounded-xl shadow-lg">
            <i className="fa-solid fa-chart-line text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">Varejo<span className="text-orange-400">Elite</span></h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Painel {role === 'ADMIN' ? 'Master' : 'de Excelência'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex flex-col text-right mr-4 border-r border-slate-700 pr-4">
            <span className="text-[9px] text-slate-400 uppercase font-black">Unidade Conectada</span>
            <span className="text-sm font-black text-orange-400">{activeStore}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onLogout}
              className="bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Sair
            </button>
            
            <div className="flex items-center space-x-2 pl-2">
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeStore}`} className="w-8 h-8 rounded-full border-2 border-slate-700 shadow-md bg-slate-800" alt="User" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
        <p>&copy; 2024 VarejoElite - Sistema de Performance de Vendas.</p>
      </footer>
    </div>
  );
};

export default Layout;
