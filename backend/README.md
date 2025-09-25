# NetSync Backend

## Render.com Deployment Instructions

### Manual Configuration in Render Dashboard

Since you're deploying only the backend folder, configure these settings in your Render service dashboard:

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

**Environment Variables:**
```bash
NODE_ENV=production
PORT=10000
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=your_mongodb_atlas_connection_string
REDIS_URL=your_redis_cloud_connection_string
FRONTEND_URL=http://localhost:3000
SENSAY_API_KEY=your_sensay_api_key (optional)
```

### Required Environment Variables

1. **MONGODB_URI**: Your MongoDB Atlas connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

2. **REDIS_URL**: Your Redis Cloud connection string
   - Format: `redis://default:password@hostname:port`

3. **JWT_SECRET**: A secure random string for JWT signing
   - Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### Health Check

The application includes a health check endpoint at `/health` that returns server status.

### Local Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm install
npm run build
npm start
```