const { connectToDatabase } = require('./server/config/database');
const bcrypt = require('bcryptjs');

async function debugLogin() {
  try {
    console.log('🔍 Debugging Login Process...');
    const db = await connectToDatabase();
    
    // Test 1: Find user by email
    console.log('\n📋 Test 1: Finding user by email...');
    const user = await db.collection('users').findOne({ 
      email: 'admin@capitalrise.com', 
      deleted_at: { $exists: false } 
    });
    
    if (!user) {
      console.log('❌ User not found by email');
      return;
    }
    
    console.log('✅ User found:');
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Has password: ${!!user.password}`);
    console.log(`   Is blocked: ${user.is_blocked || false}`);
    
    // Test 2: Check password
    console.log('\n🔐 Test 2: Checking password...');
    const testPassword = 'admin123';
    const isValidPassword = await bcrypt.compare(testPassword, user.password);
    console.log(`Password "${testPassword}" is valid: ${isValidPassword ? '✅ Yes' : '❌ No'}`);
    
    // Test 3: Simulate login route logic
    console.log('\n🔄 Test 3: Simulating login route logic...');
    
    // Step 1: Find user
    const loginUser = await db.collection('users').findOne({ 
      email: 'admin@capitalrise.com', 
      deleted_at: { $exists: false } 
    });
    
    if (!loginUser) {
      console.log('❌ Step 1: User not found');
      return;
    }
    console.log('✅ Step 1: User found');
    
    // Step 2: Check if blocked
    if (loginUser.is_blocked) {
      console.log('❌ Step 2: User is blocked');
      return;
    }
    console.log('✅ Step 2: User is not blocked');
    
    // Step 3: Check password
    const passwordValid = await bcrypt.compare('admin123', loginUser.password);
    if (!passwordValid) {
      console.log('❌ Step 3: Password is invalid');
      return;
    }
    console.log('✅ Step 3: Password is valid');
    
    console.log('🎉 All login steps passed!');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugLogin(); 