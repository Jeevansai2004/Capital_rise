// Test MongoDB Atlas connection with various SSL configurations
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

async function testConnection() {
  console.log('🔧 Testing MongoDB Atlas Connection...');
  
  const uri = process.env.MONGO_URI || 'mongodb+srv://saijeevan362:oSAfLeWulTt1r7ZB@capitalrisecluster.fauhhu9.mongodb.net/capital_rise?retryWrites=true&w=majority&appName=CapitalRiseCluster';
  
  console.log('🔗 Connection URI:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
  
  // Test different SSL configurations
  const configs = [
    {
      name: 'Standard Atlas Config',
      options: {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        connectTimeoutMS: 30000,
        socketTimeoutMS: 30000,
        serverSelectionTimeoutMS: 30000,
        maxPoolSize: 10,
        retryWrites: true,
        retryReads: true,
      }
    },
    {
      name: 'SSL Explicit Config',
      options: {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        ssl: true,
        tlsAllowInvalidCertificates: false,
        tlsAllowInvalidHostnames: false,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 30000,
        serverSelectionTimeoutMS: 30000,
        maxPoolSize: 10,
        retryWrites: true,
        retryReads: true,
      }
    },
    {
      name: 'Minimal Config',
      options: {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: false,
          deprecationErrors: false,
        },
        connectTimeoutMS: 30000,
        serverSelectionTimeoutMS: 30000,
      }
    }
  ];

  for (const config of configs) {
    console.log(`\n🧪 Testing: ${config.name}`);
    try {
      const client = new MongoClient(uri, config.options);
      await client.connect();
      
      // Test database operations
      const db = client.db('capital_rise');
      const collections = await db.listCollections().toArray();
      
      console.log(`✅ ${config.name} - SUCCESS!`);
      console.log(`📊 Collections found: ${collections.length}`);
      
      await client.close();
      console.log('🎉 Connection test passed!');
      return;
      
    } catch (error) {
      console.log(`❌ ${config.name} - FAILED:`, error.message);
    }
  }
  
  console.log('\n💥 All connection attempts failed!');
}

testConnection().catch(console.error);
