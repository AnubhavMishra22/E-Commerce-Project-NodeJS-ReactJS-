# Docker Setup for QuantumCart E-Commerce

Complete Docker containerization for the QuantumCart E-Commerce Platform (Node.js + React + MySQL).

## 🎯 Purpose

This directory contains all Docker-related files for running the QuantumCart E-Commerce Platform in containerized environments, supporting both development and production deployments.

## 📁 Directory Structure

```
docker/
├── README.md                      # This file
├── docker-compose.yml             # Production configuration
├── docker-compose.dev.yml         # Development configuration
├── .env.example                   # Environment variables template
├── backend/                       # Backend Docker files
│   ├── Dockerfile                 # Production Dockerfile
│   └── Dockerfile.dev             # Development Dockerfile
├── frontend/                      # Frontend Docker files
│   ├── Dockerfile                 # Production Dockerfile (multi-stage)
│   ├── Dockerfile.dev             # Development Dockerfile
│   └── nginx.conf                 # Nginx configuration for React SPA
├── mysql/                         # MySQL initialization
│   └── init/                      # Database initialization scripts
│       ├── 01-init-database.sql   # Database setup
│       └── README.md              # Init scripts documentation
├── scripts/                       # Management scripts
│   ├── start-dev.sh               # Start development environment
│   ├── start-prod.sh              # Start production environment
│   ├── stop.sh                    # Stop all services
│   ├── logs.sh                    # View logs
│   ├── rebuild-dev.sh             # Rebuild development
│   ├── rebuild-prod.sh            # Rebuild production
│   ├── clean.sh                   # Clean everything
│   └── README.md                  # Scripts documentation
└── docs/                          # Documentation
    ├── DOCKER_SETUP.md            # Detailed setup guide
    └── DOCKER_TROUBLESHOOTING.md  # Troubleshooting guide
```

## 🚀 Quick Start

### Development Environment

```bash
cd docker
bash scripts/start-dev.sh
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **MySQL**: localhost:3306

### Production Environment

```bash
cd docker
cp .env.example .env
# Edit .env with your configuration
bash scripts/start-prod.sh
```

Access the application:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000/api
- **MySQL**: localhost:3306

## 🐳 What's Included

### Services

1. **MySQL Database**
   - Version: 8.0
   - Persistent data storage
   - Health checks
   - Auto-initialization scripts

2. **Backend API** (Node.js/Express)
   - Production: Optimized multi-stage build
   - Development: Hot reload with nodemon
   - Health checks
   - Non-root user security

3. **Frontend** (React)
   - Production: Nginx serving optimized build
   - Development: React dev server with hot reload
   - Security headers
   - Gzip compression

### Features

**Development Mode:**
- ✅ Hot reload for backend and frontend
- ✅ Source code mounted as volumes
- ✅ Node.js debugging port (9229)
- ✅ Instant code changes reflection

**Production Mode:**
- ✅ Multi-stage builds for smaller images
- ✅ Optimized production builds
- ✅ Nginx with security headers
- ✅ Gzip compression
- ✅ Health checks for all services
- ✅ Non-root users for security

## 📋 Prerequisites

- **Docker**: 20.10 or higher
- **Docker Compose**: 2.0 or higher

Verify installation:
```bash
docker --version
docker-compose --version
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DB_HOST=mysql
DB_USER=ecommerce_user
DB_PASS=your_secure_password
DB_NAME=ecommerce_db

# Backend
SESSION_SECRET=your_secure_session_secret
NODE_ENV=production

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
```

**⚠️ Important for Production:**
- Change `SESSION_SECRET` to a secure random string
- Use strong `DB_PASS`
- Update `REACT_APP_API_URL` to your production API URL

## 📝 Management Scripts

All scripts are in `scripts/` directory:

| Script | Purpose |
|--------|---------|
| `start-dev.sh` | Start development environment |
| `start-prod.sh` | Start production environment |
| `stop.sh` | Stop all services |
| `logs.sh` | View service logs |
| `rebuild-dev.sh` | Rebuild development images |
| `rebuild-prod.sh` | Rebuild production images |
| `clean.sh` | Complete cleanup (⚠️ removes data) |

See `scripts/README.md` for detailed usage.

## 🏗️ Architecture

### Development Mode
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   MySQL     │────▶│   Backend   │────▶│  Frontend   │
│   :3306     │     │   :5000     │     │   :3000     │
│  (Volume)   │     │ (Nodemon)   │     │ (Dev Server)│
└─────────────┘     └─────────────┘     └─────────────┘
                     Hot Reload          Hot Reload
```

