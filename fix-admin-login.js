const { connectToDatabase } = require('./server/config/database');
const bcrypt = require('bcryptjs');

async function fixAdminLogin() {
  try {
    console.log('🔧 Fixing Admin Login...');
    const db = await connectToDatabase();
    
    // Find the admin user
    const adminUser = await db.collection('users').findOne({ 
      role: 'admin', 
      deleted_at: { $exists: false } 
    });
    
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      return;
    }
    
    console.log('📋 Current admin user:');
    console.log(`   Username: ${adminUser.username}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    
    // Update admin user to use email for login
    const updateResult = await db.collection('users').updateOne(
      { _id: adminUser._id },
      { 
        $set: { 
          email: 'admin@capitalrise.com',
          updated_at: new Date().toISOString()
        } 
      }
    );
    
    if (updateResult.modifiedCount > 0) {
      console.log('✅ Admin user updated successfully!');
      console.log('🔐 Admin Login Credentials:');
      console.log(`   Email: admin@capitalrise.com`);
      console.log(`   Password: admin123`);
      console.log(`   Role: admin`);
      
      // Verify the update
      const updatedAdmin = await db.collection('users').findOne({ _id: adminUser._id });
      console.log('\n📋 Updated admin user:');
      console.log(`   Username: ${updatedAdmin.username}`);
      console.log(`   Email: ${updatedAdmin.email}`);
      console.log(`   Role: ${updatedAdmin.role}`);
      
    } else {
      console.log('ℹ️  Admin user already has correct email');
    }
    
    // Test login query with email
    console.log('\n🔍 Testing login with email...');
    const loginTest = await db.collection('users').findOne({ 
      email: 'admin@capitalrise.com', 
      deleted_at: { $exists: false } 
    });
    
    if (loginTest) {
      console.log('✅ Login query with email successful');
      console.log(`   Found user: ${loginTest.username} (${loginTest.role})`);
    } else {
      console.log('❌ Login query with email failed');
    }
    
  } catch (error) {
    console.error('❌ Error fixing admin login:', error);
  }
}

fixAdminLogin(); 