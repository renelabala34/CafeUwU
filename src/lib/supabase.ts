import { createClient } from '@supabase/supabase-js';

// Reemplaza estas URLs con las de tu proyecto de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://TU-PROYECTO.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'TU_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
