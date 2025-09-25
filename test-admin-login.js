const { connectToDatabase } = require('./server/config/database');
const bcrypt = require('bcryptjs');

async function testAdminLogin() {
  try {
    console.log('🔍 Testing Admin Login Process...');
    const db = await connectToDatabase();
    
    // Test 1: Check if admin user exists
    console.log('\n📋 Test 1: Checking if admin user exists...');
    const adminUser = await db.collection('users').findOne({ 
      role: 'admin', 
      deleted_at: { $exists: false } 
    });
    
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log(`   Username: ${adminUser.username}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Has password: ${!!adminUser.password}`);
    
    // Test 2: Test password verification
    console.log('\n🔐 Test 2: Testing password verification...');
    const testPasswords = ['admin123', 'admin', 'Admin123', 'ADMIN123'];
    
    for (const password of testPasswords) {
      try {
        const isValid = await bcrypt.compare(password, adminUser.password);
        console.log(`   Password "${password}": ${isValid ? '✅ Valid' : '❌ Invalid'}`);
        if (isValid) {
          console.log(`   🎉 Correct password found: "${password}"`);
        }
      } catch (error) {
        console.log(`   Password "${password}": ❌ Error - ${error.message}`);
      }
    }
    
    // Test 3: Test login query
    console.log('\n🔍 Test 3: Testing login query...');
    const loginQuery = await db.collection('users').findOne({ 
      username: 'admin', 
      role: 'admin', 
      deleted_at: { $exists: false } 
    });
    
    if (loginQuery) {
      console.log('✅ Login query successful');
      console.log(`   Found user: ${loginQuery.username}`);
    } else {
      console.log('❌ Login query failed - no user found');
    }
    
    // Test 4: Check all users in database
    console.log('\n👥 Test 4: Checking all users in database...');
    const allUsers = await db.collection('users').find({}).toArray();
    console.log(`   Total users: ${allUsers.length}`);
    
    allUsers.forEach((user, index) => {
      console.log(`   User ${index + 1}: ${user.username} (${user.role})`);
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAdminLogin(); 