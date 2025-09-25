const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MISSING MONGO_URI. Please set your SRV connection string in the environment.');
  process.exit(1);
}

async function testConnections() {
  console.log('\n🔍 Testing connection string from MONGO_URI');
  console.log(`URI: ${uri.replace(/:[^:@]*@/, ':****@')}`);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connection successful!');

    const db = client.db(process.env.MONGO_DB || 'capital_rise');
    const collections = await db.listCollections().toArray();
    console.log(`📊 Collections found: ${collections.length}`);
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`);
  } finally {
    await client.close();
  }
}

testConnections(); 