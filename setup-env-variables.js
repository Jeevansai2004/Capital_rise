#!/usr/bin/env node

// Environment Variables Setup Script
// This script helps you configure your backend environment variables

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupEnvironment() {
  console.log('🔧 Capital Rise Backend Environment Setup');
  console.log('==========================================\n');

  const envVars = {};

  // Server Configuration
  console.log('📋 Server Configuration:');
  envVars.PORT = await question('Port (default: 5000): ') || '5000';
  envVars.NODE_ENV = await question('Environment (development/production): ') || 'development';

  // Client Configuration
  console.log('\n🌐 Client Configuration:');
  envVars.CLIENT_URL = await question('Client URL (default: http://localhost:3000): ') || 'http://localhost:3000';

  // Database Configuration
  console.log('\n🗄️ Database Configuration:');
  console.log('Your MongoDB Atlas URI is already configured:');
  console.log('mongodb+srv://saijeevan362:oSAfLeWulTt1r7ZB@capitalrisecluster.fauhhu9.mongodb.net/capital_rise?retryWrites=true&w=majority&appName=CapitalRiseCluster');
  
  const useAtlas = await question('Use MongoDB Atlas? (y/n, default: y): ') || 'y';
  if (useAtlas.toLowerCase() === 'y') {
    envVars.MONGO_URI = 'mongodb+srv://saijeevan362:oSAfLeWulTt1r7ZB@capitalrisecluster.fauhhu9.mongodb.net/capital_rise?retryWrites=true&w=majority&appName=CapitalRiseCluster';
    envVars.MONGO_DB = 'capital_rise';
  } else {
    envVars.MONGO_URI = 'mongodb://localhost:27017';
    envVars.MONGO_DB = 'capital_rise';
  }

  // Security Configuration
  console.log('\n🔐 Security Configuration:');
  envVars.JWT_SECRET = await question('JWT Secret (default: capital-rise-super-secret-jwt-key-2024): ') || 'capital-rise-super-secret-jwt-key-2024';
  envVars.SESSION_SECRET = await question('Session Secret (default: capital-rise-session-secret-key-2024): ') || 'capital-rise-session-secret-key-2024';
  envVars.COOKIE_SECRET = await question('Cookie Secret (default: capital-rise-cookie-secret-key-2024): ') || 'capital-rise-cookie-secret-key-2024';

  // Admin Configuration
  console.log('\n👤 Admin Configuration:');
  envVars.ADMIN_USERNAME = await question('Admin Username (default: admin): ') || 'admin';
  envVars.ADMIN_EMAIL = await question('Admin Email (default: admin@capitalrise.com): ') || 'admin@capitalrise.com';
  envVars.ADMIN_PASSWORD = await question('Admin Password (default: admin123): ') || 'admin123';

  // Rate Limiting
  console.log('\n⚡ Rate Limiting:');
  envVars.RATE_LIMIT_WINDOW_MS = await question('Rate Limit Window (ms, default: 900000): ') || '900000';
  envVars.RATE_LIMIT_MAX_REQUESTS = await question('Max Requests (default: 100): ') || '100';

  // Logging
  console.log('\n📝 Logging:');
  envVars.LOG_LEVEL = await question('Log Level (default: info): ') || 'info';

  // Twilio Configuration (Optional)
  console.log('\n📱 Twilio SMS Configuration (Optional):');
  const setupTwilio = await question('Setup Twilio SMS? (y/n, default: n): ') || 'n';
  if (setupTwilio.toLowerCase() === 'y') {
    envVars.TWILIO_ACCOUNT_SID = await question('Twilio Account SID: ');
    envVars.TWILIO_AUTH_TOKEN = await question('Twilio Auth Token: ');
    envVars.TWILIO_PHONE_NUMBER = await question('Twilio Phone Number: ');
    envVars.TWILIO_WHATSAPP_NUMBER = await question('Twilio WhatsApp Number: ');
  } else {
    envVars.TWILIO_ACCOUNT_SID = '';
    envVars.TWILIO_AUTH_TOKEN = '';
    envVars.TWILIO_PHONE_NUMBER = '';
    envVars.TWILIO_WHATSAPP_NUMBER = '';
  }

  // Generate .env file
  console.log('\n📝 Generating .env file...');
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  try {
    fs.writeFileSync('.env', envContent);
    console.log('✅ .env file created successfully!');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    console.log('\n📋 Manual setup - copy these variables to your .env file:');
    console.log(envContent);
  }

  // Test configuration
  console.log('\n🧪 Testing configuration...');
  try {
    require('dotenv').config();
    console.log('✅ Environment variables loaded successfully!');
    
    if (process.env.MONGO_URI) {
      console.log('✅ MongoDB URI configured');
    }
    if (process.env.JWT_SECRET) {
      console.log('✅ JWT Secret configured');
    }
    if (process.env.ADMIN_USERNAME) {
      console.log('✅ Admin configuration set');
    }
  } catch (error) {
    console.error('❌ Error testing configuration:', error.message);
  }

  console.log('\n🎉 Environment setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Review your .env file');
  console.log('2. Test database connection: node test-mongodb-atlas.js');
  console.log('3. Start your server: npm run dev');
  
  rl.close();
}

// Run the setup
setupEnvironment().catch(console.error);
