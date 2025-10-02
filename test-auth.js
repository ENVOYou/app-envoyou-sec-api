// Test authentication flow
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mxxyzzvwrkafcldokehp.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_E8LROxYJfbbWxD93xaXQKw_2-IYVwqR';

console.log('🔐 Testing Supabase Authentication');
console.log('=' .repeat(50));
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey.substring(0, 20) + '...');

try {
  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase client created successfully');
  
  // Test basic connection
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.log('❌ Session error:', error.message);
    } else {
      console.log('✅ Session check successful');
      console.log('Session:', data.session ? 'Active' : 'None');
    }
  }).catch(err => {
    console.log('❌ Connection error:', err.message);
  });
  
} catch (error) {
  console.log('❌ Failed to create Supabase client:', error.message);
}

// Test API endpoint
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.envoyou.com';
console.log('\n🌐 Testing API Connection');
console.log('API URL:', apiUrl);

fetch(`${apiUrl}/health`)
  .then(res => res.json())
  .then(data => {
    console.log('✅ API Health:', data.status);
  })
  .catch(err => {
    console.log('❌ API Error:', err.message);
  });