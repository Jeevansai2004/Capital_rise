const { connectToDatabase } = require('./server/config/database');
const bcrypt = require('bcryptjs');

async function directLoginTest() {
  try {
    console.log('🔍 Direct Login Test (Simulating API Route)...');
    const db = await connectToDatabase();
    
    // Simulate the exact login route logic
    const email = 'admin@capitalrise.com';
    const password = 'admin123';
    
    console.log(`\n📋 Testing login for: ${email}`);
    
    // Step 1: Find user by email (exact same query as API)
    console.log('Step 1: Finding user by email...');
    const user = await db.collection('users').findOne({ 
      email: email, 
      deleted_at: { $exists: false } 
    });
    
    if (!user) {
      console.log('❌ User not found by email');
      return;
    }
    
    console.log('✅ User found:');
    console.log(`   ID: ${user._id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Is blocked: ${user.is_blocked || false}`);
    console.log(`   Has password: ${!!user.password}`);
    
    // Step 2: Check if user is blocked (exact same logic as API)
    if (user.is_blocked) {
      console.log('❌ User is blocked');
      return;
    }
    console.log('✅ User is not blocked');
    
    // Step 3: Check password (exact same logic as API)
    console.log('Step 3: Checking password...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      console.log('❌ Password is invalid');
      console.log(`   Input password: ${password}`);
      console.log(`   Stored password hash: ${user.password}`);
      return;
    }
    console.log('✅ Password is valid');
    
    console.log('🎉 Login should succeed!');
    console.log('🔐 Admin credentials are working correctly!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

directLoginTest(); 