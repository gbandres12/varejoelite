import { Store } from './types';
import { INITIAL_STORES } from './constants';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const DB_KEY = 'varejo_elite_v1_database';

export const db = {
  // Inicialização síncrona para UI instantânea (Cache Local)
  getStoresLocal: (): Store[] => {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : INITIAL_STORES;
  },

  // Busca assíncrona (Supabase -> LocalStorage)
  fetchStores: async (): Promise<Store[]> => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('stores').select('*');
        if (error) throw error;

        if (data && data.length > 0) {
          // Mapeia do formato do banco para o App se necessário
          const formatted: Store[] = data.map((row: any) => ({
            id: row.id,
            code: row.code,
            razaoSocial: row.razao_social,
            fantasia: row.fantasia,
            manager: row.manager,
            lastUpdate: row.last_update,
            kpis: row.kpis || [],
            customRewards: row.custom_rewards || {},
            tierColors: row.tier_colors || {}
          }));

          // Atualiza cache local
          localStorage.setItem(DB_KEY, JSON.stringify(formatted));
          return formatted;
        }
      } catch (e) {
        console.error("Erro ao buscar do Supabase:", e);
      }
    }
    // Fallback
    return db.getStoresLocal();
  },

  // Persistência Híbrida
  saveStores: async (stores: Store[]) => {
    // 1. Salva localmente sempre (rapidez)
    localStorage.setItem(DB_KEY, JSON.stringify(stores));

    // 2. Se conectado, salva na nuvem (Debounce idealmente, mas direto por enquanto)
    if (isSupabaseConfigured()) {
      try {
        const rows = stores.map(s => ({
          id: s.id,
          code: s.code,
          razao_social: s.razaoSocial,
          fantasia: s.fantasia,
          manager: s.manager,
          last_update: s.lastUpdate,
          kpis: s.kpis,
          custom_rewards: s.customRewards,
          tier_colors: s.tierColors
        }));

        const { error } = await supabase.from('stores').upsert(rows);
        if (error) throw error;
      } catch (e) {
        console.error("Erro ao salvar no Supabase:", e);
      }
    }
  },

  exportBackup: () => {
    const data = JSON.stringify(db.getStoresLocal(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `varejo-elite-db-backup-${timestamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  importBackup: (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            await db.saveStores(parsed); // Reutiliza lógica de salvar
            resolve(true);
          } else {
            resolve(false);
          }
        } catch {
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
  },

  clearDB: async () => {
    localStorage.removeItem(DB_KEY);
    if (isSupabaseConfigured()) {
      // Opcional: limpar banco
    }
    window.location.reload();
  }
};
