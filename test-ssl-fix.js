// Test SSL fix for MongoDB Atlas
require('dotenv').config();

const { connectToDatabase } = require('./server/config/database');

async function testSSLFix() {
  console.log('🔧 Testing SSL Fix for MongoDB Atlas...');
  console.log('MONGO_TLS_INSECURE:', process.env.MONGO_TLS_INSECURE || 'false');
  
  try {
    console.log('\n🔗 Attempting connection...');
    const db = await connectToDatabase();
    
    console.log('✅ Connection successful!');
    console.log('Database:', db.databaseName);
    
    // Test a simple operation
    const collections = await db.listCollections().toArray();
    console.log('📋 Collections available:', collections.length);
    
    console.log('\n🎉 SSL issue resolved!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.log('\n🔧 SSL Error detected. Try these solutions:');
      console.log('1. Set MONGO_TLS_INSECURE=true in your environment');
      console.log('2. Update your MongoDB driver version');
      console.log('3. Check your network/firewall settings');
      
      console.log('\n💡 Quick fix - run this command:');
      console.log('$env:MONGO_TLS_INSECURE="true"');
    }
  }
}

testSSLFix();
