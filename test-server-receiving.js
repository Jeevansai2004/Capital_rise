const fetch = require('node-fetch').default;

async function testServerReceiving() {
  try {
    console.log('🔍 Testing Server Request Reception...');
    
    // Test 1: Simple GET request to check if server is responding
    console.log('\n📋 Test 1: Checking if server is responding...');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'GET'
      });
      console.log(`GET Response Status: ${response.status}`);
    } catch (error) {
      console.log('❌ Server not responding to GET');
    }
    
    // Test 2: POST with minimal data
    console.log('\n📋 Test 2: POST with minimal data...');
    const minimalData = { email: 'admin@capitalrise.com' };
    
    const response2 = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(minimalData)
    });
    
    console.log(`POST Response Status: ${response2.status}`);
    const result2 = await response2.json();
    console.log('Response:', result2);
    
    // Test 3: POST with correct data but different format
    console.log('\n📋 Test 3: POST with correct data...');
    const correctData = {
      email: 'admin@capitalrise.com',
      password: 'admin123'
    };
    
    const response3 = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(correctData)
    });
    
    console.log(`POST Response Status: ${response3.status}`);
    const result3 = await response3.json();
    console.log('Response:', result3);
    
    // Test 4: Check if there's a different route
    console.log('\n📋 Test 4: Checking admin login route...');
    const adminData = {
      username: 'admin',
      password: 'admin123'
    };
    
    const response4 = await fetch('http://localhost:5000/api/auth/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminData)
    });
    
    console.log(`Admin Login Response Status: ${response4.status}`);
    const result4 = await response4.json();
    console.log('Admin Response:', result4);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testServerReceiving(); 