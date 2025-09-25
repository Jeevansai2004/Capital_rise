const fetch = require('node-fetch').default;

async function simpleLoginTest() {
  try {
    console.log('🔍 Simple Login Test...');
    
    const loginData = {
      email: 'admin@capitalrise.com',
      password: 'admin123'
    };
    
    console.log('📤 Sending request with data:', loginData);
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    
    console.log(`📥 Response Status: ${response.status}`);
    console.log(`📥 Response Headers:`, Object.fromEntries(response.headers.entries()));
    
    const result = await response.json();
    console.log(`📥 Response Body:`, result);
    
    if (response.ok) {
      console.log('✅ Login successful!');
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

simpleLoginTest(); 