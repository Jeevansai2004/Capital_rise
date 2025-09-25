const { connectToDatabase } = require('./server/config/database');
const bcrypt = require('bcryptjs');

async function createFreshAdmin() {
  try {
    console.log('🔧 Creating Fresh Admin User...');
    const db = await connectToDatabase();
    
    // Delete existing admin user
    console.log('🗑️  Deleting existing admin user...');
    await db.collection('users').deleteOne({ role: 'admin' });
    
    // Create fresh admin user
    console.log('➕ Creating fresh admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const freshAdmin = {
      username: 'admin',
      email: 'admin@capitalrise.com',
      password: hashedPassword,
      role: 'admin',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const result = await db.collection('users').insertOne(freshAdmin);
    
    console.log('✅ Fresh admin user created!');
    console.log('🔐 Admin Credentials:');
    console.log(`   Email: admin@capitalrise.com`);
    console.log(`   Password: admin123`);
    console.log(`   Role: admin`);
    console.log(`   User ID: ${result.insertedId}`);
    
    // Verify the user
    const verifyUser = await db.collection('users').findOne({ _id: result.insertedId });
    console.log('\n📋 Verification:');
    console.log(`   Username: ${verifyUser.username}`);
    console.log(`   Email: ${verifyUser.email}`);
    console.log(`   Role: ${verifyUser.role}`);
    
    // Test password
    const passwordValid = await bcrypt.compare('admin123', verifyUser.password);
    console.log(`   Password valid: ${passwordValid ? '✅ Yes' : '❌ No'}`);
    
    if (passwordValid) {
      console.log('🎉 Fresh admin user is ready for login!');
    }
    
  } catch (error) {
    console.error('❌ Error creating fresh admin:', error);
  }
}

createFreshAdmin(); 