### Production Mode
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   MySQL     │────▶│   Backend   │────▶│   Nginx     │
│   :3306     │     │   :5000     │     │    :80      │
│  (Volume)   │     │ (Node.js)   │     │  (React)    │
└─────────────┘     └─────────────┘     └─────────────┘
                    Optimized           Static Serve
```

## 🔒 Security Features

1. **Multi-stage Builds**: Smaller attack surface
2. **Non-root Users**: Backend and frontend run as non-root
3. **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
4. **Health Checks**: Automatic service health monitoring
5. **Environment Variables**: Secrets not in code
6. **Network Isolation**: Services on private bridge network

## 📊 Resource Requirements

### Minimum (Development)
- CPU: 2 cores
- RAM: 4 GB
- Disk: 10 GB

### Recommended (Production)
- CPU: 4 cores
- RAM: 8 GB
- Disk: 20 GB

## 🛠️ Common Commands

### View Logs
```bash
bash scripts/logs.sh              # All services
bash scripts/logs.sh backend      # Backend only
bash scripts/logs.sh -f           # Follow mode
```

### Rebuild After Changes
```bash
bash scripts/rebuild-dev.sh       # Development
bash scripts/rebuild-prod.sh      # Production
```

### Database Access
```bash
# Access MySQL CLI
docker exec -it ecommerce-mysql-dev mysql -u root -p

# Or for production
docker exec -it ecommerce-mysql-prod mysql -u root -p
```

### Execute Commands in Containers
```bash
# Backend
docker exec -it ecommerce-backend-dev bash

# Frontend
docker exec -it ecommerce-frontend-dev sh
```

## 🐛 Troubleshooting

### Services Won't Start
```bash
bash scripts/logs.sh
bash scripts/rebuild-dev.sh
```

### Database Issues
```bash
bash scripts/logs.sh mysql
# If needed, clean and restart
bash scripts/clean.sh
bash scripts/start-dev.sh
```

### Port Conflicts
```bash
# Check what's using the port
lsof -i :3000  # Frontend
lsof -i :5000  # Backend
lsof -i :3306  # MySQL
```

See `docs/DOCKER_TROUBLESHOOTING.md` for comprehensive troubleshooting.

## 📚 Documentation

Detailed documentation in `docs/`:

- **DOCKER_SETUP.md**: Complete setup guide with prerequisites, installation steps, and configuration
- **DOCKER_TROUBLESHOOTING.md**: Common issues, solutions, and debugging techniques

## 🔄 Development Workflow

1. **Start Development**
   ```bash
   bash scripts/start-dev.sh
   ```

2. **Make Code Changes**
   - Changes auto-reload in both backend and frontend

3. **View Logs**
   ```bash
   bash scripts/logs.sh -f
   ```

4. **Stop When Done**
   ```bash
   bash scripts/stop.sh
   ```

## 🚀 Production Deployment

1. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

2. **Start Production**
   ```bash
   bash scripts/start-prod.sh
   ```

3. **Monitor**
   ```bash
   bash scripts/logs.sh -f
   ```

## 📈 Performance Optimization

### Image Sizes
- Backend: ~150 MB (multi-stage build)
- Frontend: ~25 MB (Nginx + static files)
- MySQL: ~500 MB (official image)

### Build Time Optimization
- Multi-stage builds reduce final image size
- Layer caching for faster rebuilds
- `.dockerignore` excludes unnecessary files

## 🤝 Contributing

When modifying Docker setup:
1. Test in development mode first
2. Test in production mode
3. Update documentation
4. Rebuild and verify all scripts work

## 📞 Support

For issues:
1. Check `docs/DOCKER_TROUBLESHOOTING.md`
2. Review logs: `bash scripts/logs.sh`
3. Check Docker status: `docker ps`
4. Open project issue

## 📝 Version Information

- **Docker Compose Version**: 3.8
- **MySQL**: 8.0
- **Node.js**: 18-alpine
- **Nginx**: 1.25-alpine

---

**Last Updated**: 2024
**Maintainer**: QuantumCart Development Team
