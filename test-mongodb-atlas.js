require('dotenv').config();
const { MongoClient } = require('mongodb');

// Require MONGO_URI from environment to avoid hardcoded secrets
const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB || 'capital_rise';

if (!uri) {
  console.error('MONGO_URI is not set. Please set it in your environment or .env file.');
  process.exit(1);
}

console.log('🔍 Testing MongoDB Atlas Connection...');
console.log('URI configured:', !!process.env.MONGO_URI);
console.log('DB configured:', !!process.env.MONGO_DB);

async function testConnection() {
  const client = new MongoClient(uri);
  
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await client.connect();
    
    const db = client.db(dbName);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database operations
    const collections = await db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    // Test creating a test document
    const testCollection = db.collection('test_connection');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'MongoDB Atlas connection test successful!' 
    });
    console.log('✅ Test document created successfully!');
    
    // Clean up test document
    await testCollection.deleteOne({ test: true });
    console.log('🧹 Test document cleaned up');
    
    console.log('🎉 MongoDB Atlas connection test completed successfully!');
    console.log('💾 Your data will now be stored permanently in the cloud!');
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Ensure MONGO_URI is set to your SRV connection string');
    console.log('2. Check if your IP address is whitelisted in MongoDB Atlas');
    console.log('3. Verify your database user has the correct permissions');
    console.log('4. Ensure your cluster is running and accessible');
  } finally {
    await client.close();
  }
}

testConnection(); 