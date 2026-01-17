import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidConfig = supabaseUrl && supabaseKey && supabaseUrl !== 'SUA_URL_SUPABASE';

// Evita crash se as vars não estiverem configuradas (comum no primeiro deploy)
export const supabase = isValidConfig
    ? createClient(supabaseUrl, supabaseKey)
    : {
        from: () => ({
            select: async () => ({ error: { message: 'Supabase não configurado' } }),
            upsert: async () => ({ error: { message: 'Supabase não configurado' } }),
            delete: async () => ({ error: { message: 'Supabase não configurado' } }),
        })
    } as any;

export const isSupabaseConfigured = () => isValidConfig;
