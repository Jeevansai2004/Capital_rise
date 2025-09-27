# 🔧 Backend Environment Variables Guide

## 📋 Complete Environment Variables List

### 🚀 **Server Configuration**
```env
PORT=5000
NODE_ENV=development
```

### 🌐 **Client Configuration**
```env
CLIENT_URL=http://localhost:3000
```

### 🗄️ **Database Configuration**
```env
# MongoDB Atlas (Production)
MONGO_URI=mongodb+srv://saijeevan362:oSAfLeWulTt1r7ZB@capitalrisecluster.fauhhu9.mongodb.net/capital_rise?retryWrites=true&w=majority&appName=CapitalRiseCluster
MONGO_DB=capital_rise

# Local SQLite (Development fallback)
DB_PATH=./database/capital_rise.db
```

### 🔐 **Security Configuration**
```env
# JWT Secret (CHANGE IN PRODUCTION!)
JWT_SECRET=capital-rise-super-secret-jwt-key-2024

# Session and Cookie secrets (CHANGE IN PRODUCTION!)
SESSION_SECRET=capital-rise-session-secret-key-2024
COOKIE_SECRET=capital-rise-cookie-secret-key-2024
```

### 👤 **Admin Configuration**
```env
# Default admin credentials (CHANGE IN PRODUCTION!)
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@capitalrise.com
ADMIN_PASSWORD=admin123
```

### ⚡ **Rate Limiting**
```env
# Rate limiting (15 minutes window, 100 requests)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 📝 **Logging**
```env
LOG_LEVEL=info
```

### 📱 **Twilio SMS Configuration**
```env
# Get these from Twilio Console
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_WHATSAPP_NUMBER=your_twilio_whatsapp_number
```

### 🔧 **MongoDB Configuration**
```env
# MongoDB TLS Configuration
MONGO_TLS_INSECURE=false
```

### 🧪 **Development Configuration**
```env
# Use in-memory database for testing
USE_IN_MEMORY_DB=false
```

## 🚀 **Production Environment Variables**

For production deployment, use these secure values:

```env
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
JWT_SECRET=your-super-secure-production-jwt-secret-2024
SESSION_SECRET=your-super-secure-production-session-secret-2024
COOKIE_SECRET=your-super-secure-production-cookie-secret-2024
ADMIN_PASSWORD=your-super-secure-admin-password-2024
```

## 📝 **How to Set Environment Variables**

### 1. **Local Development**
Create a `.env` file in your project root:
```bash
# Copy the example
cp env.example .env

# Edit with your values
nano .env
```

### 2. **Render Deployment**
Set environment variables in Render dashboard:
1. Go to your service dashboard
2. Click "Environment"
3. Add each variable with its value

### 3. **Command Line (Windows)**
```powershell
# Set for current session
$env:PORT="5000"
$env:NODE_ENV="production"
$env:MONGO_URI="your-mongodb-uri"

# Set permanently
[Environment]::SetEnvironmentVariable("PORT", "5000", "User")
```

### 4. **Command Line (Linux/Mac)**
```bash
# Set for current session
export PORT=5000
export NODE_ENV=production
export MONGO_URI="your-mongodb-uri"

# Set permanently (add to ~/.bashrc)
echo 'export PORT=5000' >> ~/.bashrc
```

## 🔒 **Security Best Practices**

### ✅ **DO:**
- Use strong, unique secrets for production
- Rotate secrets regularly
- Use environment-specific configurations
- Never commit secrets to version control

### ❌ **DON'T:**
- Use default passwords in production
- Share secrets in plain text
- Use the same secrets across environments
- Store secrets in code

## 🧪 **Testing Environment Variables**

Test your configuration:
```bash
# Test database connection
node test-mongodb-atlas.js

# Test admin user
node final-admin-check.js

# Test full deployment
node test-deployment.js
```

## 📊 **Environment Variable Priority**

1. **Command line environment variables** (highest priority)
2. **`.env` file** (local development)
3. **System environment variables**
4. **Default values in code** (lowest priority)

## 🔍 **Troubleshooting**

### Common Issues:
1. **Missing MONGO_URI**: Set your MongoDB Atlas connection string
2. **Authentication failed**: Check username/password in connection string
3. **Network access denied**: Add your IP to MongoDB Atlas Network Access
4. **JWT errors**: Ensure JWT_SECRET is set and consistent

### Debug Commands:
```bash
# Check if variables are loaded
node -e "console.log(process.env.MONGO_URI)"

# Test specific configuration
node -e "require('dotenv').config(); console.log(process.env)"
```

## 📋 **Quick Setup Checklist**

- [ ] Set `MONGO_URI` with your Atlas connection string
- [ ] Set `JWT_SECRET` with a secure random string
- [ ] Set `ADMIN_PASSWORD` with a strong password
- [ ] Configure `CLIENT_URL` for your frontend
- [ ] Set `NODE_ENV=production` for deployment
- [ ] Test all connections before deployment

Your backend is now properly configured! 🎉
