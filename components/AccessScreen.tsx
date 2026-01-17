
import React, { useState } from 'react';

interface AccessScreenProps {
  onAccess: (code: string, isAdmin?: boolean) => void;
  error?: string;
}

const AccessScreen: React.FC<AccessScreenProps> = ({ onAccess, error }) => {
  const [code, setCode] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdminMode) {
      onAccess(password, true);
    } else {
      onAccess(code, false);
    }
  };

  const toggleMode = () => {
    setIsAdminMode(!isAdminMode);
    setCode('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex bg-slate-900 p-4 rounded-3xl shadow-xl shadow-slate-200 mb-6">
            <i className={`fa-solid ${isAdminMode ? 'fa-shield-halved text-indigo-400' : 'fa-chart-line text-orange-500'} text-4xl animate-pulse`}></i>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase">
            Varejo<span className={isAdminMode ? 'text-indigo-600' : 'text-orange-500'}>Elite</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            {isAdminMode ? 'Área de Governança Master' : 'Programa de Excelência e Performance'}
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-10 transition-all duration-300">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-black text-slate-800 mb-1">
                {isAdminMode ? 'Autenticação Admin' : 'Acesso ao Painel'}
              </h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                {isAdminMode ? 'Insira a senha de gestor' : 'Identifique sua unidade'}
              </p>
            </div>
            {isAdminMode && (
              <button 
                onClick={toggleMode}
                className="text-[10px] font-black text-indigo-600 uppercase hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
              >
                <i className="fa-solid fa-arrow-left mr-1"></i>
                Voltar
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isAdminMode ? (
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">CNPJ ou Código da Loja</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300">
                    <i className="fa-solid fa-barcode"></i>
                  </div>
                  <input 
                    type="text" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ex: 1001"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-800 font-bold outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Senha Administrativa</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300">
                    <i className="fa-solid fa-lock"></i>
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-800 font-bold outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                    required
                    autoFocus
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                <i className="fa-solid fa-triangle-exclamation text-base"></i>
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit"
              className={`w-full ${isAdminMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-900 hover:bg-slate-800'} text-white font-black py-4 rounded-2xl shadow-xl transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2 group`}
            >
              {isAdminMode ? 'Validar Acesso' : 'Entrar no Painel'}
              <i className="fa-solid fa-chevron-right group-hover:translate-x-1 transition-transform"></i>
            </button>
          </form>

          {!isAdminMode && (
            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-4 tracking-[0.2em]">Segurança e Privacidade</p>
              <button 
                onClick={toggleMode}
                className="text-slate-400 hover:text-indigo-600 text-[10px] font-black uppercase tracking-tighter transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <i className="fa-solid fa-user-shield"></i>
                Acesso do Administrador
              </button>
            </div>
          )}
        </div>

        <p className="text-center mt-10 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
          &copy; 2024 VarejoElite - Plataforma de Performance Varejista
        </p>
      </div>
    </div>
  );
};

export default AccessScreen;
