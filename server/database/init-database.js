const { connectToDatabase } = require('../config/database');

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    const db = await connectToDatabase();
    
    // Create collections if they don't exist
    const collections = [
      'users',
      'investments', 
      'referrals',
      'withdrawals',
      'messages',
      'client_balances',
      'loots',
      'mobile_otps',
      'new_registrations',
      'password_reset_requests',
      'client_customers',
      'leaderboard_seasons',
      'leaderboard_entries',
      'leaderboard_winners'
    ];

    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      } catch (error) {
        if (error.code === 48) { // Collection already exists
          console.log(`ℹ️  Collection already exists: ${collectionName}`);
        } else {
          console.error(`❌ Error creating collection ${collectionName}:`, error.message);
        }
      }
    }

    // Create indexes for better performance
    const usersCollection = db.collection('users');
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ username: 1 }, { unique: true });
    console.log('✅ Created indexes for users collection');

    const messagesCollection = db.collection('messages');
    await messagesCollection.createIndex({ created_at: 1 });
    await messagesCollection.createIndex({ sender_id: 1, receiver_id: 1 });
    console.log('✅ Created indexes for messages collection');

    const investmentsCollection = db.collection('investments');
    await investmentsCollection.createIndex({ user_id: 1 });
    await investmentsCollection.createIndex({ created_at: 1 });
    await investmentsCollection.createIndex({ referral_code: 1 }, { unique: true });
    console.log('✅ Created indexes for investments collection');

    const referralsCollection = db.collection('referrals');
    await referralsCollection.createIndex({ investment_id: 1 });
    await referralsCollection.createIndex({ status: 1 });

    const clientBalances = db.collection('client_balances');
    await clientBalances.createIndex({ user_id: 1 }, { unique: true });

    const passwordResets = db.collection('password_reset_requests');
    await passwordResets.createIndex({ user_id: 1 });
    await passwordResets.createIndex({ type: 1 });

    const clientCustomers = db.collection('client_customers');
    await clientCustomers.createIndex({ client_id: 1 });
    await clientCustomers.createIndex({ investment_id: 1 });
    await clientCustomers.createIndex({ status: 1 });
    console.log('✅ Created indexes for referrals collection');

    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase }; 