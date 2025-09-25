const { connectToDatabase } = require('./server/config/database');
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch').default;

async function comprehensiveAdminTest() {
  try {
    console.log('🔍 Comprehensive Admin Test...');
    const db = await connectToDatabase();
    
    // Step 1: Check admin user in database
    console.log('\n📋 Step 1: Checking admin user in database...');
    const adminUser = await db.collection('users').findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found in database');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log(`   ID: ${adminUser._id}`);
    console.log(`   Username: ${adminUser.username}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Password hash: ${adminUser.password ? 'Present' : 'Missing'}`);
    console.log(`   Deleted at: ${adminUser.deleted_at || 'Not deleted'}`);
    
    // Test the exact queries used by login routes
    console.log('\n🔍 Step 1.5: Testing exact login route queries...');
    
    // Test client login query
    const clientLoginUser = await db.collection('users').findOne({ 
      email: 'admin@capitalrise.com', 
      deleted_at: { $exists: false } 
    });
    console.log(`Client login query result: ${clientLoginUser ? '✅ Found' : '❌ Not found'}`);
    
    // Test admin login query
    const adminLoginUser = await db.collection('users').findOne({ 
      username: 'admin', 
      role: 'admin', 
      deleted_at: { $exists: false } 
    });
    console.log(`Admin login query result: ${adminLoginUser ? '✅ Found' : '❌ Not found'}`);
    
    // Step 2: Test password verification
    console.log('\n🔐 Step 2: Testing password verification...');
    const testPassword = 'admin123';
    const isValidPassword = await bcrypt.compare(testPassword, adminUser.password);
    console.log(`Password "${testPassword}" is valid: ${isValidPassword ? '✅ Yes' : '❌ No'}`);
    
    // Step 3: Test client login route
    console.log('\n🌐 Step 3: Testing client login route...');
    const clientLoginData = {
      email: 'admin@capitalrise.com',
      password: 'admin123'
    };
    
    const clientResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientLoginData)
    });
    
    console.log(`Client Login Status: ${clientResponse.status}`);
    const clientResult = await clientResponse.json();
    console.log('Client Login Result:', clientResult.success ? '✅ Success' : '❌ Failed');
    console.log('Client Login Error:', clientResult.message || 'No error message');
    
    // Step 4: Test admin login route
    console.log('\n🌐 Step 4: Testing admin login route...');
    const adminLoginData = {
      username: 'admin',
      password: 'admin123'
    };
    
    const adminResponse = await fetch('http://localhost:5000/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminLoginData)
    });
    
    console.log(`Admin Login Status: ${adminResponse.status}`);
    const adminResult = await adminResponse.json();
    console.log('Admin Login Result:', adminResult.success ? '✅ Success' : '❌ Failed');
    console.log('Admin Login Error:', adminResult.message || 'No error message');
    
    // Step 5: Summary
    console.log('\n📊 Summary:');
    console.log(`   Database admin user: ${adminUser ? '✅ Found' : '❌ Not found'}`);
    console.log(`   Password verification: ${isValidPassword ? '✅ Valid' : '❌ Invalid'}`);
    console.log(`   Client login route: ${clientResult.success ? '✅ Working' : '❌ Failing'}`);
    console.log(`   Admin login route: ${adminResult.success ? '✅ Working' : '❌ Failing'}`);
    
    if (clientResult.success) {
      console.log('\n🎉 Client login route is working!');
      console.log('🔐 Use these credentials in the frontend:');
      console.log(`   Email: admin@capitalrise.com`);
      console.log(`   Password: admin123`);
    } else if (adminResult.success) {
      console.log('\n🎉 Admin login route is working!');
      console.log('🔐 Use these credentials in the frontend:');
      console.log(`   Username: admin`);
      console.log(`   Password: admin123`);
    } else {
      console.log('\n❌ Both login routes are failing');
      console.log('🔧 Need to investigate further');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

comprehensiveAdminTest(); 