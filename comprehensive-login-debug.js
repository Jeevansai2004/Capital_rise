const { connectToDatabase } = require('./server/config/database');
const bcrypt = require('bcryptjs');

async function comprehensiveLoginDebug() {
  try {
    console.log('🔍 COMPREHENSIVE LOGIN DEBUGGING');
    console.log('=====================================\n');
    
    const db = await connectToDatabase();
    
    // Step 1: Check all users in database
    console.log('📋 STEP 1: Checking all users in database...');
    const allUsers = await db.collection('users').find({}).toArray();
    console.log(`Found ${allUsers.length} users in database:`);
    
    allUsers.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(`  ID: ${user._id}`);
      console.log(`  Username: ${user.username}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Has Password: ${!!user.password}`);
      console.log(`  Password Length: ${user.password ? user.password.length : 'N/A'}`);
      console.log(`  Is Blocked: ${user.is_blocked || false}`);
      console.log(`  Deleted At: ${user.deleted_at || 'Not deleted'}`);
      console.log(`  Created At: ${user.created_at}`);
    });
    
    // Step 2: Test specific user login scenarios
    console.log('\n🔐 STEP 2: Testing specific login scenarios...');
    
    // Test with admin user
    console.log('\n--- Testing Admin User ---');
    const adminUser = await db.collection('users').findOne({ 
      email: 'admin@capitalrise.com', 
      deleted_at: { $exists: false } 
    });
    
    if (adminUser) {
      console.log('✅ Admin user found');
      console.log(`  Username: ${adminUser.username}`);
      console.log(`  Email: ${adminUser.email}`);
      console.log(`  Role: ${adminUser.role}`);
      console.log(`  Password hash: ${adminUser.password.substring(0, 20)}...`);
      
      // Test password comparison
      const adminPasswordValid = await bcrypt.compare('admin123', adminUser.password);
      console.log(`  Password 'admin123' valid: ${adminPasswordValid ? '✅ Yes' : '❌ No'}`);
      
      // Test with different passwords
      const testPasswords = ['admin', 'Admin123', 'ADMIN123', 'admin1234'];
      for (const pwd of testPasswords) {
        const isValid = await bcrypt.compare(pwd, adminUser.password);
        console.log(`  Password '${pwd}' valid: ${isValid ? '✅ Yes' : '❌ No'}`);
      }
    } else {
      console.log('❌ Admin user not found');
    }
    
    // Step 3: Test client users
    console.log('\n--- Testing Client Users ---');
    const clientUsers = await db.collection('users').find({ 
      role: 'client', 
      deleted_at: { $exists: false } 
    }).toArray();
    
    console.log(`Found ${clientUsers.length} client users`);
    
    for (const client of clientUsers) {
      console.log(`\nClient: ${client.username} (${client.email})`);
      console.log(`  Password hash: ${client.password ? client.password.substring(0, 20) + '...' : 'No password'}`);
      console.log(`  Is blocked: ${client.is_blocked || false}`);
      
      // Test with common passwords
      const testPasswords = ['password', '123456', 'password123', 'test123'];
      for (const pwd of testPasswords) {
        if (client.password) {
          const isValid = await bcrypt.compare(pwd, client.password);
          console.log(`  Password '${pwd}' valid: ${isValid ? '✅ Yes' : '❌ No'}`);
        }
      }
    }
    
    // Step 4: Simulate exact login route logic
    console.log('\n🔄 STEP 4: Simulating exact login route logic...');
    
    const testEmail = 'admin@capitalrise.com';
    const testPassword = 'admin123';
    
    console.log(`Testing login for: ${testEmail} with password: ${testPassword}`);
    
    // Step 4a: Find user by email
    const loginUser = await db.collection('users').findOne({ 
      email: testEmail, 
      deleted_at: { $exists: false } 
    });
    
    if (!loginUser) {
      console.log('❌ User not found by email');
      return;
    }
    console.log('✅ User found by email');
    
    // Step 4b: Check if blocked
    if (loginUser.is_blocked) {
      console.log('❌ User is blocked');
      return;
    }
    console.log('✅ User is not blocked');
    
    // Step 4c: Check password
    const passwordValid = await bcrypt.compare(testPassword, loginUser.password);
    if (!passwordValid) {
      console.log('❌ Password is invalid');
      console.log(`  Expected password: ${testPassword}`);
      console.log(`  Stored hash: ${loginUser.password.substring(0, 20)}...`);
      
      // Try to find what password was actually used
      console.log('\n🔍 Attempting to find correct password...');
      const commonPasswords = [
        'admin123', 'admin', 'Admin123', 'ADMIN123', 'password', 
        '123456', 'password123', 'test123', 'admin1234'
      ];
      
      for (const pwd of commonPasswords) {
        const isValid = await bcrypt.compare(pwd, loginUser.password);
        if (isValid) {
          console.log(`✅ Found correct password: "${pwd}"`);
          break;
        }
      }
      return;
    }
    console.log('✅ Password is valid');
    
    // Step 4d: Generate JWT (simulate)
    console.log('✅ All login checks passed - user should be able to login');
    
    // Step 5: Check for potential issues
    console.log('\n🔍 STEP 5: Checking for potential issues...');
    
    // Check if there are multiple users with same email
    const duplicateEmails = await db.collection('users').aggregate([
      { $group: { _id: '$email', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]).toArray();
    
    if (duplicateEmails.length > 0) {
      console.log('⚠️  Found duplicate emails:');
      duplicateEmails.forEach(dup => {
        console.log(`  ${dup._id}: ${dup.count} users`);
      });
    } else {
      console.log('✅ No duplicate emails found');
    }
    
    // Check for users with missing passwords
    const usersWithoutPasswords = await db.collection('users').find({
      $or: [
        { password: { $exists: false } },
        { password: null },
        { password: '' }
      ]
    }).toArray();
    
    if (usersWithoutPasswords.length > 0) {
      console.log('⚠️  Found users without passwords:');
      usersWithoutPasswords.forEach(user => {
        console.log(`  ${user.username} (${user.email})`);
      });
    } else {
      console.log('✅ All users have passwords');
    }
    
    // Step 6: Test registration process
    console.log('\n🧪 STEP 6: Testing registration process...');
    
    const testRegistrationData = {
      username: 'testuser123',
      email: 'testuser123@example.com',
      mobile: '9876543210',
      password: 'testpass123'
    };
    
    console.log('Testing registration with data:', testRegistrationData);
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ 
      email: testRegistrationData.email, 
      deleted_at: { $exists: false } 
    });
    
    if (existingUser) {
      console.log('⚠️  Test user already exists, deleting...');
      await db.collection('users').deleteOne({ _id: existingUser._id });
      await db.collection('client_balances').deleteOne({ user_id: existingUser._id });
      await db.collection('new_registrations').deleteOne({ user_id: existingUser._id });
    }
    
    // Test password hashing
    const testHashedPassword = await bcrypt.hash(testRegistrationData.password, 10);
    console.log(`Test password hash: ${testHashedPassword.substring(0, 20)}...`);
    
    // Test password comparison
    const testPasswordValid = await bcrypt.compare(testRegistrationData.password, testHashedPassword);
    console.log(`Test password comparison: ${testPasswordValid ? '✅ Valid' : '❌ Invalid'}`);
    
    console.log('\n🎯 SUMMARY:');
    console.log('===========');
    console.log('1. Check if users exist in database');
    console.log('2. Verify password hashing is working');
    console.log('3. Test exact login route logic');
    console.log('4. Check for duplicate users or missing passwords');
    console.log('5. Verify registration process');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

comprehensiveLoginDebug();
