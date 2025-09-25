const fetch = require('node-fetch').default;

async function testLoginProcess() {
  try {
    console.log('🔍 Testing Complete Login Process...');
    
    // Test admin login
    console.log('\n📋 Testing Admin Login...');
    const adminLoginData = {
      email: 'admin@capitalrise.com',
      password: 'admin123'
    };
    
    const adminResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminLoginData)
    });
    
    const adminResult = await adminResponse.json();
    
    console.log(`Status: ${adminResponse.status}`);
    console.log(`Success: ${adminResult.success}`);
    console.log(`Message: ${adminResult.message}`);
    
    if (adminResult.success) {
      console.log('✅ Admin login successful!');
      console.log(`User Role: ${adminResult.data.user.role}`);
      console.log(`Token: ${adminResult.data.token ? 'Present' : 'Missing'}`);
    } else {
      console.log('❌ Admin login failed');
      console.log(`Error: ${adminResult.message}`);
    }
    
    // Test with wrong password
    console.log('\n📋 Testing with Wrong Password...');
    const wrongPasswordData = {
      email: 'admin@capitalrise.com',
      password: 'wrongpassword'
    };
    
    const wrongResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(wrongPasswordData)
    });
    
    const wrongResult = await wrongResponse.json();
    
    console.log(`Status: ${wrongResponse.status}`);
    console.log(`Success: ${wrongResult.success}`);
    console.log(`Message: ${wrongResult.message}`);
    
    if (!wrongResult.success) {
      console.log('✅ Correctly rejected wrong password');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLoginProcess(); 