import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = 'https://dsunxlpujmxxjsosdgsc.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzdW54bHB1am14eGpzb3NkZ3NjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTExNzg2NiwiZXhwIjoyMDU2NjkzODY2fQ.Z9vE_osVhF5NL-ENYP1Qk6EMEnB5dSi6pnwpFeThCX0';
const anonkey = process.env.SUPABASE_ANON_KEY;


export const supabaseAdmin = createClient(supabaseUrl, serviceKey, {  
    auth: {  
      autoRefreshToken: false,  
      persistSession: false  
    }  
  }); 

export default supabaseAdmin;