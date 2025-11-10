# Email OTP Authentication Setup Guide

This guide will help you set up the email-based OTP authentication system for Carzilla.

## Overview

The authentication system uses:
- **Backend**: Node.js + Express + PostgreSQL
- **Email Service**: Resend
- **OTP**: 6-digit code, 5-minute expiration, 3 attempts max
- **Security**: Bcrypt hashed OTPs

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Resend account with API key

## Setup Instructions

### 1. Get a Resend API Key

1. Go to [resend.com](https://resend.com) and create an account
2. Verify your email address
3. Navigate to API Keys section
4. Create a new API key and copy it
5. For development, you can use their test domain `onboarding@resend.dev`
6. For production, you'll need to verify your own domain

### 2. Configure Backend Environment

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your credentials:
   ```env
   PORT=5000
   
   # PostgreSQL Database
   DB_USER=your_postgres_username
   DB_HOST=localhost
   DB_NAME=carzilla_db
   DB_PASSWORD=your_postgres_password
   DB_PORT=5432
   
   # Resend API Key
   RESEND_API_KEY=re_your_actual_api_key_here
   
   # Application
   APP_NAME=Carzilla
   NODE_ENV=development
   ```

### 3. Set Up Database

1. Create the PostgreSQL database:
   ```bash
   createdb carzilla_db
   ```
   
   Or using psql:
   ```sql
   CREATE DATABASE carzilla_db;
   ```

2. Initialize the database schema:
   ```bash
   npm run init-db
   ```

   This creates two tables:
   - `users` - Stores user information
   - `otps` - Stores OTP codes temporarily

### 4. Configure Frontend Environment

1. In the root directory, copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_NAME=Carzilla
   ```

### 5. Install Dependencies

#### Backend:
```bash
cd backend
npm install
```

#### Frontend:
```bash
# In root directory
npm install
```

### 6. Start the Application

#### Start Backend Server:
```bash
cd backend
npm run dev
```

The server will run on `http://localhost:5000`

#### Start Frontend:
```bash
# In root directory
npm start
```

The app will run on `http://localhost:3000`

## How It Works

### User Flow

1. **User clicks "Login"** → Opens login popup
2. **User enters email** → Clicks "Send OTP"
3. **System sends OTP** → 6-digit code sent via email
4. **User enters OTP** → Clicks "Verify OTP"
5. **System verifies** → User logged in

### API Endpoints

#### Send OTP
```
POST /api/auth/send-otp
Body: { "email": "user@example.com" }
Response: { "success": true, "message": "OTP sent successfully", "expiresIn": 300 }
```

#### Verify OTP
```
POST /api/auth/verify-otp
Body: { "email": "user@example.com", "otp": "123456" }
Response: { "success": true, "user": { "id": 1, "email": "user@example.com" } }
```

### Security Features

1. **OTP Hashing**: OTPs are bcrypt-hashed before storing
2. **Expiration**: OTPs expire after 5 minutes
3. **Attempt Limiting**: Max 3 verification attempts per OTP
4. **Auto-deletion**: Used or expired OTPs are automatically deleted
5. **Email Masking**: Email addresses are partially hidden in UI

## Testing

### 1. Test Email Delivery

1. Start the backend server
2. Use a tool like Postman or curl:
   ```bash
   curl -X POST http://localhost:5000/api/auth/send-otp \
     -H "Content-Type: application/json" \
     -d '{"email":"your-email@example.com"}'
   ```
3. Check your email for the OTP

### 2. Test Frontend Flow

1. Start both backend and frontend
2. Open `http://localhost:3000`
3. Click "Login" button
4. Enter your email
5. Check email for OTP
6. Enter the 6-digit code
7. Verify successful login

## Common Issues

### Issue: "Failed to send email"
**Solution**: 
- Verify your Resend API key is correct
- Check if you're using a verified domain (for production)
- Ensure your Resend account is active

### Issue: "Database connection failed"
**Solution**:
- Ensure PostgreSQL is running
- Verify database credentials in `.env`
- Check if database exists: `psql -l`

### Issue: "OTP expired"
**Solution**:
- OTPs expire after 5 minutes
- Request a new OTP using "Resend OTP"

### Issue: "Too many failed attempts"
**Solution**:
- After 3 wrong attempts, request a new OTP
- Check email for the correct code

## Production Considerations

### 1. Domain Verification (Resend)

For production, verify your domain with Resend:
1. Add your domain in Resend dashboard
2. Add DNS records (SPF, DKIM)
3. Update email sender in `backend/services/emailService.js`:
   ```javascript
   from: `Carzilla <noreply@yourdomain.com>`
   ```

### 2. Environment Variables

- Use strong, random values for secrets
- Never commit `.env` files to version control
- Use environment-specific configurations

### 3. Security Enhancements

- Add rate limiting (e.g., express-rate-limit)
- Implement HTTPS in production
- Add CORS configuration for your frontend domain
- Consider adding captcha for OTP requests

### 4. Database

- Use connection pooling (already configured)
- Set up regular backups
- Monitor query performance
- Clean up expired OTPs periodically

## File Structure

```
backend/
├── config/
│   ├── database.js          # PostgreSQL connection
│   └── schema.sql           # Database schema
├── controllers/
│   └── authController.js    # Authentication logic
├── routes/
│   └── authRoutes.js        # API routes
├── scripts/
│   └── initDatabase.js      # DB initialization script
├── services/
│   └── emailService.js      # Resend email integration
└── server.js                # Express server

src/
├── services/
│   └── authApi.js           # API client
└── Components/
    ├── MobileLogin.jsx      # Login UI
    └── MobileOTPVerification.jsx  # OTP verification UI
```

## Support

For issues or questions:
1. Check this documentation
2. Review error messages in browser console and server logs
3. Verify all environment variables are set correctly

## License

ISC
