#!/bin/bash

# NetSync Platform - Stop Development Environment
set -e

echo "🛑 Stopping NetSync Platform Development Environment"
echo "==================================================="

# Stop development containers
if docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
    echo "📦 Stopping development containers..."
    docker-compose -f docker-compose.dev.yml down
    echo "✅ Development containers stopped"
else
    echo "ℹ️  No running development containers found"
fi

# Stop production containers if they're running
if docker-compose ps | grep -q "Up"; then
    echo "📦 Stopping production containers..."
    docker-compose down
    echo "✅ Production containers stopped"
fi

# Optional: Remove volumes (uncomment if you want to reset data)
# echo "🗑️  Removing volumes..."
# docker-compose -f docker-compose.dev.yml down -v
# docker-compose down -v

echo ""
echo "✅ NetSync Platform stopped successfully"
echo ""
echo "💡 To start again, run: ./scripts/start.sh"
echo "💡 To remove all data, run: docker-compose down -v"