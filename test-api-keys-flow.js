// Test API key creation and listing flow
console.log('🔑 Testing API Key Management Flow');
console.log('=' .repeat(50));

// Simulate the adapter function
function adaptAPIKeys(raw) {
  console.log('adaptAPIKeys raw response:', raw);
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  const r = raw;
  if (Array.isArray(r.api_keys)) {
    console.log('Found api_keys array:', r.api_keys);
    return r.api_keys;
  }
  console.log('No api_keys found in response');
  return [];
}

// Test different response formats
console.log('\n📋 Testing Different Response Formats:');

// Format 1: Direct array (unlikely from backend)
const format1 = [
  { id: '1', name: 'Test Key', prefix: 'sk-test123' }
];
console.log('\nFormat 1 (direct array):');
console.log('Input:', format1);
console.log('Output:', adaptAPIKeys(format1));

// Format 2: Wrapped in api_keys (expected from backend)
const format2 = {
  api_keys: [
    { id: '1', name: 'Test Key', prefix: 'sk-test123' }
  ]
};
console.log('\nFormat 2 (wrapped in api_keys):');
console.log('Input:', format2);
console.log('Output:', adaptAPIKeys(format2));

// Format 3: Empty response
const format3 = { api_keys: [] };
console.log('\nFormat 3 (empty api_keys):');
console.log('Input:', format3);
console.log('Output:', adaptAPIKeys(format3));

// Format 4: Null/undefined
console.log('\nFormat 4 (null):');
console.log('Input:', null);
console.log('Output:', adaptAPIKeys(null));

console.log('\n🔍 Analysis:');
console.log('- Backend should return { api_keys: [...] } format');
console.log('- Adapter should extract the api_keys array');
console.log('- Frontend should receive the array of API keys');
console.log('- Check browser console for actual response format');