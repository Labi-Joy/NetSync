#!/bin/bash

# NetSync Platform - Production Deployment Script
set -e

echo "🚀 Deploying NetSync Platform to Production"
echo "============================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create one from .env.example"
    exit 1
fi

# Check required environment variables
required_vars=("JWT_SECRET" "SENSAY_API_KEY")
for var in "${required_vars[@]}"; do
    if ! grep -q "^$var=" .env; then
        echo "❌ Required environment variable $var not found in .env"
        exit 1
    fi
done

# Build and deploy
echo "🔨 Building production images..."
docker-compose build --no-cache

echo "📦 Starting production containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Health checks
echo "🔍 Running health checks..."

# Check backend
backend_health=$(curl -f http://localhost:5000/health 2>/dev/null && echo "OK" || echo "FAILED")
if [ "$backend_health" = "OK" ]; then
    echo "✅ Backend API is healthy"
else
    echo "❌ Backend API health check failed"
    docker-compose logs backend
    exit 1
fi

# Check frontend
frontend_health=$(curl -f http://localhost:3000 2>/dev/null && echo "OK" || echo "FAILED")
if [ "$frontend_health" = "OK" ]; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
    docker-compose logs frontend
    exit 1
fi

# Check database connections
echo "🗄️  Checking database connections..."
if docker-compose exec -T backend node -e "
const mongoose = require('mongoose');
const redis = require('redis');
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('MongoDB connection successful');
    mongoose.disconnect();
}).catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
});
const redisClient = redis.createClient({url: process.env.REDIS_URL});
redisClient.connect().then(() => {
    console.log('Redis connection successful');
    redisClient.disconnect();
}).catch(err => {
    console.error('Redis connection failed:', err.message);
    process.exit(1);
});
"; then
    echo "✅ Database connections verified"
else
    echo "❌ Database connection check failed"
    exit 1
fi

echo ""
echo "🎉 NetSync Platform deployed successfully!"
echo ""
echo "📊 Production Services:"
echo "   🌐 Frontend: http://localhost:3000"
echo "   🔧 Backend API: http://localhost:5000"
echo "   📋 Health Check: http://localhost:5000/health"
echo ""
echo "📋 Management Commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop: docker-compose down"
echo "   Restart: docker-compose restart"
echo "   Update: git pull && ./scripts/deploy-prod.sh"
echo ""
echo "⚠️  Don't forget to:"
echo "   - Set up SSL certificates for production domains"
echo "   - Configure firewall rules"
echo "   - Set up monitoring and backups"
echo "   - Update DNS records to point to this server"