const { MongoClient, ServerApiVersion } = require('mongodb');

// Test different SSL configurations
async function testSSLConnection() {
  console.log('🔧 Testing MongoDB Atlas SSL Connection...');
  
  const uri = process.env.MONGO_URI || 'mongodb+srv://saijeevan362:oSAfLeWulTt1r7ZB@capitalrisecluster.fauhhu9.mongodb.net/capital_rise?retryWrites=true&w=majority&appName=CapitalRiseCluster';
  
  console.log('URI configured:', !!uri);
  console.log('Testing different SSL configurations...\n');

  // Configuration 1: Standard Atlas connection
  console.log('🔍 Test 1: Standard Atlas connection');
  try {
    const client1 = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
    });
    
    await client1.connect();
    console.log('✅ Standard connection successful');
    await client1.close();
  } catch (error) {
    console.log('❌ Standard connection failed:', error.message);
  }

  // Configuration 2: With SSL validation disabled
  console.log('\n🔍 Test 2: SSL validation disabled');
  try {
    const client2 = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
    });
    
    await client2.connect();
    console.log('✅ SSL validation disabled - connection successful');
    await client2.close();
  } catch (error) {
    console.log('❌ SSL validation disabled failed:', error.message);
  }

  // Configuration 3: With explicit SSL settings
  console.log('\n🔍 Test 3: Explicit SSL settings');
  try {
    const client3 = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      ssl: true,
      sslValidate: false,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
    });
    
    await client3.connect();
    console.log('✅ Explicit SSL settings - connection successful');
    await client3.close();
  } catch (error) {
    console.log('❌ Explicit SSL settings failed:', error.message);
  }

  // Configuration 4: With TLS 1.2 enforcement
  console.log('\n🔍 Test 4: TLS 1.2 enforcement');
  try {
    const client4 = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
      // Force TLS 1.2
      tlsVersion: 'TLSv1.2',
    });
    
    await client4.connect();
    console.log('✅ TLS 1.2 enforcement - connection successful');
    await client4.close();
  } catch (error) {
    console.log('❌ TLS 1.2 enforcement failed:', error.message);
  }

  console.log('\n🔧 Recommended solution:');
  console.log('Set MONGO_TLS_INSECURE=true in your environment variables');
  console.log('This will disable SSL certificate validation for development');
}

testSSLConnection().catch(console.error);
