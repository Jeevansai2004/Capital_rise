const fs = require('fs');
const path = require('path');

const envContent = `# Server Configuration
PORT=5100
NODE_ENV=development

# Client URL (for CORS and referral links)
CLIENT_URL=http://localhost:3000

# JWT Secret (change in production)
JWT_SECRET=capital-rise-super-secret-jwt-key-2024

# MongoDB Atlas Configuration
MONGO_URI=
MONGO_DB=capital_rise
MONGO_TLS_INSECURE=true
USE_IN_MEMORY_DB=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Admin Default Credentials (change in production)
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@capitalrise.com
ADMIN_PASSWORD=admin123

# Security
SESSION_SECRET=capital-rise-session-secret-key-2024
COOKIE_SECRET=capital-rise-cookie-secret-key-2024

# Logging
LOG_LEVEL=info

# Twilio Messaging Configuration (leave blank locally; set on server if used)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
TWILIO_WHATSAPP_NUMBER=
`;

try {
  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file updated successfully!');
  console.log('🔗 MongoDB Atlas connection string placeholder written. Fill in MONGO_URI.');
  console.log('\n🚀 Next steps:');
  console.log('1. Set MONGO_URI in .env to your SRV connection string');
  console.log('2. Test connection: node test-mongodb-atlas.js');
  console.log('3. Start application: npm run dev');
} catch (error) {
  console.error('❌ Error updating .env file:', error.message);
} 