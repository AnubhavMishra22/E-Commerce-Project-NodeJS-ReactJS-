# Docker Setup Guide - QuantumCart E-Commerce

Complete step-by-step guide for setting up and running the QuantumCart E-Commerce Platform using Docker.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Development Setup](#development-setup)
4. [Production Setup](#production-setup)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [Maintenance](#maintenance)
8. [Advanced Usage](#advanced-usage)

## Prerequisites

### Required Software

1. **Docker Desktop** (Recommended) or **Docker Engine**
   - **macOS**: [Download Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
   - **Windows**: [Download Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
   - **Linux**: Install Docker Engine and Docker Compose

   ```bash
   # Verify installation
   docker --version
   # Should show: Docker version 20.10+ or higher

   docker-compose --version
   # Should show: Docker Compose version 2.0+ or higher
   ```

2. **System Requirements**
   - **Development**:
     - 2+ CPU cores
     - 4+ GB RAM
     - 10+ GB free disk space

   - **Production**:
     - 4+ CPU cores
     - 8+ GB RAM
     - 20+ GB free disk space

### Docker Desktop Configuration

If using Docker Desktop, ensure adequate resources:

1. Open Docker Desktop
2. Go to **Settings/Preferences** → **Resources**
3. Set minimum allocations:
   - **CPUs**: 2 (4 recommended)
   - **Memory**: 4 GB (8 GB recommended)
   - **Disk**: 20 GB minimum

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AnubhavMishra22/E-Commerce-Project-NodeJS-ReactJS-.git
cd E-Commerce-Project-NodeJS-ReactJS-/docker
```

### 2. Verify Docker Installation

```bash
docker info
docker-compose version
```

If these commands fail, Docker is not properly installed or running.

## Development Setup

Perfect for local development with hot-reload.

### Step 1: Environment Configuration

The development environment creates a default `.env` automatically, but you can customize it:

```bash
# Optional: Create custom .env
cp .env.example .env
nano .env  # or use your preferred editor
```

**Typical Development Configuration** (.env):
```env
DB_HOST=mysql
DB_USER=ecommerce_user
DB_PASS=root
DB_NAME=ecommerce_db
SESSION_SECRET=dev_session_secret
NODE_ENV=development
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 2: Start Development Environment

```bash
bash scripts/start-dev.sh
```

This script will:
1. Create `.env` if missing
2. Start MySQL, Backend, and Frontend containers
3. Wait for all services to be ready
4. Show access URLs

**Expected Output:**
```
=====================================
QuantumCart E-Commerce - Development
=====================================

Starting services in development mode...
Waiting for services to be ready...
MySQL: ✓ Ready
Backend: ✓ Ready
Frontend: ✓ Ready

=====================================
Development Environment Ready!
=====================================

Access the application:
  Frontend:  http://localhost:3000
  Backend:   http://localhost:5000/api
  MySQL:     localhost:3306
```

### Step 3: Verify Services

**Check All Services:**
```bash
docker ps
```

You should see 3 containers running:
- `ecommerce-mysql-dev`
- `ecommerce-backend-dev`
- `ecommerce-frontend-dev`

**Test Frontend:**
```bash
curl http://localhost:3000
# Should return HTML
```

**Test Backend API:**
```bash
curl http://localhost:5000/api/products
# Should return JSON array of products
```

**Test MySQL:**
```bash
docker exec -it ecommerce-mysql-dev mysql -u root -proot -e "SHOW DATABASES;"
# Should list databases including ecommerce_db
```

### Step 4: Development Workflow

**Making Code Changes:**
- Backend: Edit files in `backend/`, nodemon auto-restarts
- Frontend: Edit files in `frontend/src/`, React dev server auto-reloads

**Viewing Logs:**
```bash
# All services
bash scripts/logs.sh

# Specific service
bash scripts/logs.sh backend

# Follow mode
bash scripts/logs.sh -f frontend
```

**Stopping Services:**
```bash
bash scripts/stop.sh
```

## Production Setup

Optimized for production deployment with security and performance features.

### Step 1: Environment Configuration

**Required** for production:

```bash
cp .env.example .env
nano .env
```

**Production Configuration** (.env):
```env
# Database Configuration
DB_HOST=mysql
DB_USER=ecommerce_user
DB_PASS=CHANGE_THIS_TO_SECURE_PASSWORD
DB_NAME=ecommerce_db

# Backend Configuration
SESSION_SECRET=CHANGE_THIS_TO_RANDOM_SECRET_AT_LEAST_32_CHARS
NODE_ENV=production

# Frontend Configuration
REACT_APP_API_URL=http://your-domain.com/api  # Or http://localhost:5000/api for local
```

**⚠️ CRITICAL Security Notes:**
1. **Never use default passwords in production**
2. **Generate strong SESSION_SECRET**:
   ```bash
   # Generate random secret
   openssl rand -base64 32
   ```
3. **Use strong database password**
4. **Update REACT_APP_API_URL** to your actual domain

### Step 2: Build and Start

```bash
bash scripts/start-prod.sh
```

This script will:
1. Validate `.env` exists
2. Warn about default secrets
3. Build optimized Docker images
4. Start all services
5. Wait for health checks

**Expected Build Time**: 5-10 minutes (first time)

### Step 3: Verify Production Deployment

**Check Services:**
```bash
docker ps
```

Should show:
- `ecommerce-mysql-prod`
- `ecommerce-backend-prod`
- `ecommerce-frontend-prod`

**Test Application:**
- Frontend: http://localhost
- Backend: http://localhost:5000/api/products

**Check Health:**
```bash
# Frontend health check
curl http://localhost/health
# Should return: healthy

# Backend health check
docker inspect ecommerce-backend-prod | grep -A 5 Health
# Should show: healthy
```

## Configuration

### Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | MySQL hostname | `mysql` | Yes |
| `DB_USER` | MySQL username | `ecommerce_user` | Yes |
| `DB_PASS` | MySQL password | `root` | Yes |
| `DB_NAME` | Database name | `ecommerce_db` | Yes |
| `SESSION_SECRET` | Express session secret | - | **Yes (Prod)** |
| `NODE_ENV` | Node environment | `development` | Yes |
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api` | Yes |

### Port Configuration

Default ports can be changed in `docker-compose.yml` or `docker-compose.dev.yml`:

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Change 8080 to your preferred port
```

### Volume Configuration

Data is persisted in Docker volumes:

```bash
# List volumes
docker volume ls | grep ecommerce

# Inspect volume
docker volume inspect mysql_data

# Backup volume
docker run --rm -v mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/mysql-backup.tar.gz /data
```

## Running the Application

### Development Mode

```bash
# Start
bash scripts/start-dev.sh

# Access application
open http://localhost:3000  # macOS
# or visit http://localhost:3000 in browser

# View logs
bash scripts/logs.sh -f

# Stop
bash scripts/stop.sh
```

### Production Mode

```bash
# Configure
cp .env.example .env
nano .env

# Start
bash scripts/start-prod.sh

# Access application
open http://localhost  # macOS
# or visit http://localhost in browser

# Monitor
bash scripts/logs.sh -f

# Stop
bash scripts/stop.sh
```

## Maintenance

### Viewing Logs

```bash
# All services (follow mode)
bash scripts/logs.sh

# Specific service
bash scripts/logs.sh backend

# Last 100 lines
bash scripts/logs.sh --tail=100

# Follow specific service
bash scripts/logs.sh -f mysql
```

### Rebuilding Images

When you modify Dockerfiles or dependencies:

```bash
# Development
bash scripts/rebuild-dev.sh

# Production
bash scripts/rebuild-prod.sh
```

### Updating Dependencies

**Backend:**
```bash
# Access backend container
docker exec -it ecommerce-backend-dev bash

# Update dependencies
npm install new-package
npm update

# Exit
exit

# Rebuild
bash scripts/rebuild-dev.sh
```

**Frontend:**
```bash
# Access frontend container
docker exec -it ecommerce-frontend-dev sh

# Update dependencies
npm install new-package
npm update

# Exit
exit

# Rebuild
bash scripts/rebuild-dev.sh
```

### Database Management

**Access MySQL CLI:**
```bash
# Development
docker exec -it ecommerce-mysql-dev mysql -u root -proot

# Production
docker exec -it ecommerce-mysql-prod mysql -u root -p${DB_PASS}
```

**Backup Database:**
```bash
# Development
docker exec ecommerce-mysql-dev mysqldump -u root -proot ecommerce_db > backup.sql

# Production
docker exec ecommerce-mysql-prod mysqldump -u root -p${DB_PASS} ecommerce_db > backup.sql
```

**Restore Database:**
```bash
# Development
docker exec -i ecommerce-mysql-dev mysql -u root -proot ecommerce_db < backup.sql

# Production
docker exec -i ecommerce-mysql-prod mysql -u root -p${DB_PASS} ecommerce_db < backup.sql
```

### Cleaning Up

**Remove Everything:**
```bash
bash scripts/clean.sh
```

This removes:
- All containers
- All volumes (⚠️ **including database data**)
- All images

**Selective Cleanup:**
```bash
# Stop services but keep volumes
bash scripts/stop.sh

# Remove unused images
docker image prune

# Remove unused volumes (⚠️ careful!)
docker volume prune
```

## Advanced Usage

### Custom Network Configuration

```bash
# Create custom network
docker network create ecommerce-custom

# Update docker-compose.yml to use it
networks:
  default:
    external:
      name: ecommerce-custom
```

### Debugging

**Node.js Debugging (Development):**
```bash
# Port 9229 is exposed in dev mode
# Use VS Code or Chrome DevTools

# VS Code launch.json:
{
  "type": "node",
  "request": "attach",
  "name": "Docker: Attach to Node",
  "address": "localhost",
  "port": 9229,
  "restart": true
}
```

**Container Shell Access:**
```bash
# Backend
docker exec -it ecommerce-backend-dev bash

# Frontend
docker exec -it ecommerce-frontend-dev sh

# MySQL
docker exec -it ecommerce-mysql-dev bash
```

### Performance Monitoring

```bash
# Container stats
docker stats

# Specific container
docker stats ecommerce-backend-dev

# Logs with timestamps
bash scripts/logs.sh -t
```

### Multi-Container Commands

```bash
# Restart single service
docker-compose -f docker-compose.dev.yml restart backend

# View service health
docker inspect ecommerce-backend-dev --format='{{json .State.Health}}'

# Execute command in service
docker-compose -f docker-compose.dev.yml exec backend npm test
```

## Next Steps

- **API Testing**: Use Postman or curl to test endpoints
- **Frontend Development**: Access http://localhost:3000 and start coding
- **Database Management**: Use MySQL Workbench to connect to localhost:3306
- **Monitoring**: Set up logging and monitoring tools
- **CI/CD**: Integrate Docker builds into your pipeline

## Resources

- **Docker Documentation**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **Node.js Best Practices**: https://github.com/goldbergyoni/nodebestpractices
- **React Best Practices**: https://react.dev/learn

---

**Need Help?** Check `DOCKER_TROUBLESHOOTING.md` or open an issue.
