const { connectToDatabase } = require('./server/config/database');

async function finalAdminCheck() {
  try {
    console.log('🔍 Final Admin Check...');
    const db = await connectToDatabase();
    
    // Check all users
    console.log('\n📋 All users in database:');
    const allUsers = await db.collection('users').find({}).toArray();
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
    });
    
    // Check admin user specifically
    console.log('\n🔍 Admin user details:');
    const adminUser = await db.collection('users').findOne({ role: 'admin' });
    
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log(`   ID: ${adminUser._id}`);
      console.log(`   Username: ${adminUser.username}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Is blocked: ${adminUser.is_blocked || false}`);
      console.log(`   Has password: ${!!adminUser.password}`);
      console.log(`   Password length: ${adminUser.password ? adminUser.password.length : 0}`);
    } else {
      console.log('❌ Admin user not found');
    }
    
    // Check by email
    console.log('\n🔍 User by email (admin@capitalrise.com):');
    const userByEmail = await db.collection('users').findOne({ email: 'admin@capitalrise.com' });
    
    if (userByEmail) {
      console.log('✅ User found by email:');
      console.log(`   Username: ${userByEmail.username}`);
      console.log(`   Email: ${userByEmail.email}`);
      console.log(`   Role: ${userByEmail.role}`);
    } else {
      console.log('❌ No user found by email');
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  }
}

finalAdminCheck(); 