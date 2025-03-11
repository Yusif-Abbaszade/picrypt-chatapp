import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;


export const supabaseAdmin = createClient(supabaseUrl, serviceKey, {  
    auth: {  
      autoRefreshToken: false,  
      persistSession: false  
    }  
  }); 

export default supabaseAdmin;