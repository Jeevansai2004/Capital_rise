const fetch = require('node-fetch').default;

async function testCorrectLogin() {
  try {
    console.log('🔍 Testing Correct Admin Login...');
    
    const loginData = {
      email: 'admin@capitalrise.com',
      password: 'admin123'
    };
    
    console.log('📤 Sending login request...');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    
    console.log(`📥 Response Status: ${response.status}`);
    
    const result = await response.json();
    console.log('📥 Response:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.success) {
      console.log('🎉 Login successful!');
      console.log(`User Role: ${result.data.user.role}`);
      console.log(`Token: ${result.data.token ? 'Present' : 'Missing'}`);
      console.log('✅ You can now login to the admin dashboard!');
    } else {
      console.log('❌ Login failed');
      console.log(`Error: ${result.message}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCorrectLogin(); 