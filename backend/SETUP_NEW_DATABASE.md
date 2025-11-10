# Fresh Database Setup Guide

## Step-by-Step Instructions

### 1. Create a New PostgreSQL Database

Open your terminal and run these commands one by one:

```bash
# Connect to PostgreSQL as your user
psql -U atharva.sachan -h localhost

# Once connected to psql, run these SQL commands:
```

In the psql prompt, type:

```sql
-- Create a new database
CREATE DATABASE carzilla_auth_db;

-- Exit psql
\q
```

### 2. Update Backend Configuration

Update `backend/.env` with these values:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_USER=atharva.sachan
DB_HOST=localhost
DB_NAME=carzilla_auth_db
DB_PASSWORD=
DB_PORT=5432

# JWT Secret
JWT_SECRET=87100a89e6d7b6e5e5c013b47c0d23ae

# Resend API Configuration  
RESEND_API_KEY=re_your_resend_api_key_here

# Application Configuration
APP_NAME=Carzilla

# Node Environment
NODE_ENV=development
```

### 3. Initialize the Database Schema

```bash
cd backend
npm run init-db
```

You should see:
```
✅ Database initialized successfully!
📋 Created tables: users, otps
```

### 4. Verify Database Setup

```bash
node test-db.js
```

You should see:
```
📋 Tables found: 2
   - users
   - otps
   
users table exists: true
otps table exists: true
```

### 5. Start the Backend Server

```bash
npm run dev
```

### 6. Get Resend API Key

1. Go to https://resend.com
2. Sign up for free account
3. Get your API key
4. Add it to `backend/.env`:
   ```
   RESEND_API_KEY=re_YourActualKeyHere
   ```
5. Restart backend server

### 7. Start Frontend and Test

In a new terminal:
```bash
# From project root
npm start
```

Then:
1. Open http://localhost:3000
2. Click "Login"
3. Enter your email
4. Click "Send OTP"
5. Check your email for the code
6. Enter the 6-digit OTP
7. Click "Verify OTP"

## Troubleshooting

### If database creation fails:

Try with standard PostgreSQL port:
```bash
psql -U atharva.sachan -h localhost -p 5432
```

### If you need a password:

To set a password for your PostgreSQL user:
```sql
ALTER USER atharva.sachan WITH PASSWORD 'your_password_here';
```

Then update `.env`:
```env
DB_PASSWORD=your_password_here
```

### Quick Test Command

To quickly test if everything works:
```bash
cd backend
npm run init-db && node test-db.js
```

## Alternative: Using Default PostgreSQL

If you want to use the default PostgreSQL database:

1. Update `.env`:
```env
DB_NAME=postgres
DB_PORT=5432
```

2. Run `npm run init-db`
3. This will create the tables in the default postgres database

## Success Indicators

✅ Database connection works
✅ Tables `users` and `otps` exist  
✅ Backend server runs without errors
✅ API calls complete successfully
✅ OTP emails are sent
✅ Login flow works end-to-end
