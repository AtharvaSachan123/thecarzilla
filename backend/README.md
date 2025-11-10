# Carzilla Backend API

This is the backend API for the Carzilla application, built with Express.js, Node.js, and PostgreSQL.

## Project Structure

```
backend/
├── config/          # Configuration files (database, etc.)
├── controllers/     # Request handlers/business logic
├── models/          # Database models
├── routes/          # API route definitions
├── middleware/      # Custom middleware functions
├── server.js        # Entry point
├── .env.example     # Environment variables template
└── package.json     # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your database credentials and configuration:
```
PORT=5000
DB_USER=your_database_user
DB_HOST=localhost
DB_NAME=carzilla_db
DB_PASSWORD=your_database_password
DB_PORT=5432
```

### Database Setup

1. Create a PostgreSQL database:
```bash
createdb carzilla_db
```

Or using psql:
```sql
CREATE DATABASE carzilla_db;
```

2. Create your tables (add your schema here or create migration files)

### Running the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your .env file)

## API Endpoints

### Health Check
- `GET /health` - Check if the server is running

### Example Routes
- `GET /api/example` - Get all items
- `GET /api/example/:id` - Get item by ID
- `POST /api/example` - Create new item
- `PUT /api/example/:id` - Update item
- `DELETE /api/example/:id` - Delete item

## Development

### Adding New Routes

1. Create a controller in `controllers/` directory
2. Create route definitions in `routes/` directory
3. Import and use the routes in `server.js`

Example:
```javascript
// In server.js
const yourRoutes = require('./routes/yourRoutes');
app.use('/api/your-endpoint', yourRoutes);
```

### Database Queries

Use the database module from `config/database.js`:

```javascript
const db = require('../config/database');

// Example query
const result = await db.query('SELECT * FROM your_table WHERE id = $1', [id]);
```

## Project Scripts

- `npm start` - Start the server
- `npm run dev` - Start the server with nodemon (auto-restart on changes)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| DB_USER | PostgreSQL username | - |
| DB_HOST | PostgreSQL host | localhost |
| DB_NAME | Database name | - |
| DB_PASSWORD | Database password | - |
| DB_PORT | PostgreSQL port | 5432 |
| NODE_ENV | Environment (development/production) | development |
| JWT_SECRET | Secret key for JWT authentication | - |

## Authentication System

This backend now includes a complete email-based OTP authentication system:

### Features
- ✅ Email OTP verification
- ✅ Secure OTP hashing with bcrypt
- ✅ 5-minute OTP expiration
- ✅ 3 attempt limit per OTP
- ✅ Auto user creation on first login
- ✅ Resend OTP functionality

### API Endpoints

**Send OTP**
```
POST /api/auth/send-otp
Body: { "email": "user@example.com" }
```

**Verify OTP**
```
POST /api/auth/verify-otp
Body: { "email": "user@example.com", "otp": "123456" }
```

### Quick Start

1. Install dependencies:
```bash
npm install
```

2. Configure your `.env` file:
```bash
cp .env.example .env
# Edit .env with your database and Resend API credentials
```

3. Initialize the database:
```bash
npm run init-db
```

4. Start the server:
```bash
npm run dev
```

For detailed setup instructions, see [AUTHENTICATION_SETUP.md](../AUTHENTICATION_SETUP.md) in the root directory.

## License

ISC
