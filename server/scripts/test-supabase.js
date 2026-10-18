import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_KEY in server/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('==================================================');
console.log('🌿 SUPABASE DATABASE CONNECTION & TABLE STATUS');
console.log('📍 Project URL:', supabaseUrl);
console.log('==================================================');

const requiredTables = [
  'users',
  'artists',
  'services',
  'designs',
  'appointments',
  'reviews',
  'payments',
  'notifications',
  'bookings'
];

async function checkStatus() {
  let missingTables = [];
  let existingTables = [];

  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error && (error.code === 'PGRST205' || error.message.includes('schema cache'))) {
        missingTables.push(table);
        console.log(`❌ Table "${table}": NOT CREATED YET`);
      } else if (error) {
        console.log(`⚠️ Table "${table}": Error - ${error.message}`);
      } else {
        existingTables.push(table);
        console.log(`✅ Table "${table}": READY (Rows check: ${data ? 'OK' : 'Empty'})`);
      }
    } catch (err) {
      console.log(`❌ Table "${table}": ${err.message}`);
      missingTables.push(table);
    }
  }

  console.log('--------------------------------------------------');
  if (missingTables.length > 0) {
    console.log(`⚠️  ${missingTables.length} tables need to be created in Supabase:`);
    console.log(`   [ ${missingTables.join(', ')} ]`);
    console.log('');
    console.log('👉 Quick 1-Step Fix:');
    console.log('   1. Open Supabase SQL Editor:');
    console.log(`      https://supabase.com/dashboard/project/hfldqulslzlmvfszmdud/sql/new`);
    console.log('   2. Paste the contents of "server/db/schema.sql"');
    console.log('   3. Click "Run" to create all tables and RLS policies!');
  } else {
    console.log('🎉 All required Supabase tables are ready and active!');
  }
  console.log('==================================================');
}

checkStatus();
