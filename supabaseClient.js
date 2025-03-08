import { createClient } from "@supabase/supabase-js";


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzdW54bHB1am14eGpzb3NkZ3NjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTExNzg2NiwiZXhwIjoyMDU2NjkzODY2fQ.Z9vE_osVhF5NL-ENYP1Qk6EMEnB5dSi6pnwpFeThCX0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, serviceKey, {  
    auth: {  
      autoRefreshToken: false,  
      persistSession: false  
    }  
  }); 

export default supabase