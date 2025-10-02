// Test specific user features that might not be working
const apiUrl = 'https://api.envoyou.com';

// Test endpoints that frontend uses
const endpoints = [
  '/v1/user/stats',
  '/v1/user/profile', 
  '/v1/user/api-keys',
  '/v1/user/activity',
  '/v1/user/sessions',
  '/v1/developer/stats',
  '/v1/developer/usage-analytics',
  '/v1/developer/rate-limits'
];

console.log('🧪 Testing User Feature Endpoints');
console.log('=' .repeat(50));

async function testEndpoint(endpoint) {
  try {
    const response = await fetch(`${apiUrl}${endpoint}`);
    const data = await response.text();
    
    if (response.ok) {
      console.log(`✅ ${endpoint}: OK`);
    } else {
      console.log(`❌ ${endpoint}: ${response.status} - ${data.substring(0, 100)}`);
    }
  } catch (error) {
    console.log(`❌ ${endpoint}: Network Error - ${error.message}`);
  }
}

// Test all endpoints
async function runTests() {
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
  }
  
  console.log('\n📋 Summary:');
  console.log('- All endpoints require authentication (expected)');
  console.log('- Frontend should handle 401 errors gracefully');
  console.log('- Check browser console for actual runtime errors');
}

runTests();