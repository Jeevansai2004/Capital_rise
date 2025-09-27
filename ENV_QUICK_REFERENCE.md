# 🚀 Backend Environment Variables - Quick Reference

## 🔥 **Essential Variables (Must Set)**

```env
# Database (REQUIRED)
MONGO_URI=mongodb+srv://saijeevan362:oSAfLeWulTt1r7ZB@capitalrisecluster.fauhhu9.mongodb.net/capital_rise?retryWrites=true&w=majority&appName=CapitalRiseCluster
MONGO_DB=capital_rise

# Security (REQUIRED)
JWT_SECRET=capital-rise-super-secret-jwt-key-2024
SESSION_SECRET=capital-rise-session-secret-key-2024
COOKIE_SECRET=capital-rise-cookie-secret-key-2024

# Server (REQUIRED)
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## ⚙️ **Admin Configuration**

```env
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@capitalrise.com
ADMIN_PASSWORD=admin123
```

## 📱 **Optional Variables**

```env
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# Twilio SMS (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_WHATSAPP_NUMBER=your_twilio_whatsapp_number
```

## 🚀 **Quick Setup Commands**

### 1. **Interactive Setup**
```bash
node setup-env-variables.js
```

### 2. **Manual Setup**
```bash
# Copy example
cp env.example .env

# Edit with your values
nano .env
```

### 3. **Test Configuration**
```bash
# Test database
node test-mongodb-atlas.js

# Test admin
node final-admin-check.js
```

## 🔧 **Production Values**

For production, change these:
```env
NODE_ENV=production
CLIENT_URL=https://your-domain.com
JWT_SECRET=your-super-secure-production-secret
ADMIN_PASSWORD=your-super-secure-password
```

## 📋 **Deployment Checklist**

- [ ] `MONGO_URI` set to Atlas connection string
- [ ] `JWT_SECRET` set to secure random string
- [ ] `NODE_ENV=production` for deployment
- [ ] `CLIENT_URL` set to your frontend URL
- [ ] `ADMIN_PASSWORD` changed from default
- [ ] Test all connections before deployment

## 🆘 **Troubleshooting**

| Issue | Solution |
|-------|----------|
| Database connection failed | Check `MONGO_URI` and Atlas Network Access |
| JWT errors | Verify `JWT_SECRET` is set and consistent |
| Admin login failed | Check `ADMIN_USERNAME` and `ADMIN_PASSWORD` |
| CORS errors | Verify `CLIENT_URL` matches your frontend URL |

## 📞 **Need Help?**

1. Check `BACKEND_ENV_VARIABLES.md` for detailed guide
2. Run `node setup-env-variables.js` for interactive setup
3. Test with `node test-mongodb-atlas.js`
4. Verify admin with `node final-admin-check.js`

Your backend environment is ready! 🎉
