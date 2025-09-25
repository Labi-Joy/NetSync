# NetSync Deployment Guide

## Render.com Deployment

This project is configured for deployment on Render.com using the `render.yaml` configuration file.

### Prerequisites

1. **MongoDB Atlas Account**: Set up a MongoDB Atlas cluster and get the connection string
2. **Redis Cloud Account**: Set up a Redis Cloud instance and get the connection string
3. **Render.com Account**: Create an account on Render.com

### Environment Variables

#### Backend Environment Variables

Set these in your Render.com dashboard for the backend service:

```bash
# Database
MONGODB_URI=your_mongodb_atlas_connection_string
REDIS_URL=your_redis_cloud_connection_string

# Security
JWT_SECRET=your_super_secure_jwt_secret_here

# API Integration (Optional)
SENSAY_API_KEY=your_sensay_api_key

# SMTP Configuration (Optional)
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password

# Environment
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-app.onrender.com
```

#### Frontend Environment Variables

Set these in your Render.com dashboard for the frontend service:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com
NODE_ENV=production
```

### Deployment Steps

1. **Fork/Clone the Repository**
   - Fork this repository to your GitHub account
   - Or clone and push to your own repository

2. **Create Render Services**
   - Connect your GitHub repository to Render
   - Render will automatically detect the `render.yaml` file
   - It will create both frontend and backend services automatically

3. **Configure Environment Variables**
   - Go to each service in your Render dashboard
   - Add the required environment variables listed above

4. **Deploy**
   - Render will automatically deploy when you push to the master branch
   - Monitor the deployment logs for any issues

### Service URLs

After deployment, your services will be available at:
- Backend: `https://netsync-backend.onrender.com`
- Frontend: `https://netsync-frontend.onrender.com`

### Health Checks

The backend includes a health check endpoint at `/health` that returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster (free tier is sufficient for development)
3. Create a database user with read/write permissions
4. Whitelist IP addresses (or allow access from anywhere for Render: 0.0.0.0/0)
5. Get the connection string and replace `<password>` with your user password

### Redis Cloud Setup

1. Create a Redis Cloud account at https://redis.com/redis-cloud/
2. Create a new database (free tier available)
3. Get the connection string from the dashboard
4. Use the connection string in the REDIS_URL environment variable

### Troubleshooting

#### Common Issues

1. **Build Failures**
   - Check that all dependencies are listed in package.json
   - Ensure TypeScript compiles without errors locally
   - Verify environment variables are set correctly

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string format
   - Check that IP whitelist includes Render's IP ranges
   - Ensure database user has proper permissions

3. **Redis Connection Issues**
   - Verify Redis Cloud connection string format
   - Check that the Redis instance is active
   - Ensure the connection string includes authentication

4. **Frontend/Backend Communication**
   - Verify CORS configuration allows the frontend domain
   - Check that API URLs match the deployed backend service
   - Ensure environment variables are set correctly

#### Logs and Monitoring

- View deployment logs in the Render dashboard
- Monitor application logs for runtime errors
- Use the health check endpoint to verify service status

### Local Development

To run locally with production environment variables:

```bash
# Backend
cd backend
npm install
npm run build
npm start

# Frontend
cd frontend
npm install
npm run build
npm start
```

### Updates and Redeployment

- Push changes to the master branch
- Render will automatically detect changes and redeploy
- Monitor deployment status in the Render dashboard