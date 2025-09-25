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
  });

  // Try primary URI
  try {
    client = buildClient(uri);
    await client.connect();
    db = client.db(dbName);
    return db;
  } catch (primaryError) {
    // Fallback to local MongoDB for development
    const fallbackUri = 'mongodb://127.0.0.1:27017';
    try {
      console.warn('Primary MongoDB connection failed. Trying local MongoDB on 127.0.0.1:27017 ...');
      client = buildClient(fallbackUri);
      await client.connect();
      db = client.db(dbName);
      return db;
    } catch (fallbackError) {
      // Fallback to in-memory MongoDB if available
      if (MemoryServer && (process.env.USE_IN_MEMORY_DB || process.env.NODE_ENV === 'development')) {
        console.warn('Local MongoDB not available. Starting in-memory MongoDB for development ...');
        const mem = await MemoryServer.create();
        const memUri = mem.getUri();
        client = new MongoClient(memUri);
        await client.connect();
        db = client.db(dbName);
        return db;
      }
      console.error('Failed to connect to primary, local, and in-memory MongoDB instances.');
      throw primaryError;
    }
  }
}

module.exports = {
  connectToDatabase,
  getClient: () => client,
};