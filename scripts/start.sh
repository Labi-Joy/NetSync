#!/bin/bash

# NetSync Platform - Development Startup Script
set -e

echo "🚀 Starting NetSync Platform Development Environment"
echo "=================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p backend/logs

# Copy environment files if they don't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your actual configuration values!"
fi

if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env file from example..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your actual configuration values!"
fi

if [ ! -f frontend/.env.local ]; then
    echo "📝 Creating frontend/.env.local file from example..."
    cp frontend/.env.example frontend/.env.local
fi

# Start the development environment
echo "🐳 Starting Docker containers..."
docker-compose -f docker-compose.dev.yml up -d

echo ""
echo "✅ NetSync Platform is starting up!"
echo ""
echo "📊 Services:"
echo "   🌐 Frontend: http://localhost:3000"
echo "   🔧 Backend API: http://localhost:5000"
echo "   🗄️  MongoDB: localhost:27017"
echo "   📦 Redis: localhost:6379"
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "   Stop services: docker-compose -f docker-compose.dev.yml down"
echo "   Restart services: docker-compose -f docker-compose.dev.yml restart"
echo ""

# Wait a moment for services to start
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

# Check backend health
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Backend API is healthy"
else
    echo "⚠️  Backend API health check failed - it may still be starting up"
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "⚠️  Frontend health check failed - it may still be starting up"
fi

echo ""
echo "🎉 NetSync Platform development environment is ready!"
echo "Visit http://localhost:3000 to get started"