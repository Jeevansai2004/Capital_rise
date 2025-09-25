const { connectToDatabase } = require('./server/config/database');
const bcrypt = require('bcryptjs');

async function resetAdminPassword() {
  try {
    console.log('🔧 Resetting Admin Password...');
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
    
    // Generate new password hash
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update admin user with new password
    const updateResult = await db.collection('users').updateOne(
      { _id: adminUser._id },
      { 
        $set: { 
          password: hashedPassword,
          updated_at: new Date().toISOString()
        } 
      }
    );
    
    if (updateResult.modifiedCount > 0) {
      console.log('✅ Admin password reset successfully!');
      console.log('🔐 New Admin Credentials:');
      console.log(`   Email: admin@capitalrise.com`);
      console.log(`   Password: admin123`);
      console.log(`   Role: admin`);
      
      // Verify the password works
      const updatedAdmin = await db.collection('users').findOne({ _id: adminUser._id });
      const isValidPassword = await bcrypt.compare(newPassword, updatedAdmin.password);
      
      console.log('\n🔍 Password verification:');
      console.log(`   Password valid: ${isValidPassword ? '✅ Yes' : '❌ No'}`);
      
      if (isValidPassword) {
        console.log('🎉 Admin login should now work!');
      } else {
        console.log('❌ Password verification failed');
      }
      
    } else {
      console.log('ℹ️  Admin password already set correctly');
    }
    
  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
  }
}

resetAdminPassword(); 