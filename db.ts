import { Store } from './types';
import { INITIAL_STORES } from './constants';
import { dbFirestore, isFirebaseConfigured } from './firebaseClient';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

const DB_KEY = 'varejo_elite_v1_database';

export const db = {
  // Inicialização síncrona para UI instantânea (Cache Local)
  getStoresLocal: (): Store[] => {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : INITIAL_STORES;
  },

  // Busca assíncrona (Firebase -> LocalStorage)
  fetchStores: async (): Promise<Store[]> => {
    if (isFirebaseConfigured() && dbFirestore) {
      try {
        const querySnapshot = await getDocs(collection(dbFirestore, "stores"));
        if (!querySnapshot.empty) {
          const stores: Store[] = [];
          querySnapshot.forEach((doc) => {
            // Firestore retorna os dados como JSON, compatível com nosso tipo Store
            stores.push(doc.data() as Store);
          });

          // Atualiza cache local
          localStorage.setItem(DB_KEY, JSON.stringify(stores));
          return stores;
        }
      } catch (e) {
        console.error("Erro ao buscar do Firebase:", e);
      }
    }
    // Fallback
    return db.getStoresLocal();
  },

  // Persistência Híbrida
  saveStores: async (stores: Store[]) => {
    // 1. Salva localmente sempre (rapidez)
    localStorage.setItem(DB_KEY, JSON.stringify(stores));

    // 2. Se conectado, salva na nuvem
    if (isFirebaseConfigured() && dbFirestore) {
      try {
        const promises = stores.map(store =>
          setDoc(doc(dbFirestore, "stores", store.id), store)
        );
        await Promise.all(promises);
        console.log("Firebase: Dados sincronizados.");
      } catch (e) {
        console.error("Erro ao salvar no Firebase:", e);
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
    // Se quiser limpar o firebase, implementaria aqui
    window.location.reload();
  }
};
