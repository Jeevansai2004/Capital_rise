const fetch = require('node-fetch').default;

async function debugLoginRoute() {
  try {
    console.log('🔍 Debug Login Route...');
    
    const loginData = {
      email: 'admin@capitalrise.com',
      password: 'admin123'
    };
    
    console.log('📤 Request data:', JSON.stringify(loginData, null, 2));
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    
    console.log(`📥 Response Status: ${response.status}`);
    
    const result = await response.json();
    console.log('📥 Response:', JSON.stringify(result, null, 2));
    
    // Test with different content type
    console.log('\n🔍 Testing with different content type...');
    const response2 = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `email=${encodeURIComponent(loginData.email)}&password=${encodeURIComponent(loginData.password)}`
    });
    
    console.log(`📥 Response 2 Status: ${response2.status}`);
    const result2 = await response2.json();
    console.log('📥 Response 2:', JSON.stringify(result2, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

debugLoginRoute(); 