// Simple debug script to test frontend configuration
const fs = require('fs');
const path = require('path');

console.log('🔍 Frontend Debug Analysis');
console.log('=' .repeat(50));

// Check environment files
const envFiles = ['.env.local', '.env.production'];
envFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`\n📄 ${file}:`);
    const content = fs.readFileSync(filePath, 'utf8');
    content.split('\n').forEach(line => {
      if (line.trim()) {
        const [key, value] = line.split('=');
        if (key && value) {
          // Mask sensitive values
          const maskedValue = key.includes('KEY') || key.includes('SECRET') 
            ? value.substring(0, 10) + '...' 
            : value;
          console.log(`  ${key}=${maskedValue}`);
        }
      }
    });
  } else {
    console.log(`\n❌ ${file}: Not found`);
  }
});

// Check package.json scripts
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log('\n📦 Package Scripts:');
  Object.entries(pkg.scripts || {}).forEach(([name, script]) => {
    console.log(`  ${name}: ${script}`);
  });
}

// Check key files
const keyFiles = [
  'src/lib/api.ts',
  'src/hooks/useAuth.tsx',
  'src/types/index.ts'
];

keyFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`\n✅ ${file}: Exists`);
  } else {
    console.log(`\n❌ ${file}: Missing`);
  }
});

console.log('\n🔧 Potential Issues to Check:');
console.log('1. Supabase anon key completeness');
console.log('2. API base URL consistency');
console.log('3. Backend endpoint availability');
console.log('4. Authentication flow');
console.log('5. CORS configuration');