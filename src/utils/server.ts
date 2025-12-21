import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY } from '@env'
console.log(SUPABASE_URL,'SUPABASE_URL');
export const server = createClient(SUPABASE_URL, SUPABASE_API_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
