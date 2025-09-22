# NetSync - Conference Networking Bot Platform

The Conference Catalyst - a sophisticated networking bot platform that connects conference attendees based on interests, goals, and expertise, facilitating meaningful real-world connections during events.

## 🏗️ Architecture Overview

This project is now organized as **separate frontend and backend services** that can be deployed independently:

```
NetSync/
├── 🌐 frontend/          # Next.js React application
├── 🔧 backend/           # Express.js API server
├── 🐳 docker-compose.yml # Production deployment
├── 🛠️ scripts/          # Deployment & management scripts
└── 📝 README.md          # This file
```

### **Tech Stack**
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS
- **Backend**: Express.js with TypeScript, Socket.IO
- **Database**: MongoDB (primary storage)
- **Cache**: Redis (sessions, real-time data)
- **API Integration**: Sensay Platform API
- **Authentication**: JWT-based auth system
- **Deployment**: Docker & Docker Compose

### **Design Theme**
Dark professional conference theme:
- **Primary Dark**: #251a1e (main background)
- **Accent Dark**: #481f30 (secondary elements)
- **Neon Green**: #cdff81 (actions, highlights, glow effects)

## 🚀 Quick Start

### **Option 1: Docker (Recommended)**

```bash
# Clone the repository
git clone <your-repo-url>
cd NetSync

# Start the entire platform with one command
npm run dev
```

This will:
- 🐳 Start MongoDB and Redis containers
- 🔧 Launch the backend API server (port 5000)
- 🌐 Launch the frontend app (port 3000)
- 📊 Set up health checks and logging

**Access the platform**: http://localhost:3000

### **Option 2: Manual Setup**

#### 1. Install Dependencies
```bash
# Install all dependencies
npm run install:all

# Or install individually
npm run install:backend
npm run install:frontend
```

#### 2. Environment Configuration
```bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Update with your actual values:
# - JWT_SECRET (make it long and random)
# - SENSAY_API_KEY (your Sensay API key)
```

#### 3. Start Services Individually
```bash
# Terminal 1: Start databases
docker run -d -p 27017:27017 mongo:7
docker run -d -p 6379:6379 redis:7-alpine

# Terminal 2: Start backend
npm run dev:backend

# Terminal 3: Start frontend
npm run dev:frontend
```

## 🛠️ Development & Deployment

### **Development Commands**
```bash
# 🚀 Quick start (recommended)
npm run dev              # Start full development environment
npm stop                 # Stop all services

# 🔧 Individual services
npm run dev:frontend     # Frontend only (port 3000)
npm run dev:backend      # Backend only (port 5000)

# 📦 Building
npm run build:all        # Build both services
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only

# 🧹 Maintenance
npm run clean           # Remove containers and clean Docker
npm run lint:all        # Lint both services
npm test:backend        # Run backend tests
```

### **Production Deployment**
```bash
# 🚀 Deploy to production
npm run deploy

# Or manually with Docker Compose
docker-compose up -d --build
```

## 📊 Service Architecture

### **🌐 Frontend Service** (`/frontend`)
- **Next.js 15** with TypeScript and Tailwind CSS
- **Dark conference theme** with neon green accents
- **Socket.IO client** for real-time features
- **JWT authentication** with automatic token refresh
- **Dockerized** with multi-stage build optimization

### **🔧 Backend Service** (`/backend`)
- **Express.js API** with TypeScript
- **MongoDB** with Mongoose ODM and proper indexing
- **Redis** for sessions and real-time data caching
- **Socket.IO server** for WebSocket connections
- **JWT authentication** with refresh token rotation
- **Rate limiting, security headers, request validation**
- **Sensay API integration** for bot conversations

### **🗄️ Database Services**
- **MongoDB 7**: User profiles, events, connections, with optimized indexes
- **Redis 7**: Session storage, real-time data, WebSocket state

## ✅ Implementation Status

**Fully Implemented Core Features:**
- 🎯 **Smart Matching Algorithm** - Interest/skill/experience-based matching
- 🤖 **Sensay Bot Integration** - AI-powered introductions and conversations
- ⚡ **Real-time Networking** - WebSocket events for live connections
- 🔐 **Complete Authentication** - Registration, login, JWT, refresh tokens
- 📊 **Event Management** - Conference creation, attendee management, scheduling
- 🎨 **Professional UI** - Dark theme matching instruction.txt specifications
- 🔒 **Production Security** - Rate limiting, validation, secure headers

**Architecture Benefits:**
- 🚀 **Independent Scaling** - Frontend and backend can scale separately
- 🐳 **Container Ready** - Docker images with health checks and optimization
- 🔧 **Development Friendly** - Hot reload, logging, easy debugging
- 📊 **Production Ready** - Security, monitoring, error handling

## 🚀 What's Next?

The platform foundation is complete and matches instruction.txt exactly. Ready for:
- 📱 **Mobile responsiveness** improvements
- 🔔 **Push notifications** for real-time alerts  
- 📈 **Analytics dashboard** for event organizers
- 🌍 **Multi-language support** for international conferences
- 📅 **Calendar integration** for meeting scheduling
