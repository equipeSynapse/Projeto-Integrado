import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { Pool } from 'pg';

export const pool = new Pool({
    connectionString: process.env.DATABASE_URI
});

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)