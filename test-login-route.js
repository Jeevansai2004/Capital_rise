const { connectToDatabase } = require('./server/config/database');
const bcrypt = require('bcryptjs');

async function testLoginRoute() {
  try {
    console.log('🔍 Testing Login Route Logic...');
    const db = await connectToDatabase();
    
    // Simulate the exact login route logic
    const email = 'admin@capitalrise.com';
    const password = 'admin123';
    
    console.log(`\n📋 Testing login for: ${email}`);
    
    // Step 1: Find user by email
    console.log('Step 1: Finding user by email...');
    const user = await db.collection('users').findOne({ 
      email: email, 
      deleted_at: { $exists: false } 
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:');
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Is blocked: ${user.is_blocked || false}`);
    
    // Step 2: Check if user is blocked
    if (user.is_blocked) {
      console.log('❌ User is blocked');
      return;
    }
    console.log('✅ User is not blocked');
    
    // Step 3: Check password
    console.log('Step 3: Checking password...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      console.log('❌ Password is invalid');
      return;
    }
    console.log('✅ Password is valid');
    
    console.log('🎉 Login should succeed!');
    
    // Test with different password
    console.log('\n🔍 Testing with wrong password...');
    const wrongPassword = 'wrongpassword';
    const isWrongPasswordValid = await bcrypt.compare(wrongPassword, user.password);
    console.log(`Wrong password valid: ${isWrongPasswordValid ? '❌ Yes (should be No)' : '✅ No (correct)'}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testLoginRoute(); 