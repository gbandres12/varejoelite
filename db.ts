
import { Store } from './types';
import { INITIAL_STORES } from './constants';

const DB_KEY = 'varejo_elite_v1_database';

export const db = {
  // Retorna todos os dados salvos ou os dados iniciais
  getStores: (): Store[] => {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
      console.log("DB: Inicializando com dados padrão.");
      return INITIAL_STORES;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("DB: Erro ao ler banco de dados. Resetando...", e);
      return INITIAL_STORES;
    }
  },

  // Salva o estado atual no "disco" (LocalStorage)
  saveStores: (stores: Store[]) => {
    localStorage.setItem(DB_KEY, JSON.stringify(stores));
    console.log("DB: Alterações persistidas com sucesso.");
  },

  // Exporta o banco de dados como um arquivo JSON
  exportBackup: () => {
    const data = JSON.stringify(db.getStores(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `varejo-elite-db-backup-${timestamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  // Importa dados de um arquivo e substitui o banco atual
  importBackup: (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            db.saveStores(parsed);
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

  // Limpa o banco de dados
  clearDB: () => {
    localStorage.removeItem(DB_KEY);
    window.location.reload();
  }
};
