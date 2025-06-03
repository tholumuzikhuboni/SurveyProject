import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Initialize the Supabase client - you need to replace these with your actual Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);