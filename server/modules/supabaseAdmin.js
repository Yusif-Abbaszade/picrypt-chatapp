import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SERVICE_KEY;
const anonkey = process.env.SUPABASE_ANON_KEY;


export const supabaseAdmin = createClient(supabaseUrl, anonkey, {  
    auth: {  
      autoRefreshToken: false,  
      persistSession: false  
    }  
  }); 

export default supabaseAdmin;