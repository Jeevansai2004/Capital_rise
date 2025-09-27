const { MongoClient, ServerApiVersion } = require('mongodb');
let MemoryServer;
try {
  // Optional dependency for local development fallback
  MemoryServer = require('mongodb-memory-server').MongoMemoryServer;
} catch (_) {
  MemoryServer = null;
}

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB || 'capital_rise';

let client;
let db;

async function connectToDatabase() {
  if (db) return db;

  const allowInsecureTls = String(process.env.MONGO_TLS_INSECURE || '').toLowerCase() === 'true';

  const buildClient = (connectionString) => new MongoClient(connectionString, {
    serverApi: connectionString.startsWith('mongodb+srv://') ? {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    } : undefined,
    tlsAllowInvalidCertificates: allowInsecureTls,
    // Add connection timeout and retry settings for Atlas
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    serverSelectionTimeoutMS: 30000,
    maxPoolSize: 10,
    retryWrites: true,
    retryReads: true,
  });

  // For production deployment, only use Atlas - no fallbacks
  if (process.env.NODE_ENV === 'production' || uri.startsWith('mongodb+srv://')) {
    try {
      console.log('🔗 Connecting to MongoDB Atlas...');
      client = buildClient(uri);
      await client.connect();
      db = client.db(dbName);
      console.log('✅ Successfully connected to MongoDB Atlas');
      return db;
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB Atlas:', error.message);
      throw new Error(`MongoDB Atlas connection failed: ${error.message}`);
    }
  }

  // For development, try Atlas first, then fallback to local
  try {
    console.log('🔗 Attempting MongoDB Atlas connection...');
    client = buildClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log('✅ Connected to MongoDB Atlas');
    return db;
  } catch (primaryError) {
    console.warn('⚠️ Atlas connection failed, trying local MongoDB...');
    
    // Only fallback to local in development
    if (process.env.NODE_ENV === 'development') {
      const fallbackUri = 'mongodb://127.0.0.1:27017';
      try {
        client = buildClient(fallbackUri);
        await client.connect();
        db = client.db(dbName);
        console.log('✅ Connected to local MongoDB');
        return db;
      } catch (fallbackError) {
        // Fallback to in-memory MongoDB if available
        if (MemoryServer && process.env.USE_IN_MEMORY_DB) {
          console.warn('Local MongoDB not available. Starting in-memory MongoDB...');
          const mem = await MemoryServer.create();
          const memUri = mem.getUri();
          client = new MongoClient(memUri);
          await client.connect();
          db = client.db(dbName);
          return db;
        }
        console.error('Failed to connect to Atlas, local, and in-memory MongoDB instances.');
        throw primaryError;
      }
    } else {
      throw primaryError;
    }
  }
}

module.exports = {
  connectToDatabase,
  getClient: () => client,
};