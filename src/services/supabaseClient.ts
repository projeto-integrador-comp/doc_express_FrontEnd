import { createClient } from '@supabase/supabase-js';

// variáveis VITE são carregadas automaticamente pelo Vite a partir do .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// inicializa o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)