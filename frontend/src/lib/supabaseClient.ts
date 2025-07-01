import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// TEMPORARY SOLUTION - Replace these with your actual values from Supabase:
// 1. Go to Project Settings -> API in your Supabase dashboard
// 2. Copy the "URL" (use as supabaseUrl)
// 3. Copy the "anon" public key (use as supabaseKey)
const supabaseUrl = 'https://your-project-ref.supabase.co';
const supabaseKey = 'your-anon-key';

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
  console.error('Supabase credentials missing! Please replace with your actual values from Supabase:');
  console.log('1. Go to Project Settings -> API');
  console.log('2. Copy the URL and anon public key');
  console.log('3. Update the supabaseClient.ts file');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
