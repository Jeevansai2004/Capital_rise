const fetch = require('node-fetch').default;

async function testAdminLoginCorrect() {
  try {
    console.log('🔍 Testing Admin Login with Correct Format...');
    
    // Admin login expects username, not email
    const adminLoginData = {
      username: 'admin',
      password: 'admin123'
    };
    
    console.log('📤 Sending admin login request...');
    console.log('Data:', adminLoginData);
    
    const response = await fetch('http://localhost:5000/api/auth/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminLoginData)
    });
    
    console.log(`📥 Response Status: ${response.status}`);
    
    const result = await response.json();
    console.log('📥 Response:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.success) {
      console.log('🎉 Admin login successful!');
      console.log(`User Role: ${result.data.user.role}`);
      console.log(`Token: ${result.data.token ? 'Present' : 'Missing'}`);
      console.log('✅ You can now access the admin dashboard!');
    } else {
      console.log('❌ Admin login failed');
      console.log(`Error: ${result.message}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminLoginCorrect(); 