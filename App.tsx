
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ClientDashboard from './components/ClientDashboard';
import AdminPanel from './components/AdminPanel';
import AccessScreen from './components/AccessScreen';
import { UserRole, Store } from './types';
import { db } from './db';
import { client } from './lib/appwrite';

const SESSION_KEY = 'varejo_elite_session';
const ADMIN_PASSWORD = '1234';

const App: React.FC = () => {
  const [stores, setStores] = useState<Store[]>(db.getStoresLocal());
  const [activeStoreIndex, setActiveStoreIndex] = useState<number | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loginError, setLoginError] = useState<string | undefined>();

  // Carrega os dados na inicialização
  useEffect(() => {
    const initData = async () => {
      // Verifica conexão com Appwrite
      if ((client as any).ping) {
        await (client as any).ping();
      }

      const data = await db.fetchStores();
      setStores(data);
    };
    initData();

    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const { role: sRole, index: sIndex } = JSON.parse(session);
        setRole(sRole);
        setActiveStoreIndex(sIndex);
      } catch (e) {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  // Persiste mudanças automaticamente
  useEffect(() => {
    if (stores.length > 0) {
      db.saveStores(stores);
    }
  }, [stores]);

  const handleAccess = (code: string, isForAdmin: boolean = false) => {
    setLoginError(undefined);

    if (isForAdmin) {
      if (code === ADMIN_PASSWORD) {
        setRole('ADMIN');
        setActiveStoreIndex(0);
        localStorage.setItem(SESSION_KEY, JSON.stringify({ role: 'ADMIN', index: 0 }));
      } else {
        setLoginError('Senha administrativa incorreta. Acesso negado.');
      }
      return;
    }

    const storeIdx = stores.findIndex(s => s.code === code);
    if (storeIdx !== -1) {
      setRole('CLIENT');
      setActiveStoreIndex(storeIdx);
      localStorage.setItem(SESSION_KEY, JSON.stringify({ role: 'CLIENT', index: storeIdx }));
    } else {
      setLoginError('Identificador da loja inválido. Verifique o código e tente novamente.');
    }
  };

  const handleLogout = () => {
    setRole(null);
    setActiveStoreIndex(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateStore = (updatedStore: Store) => {
    setStores(prev => prev.map(s => s.id === updatedStore.id ? updatedStore : s));
  };

  const addStore = (newStore: Store) => {
    setStores(prev => [...prev, newStore]);
  };

  if (stores.length === 0) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!role || activeStoreIndex === null) {
    return <AccessScreen onAccess={handleAccess} error={loginError} />;
  }

  const activeStore = stores[activeStoreIndex];

  return (
    <Layout
      role={role}
      activeStore={role === 'ADMIN' ? 'GESTÃO GLOBAL' : activeStore.fantasia}
      onLogout={handleLogout}
    >
      {role === 'CLIENT' ? (
        <ClientDashboard store={activeStore} />
      ) : (
        <AdminPanel
          stores={stores}
          updateStore={updateStore}
          addStore={addStore}
          onSelectStore={(idx: number) => setActiveStoreIndex(idx)}
          activeIdx={activeStoreIndex}
        />
      )}
    </Layout>
  );
};

export default App;
