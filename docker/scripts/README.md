# Docker Management Scripts

Convenient scripts for managing the QuantumCart E-Commerce Docker environment.

## Available Scripts

### Development

**start-dev.sh** - Start development environment
```bash
bash scripts/start-dev.sh
```
- Starts all services with hot-reload
- Creates `.env` if missing
- Waits for all services to be ready
- Shows access URLs and useful commands

**rebuild-dev.sh** - Rebuild development environment
```bash
bash scripts/rebuild-dev.sh
```
- Stops containers
- Rebuilds images from scratch
- Starts services

### Production

**start-prod.sh** - Start production environment
```bash
bash scripts/start-prod.sh
```
- Validates environment configuration
- Warns about default secrets
- Builds optimized images
- Starts production services
- Shows access URLs

**rebuild-prod.sh** - Rebuild production environment
```bash
bash scripts/rebuild-prod.sh
```
- Stops containers
- Rebuilds production images
- Starts services

### General

**stop.sh** - Stop all services
```bash
bash scripts/stop.sh
```
- Automatically detects running environment
- Stops all containers
- Preserves data volumes

**logs.sh** - View service logs
```bash
# View all logs (follow mode)
bash scripts/logs.sh

# View specific service
bash scripts/logs.sh backend

# Follow specific service
bash scripts/logs.sh -f frontend

# Last 100 lines
bash scripts/logs.sh --tail=100
```

**clean.sh** - Complete cleanup
```bash
bash scripts/clean.sh
```
- ⚠️ **WARNING**: Removes everything!
- Stops all containers
- Removes all volumes (including database)
- Removes all images
- Prompts for confirmation

## Quick Start Guide

### First Time Setup

1. **Development Environment**
   ```bash
   cd docker
   bash scripts/start-dev.sh
   ```
   Access at: http://localhost:3000

2. **Production Environment**
   ```bash
   cd docker
   cp .env.example .env
   # Edit .env with your settings
   bash scripts/start-prod.sh
   ```
   Access at: http://localhost

### Daily Development Workflow

```bash
# Start development environment
bash scripts/start-dev.sh

# View logs while developing
bash scripts/logs.sh -f

# Stop when done
bash scripts/stop.sh
```

### When You Need to Rebuild

```bash
# After changing Dockerfile or dependencies
bash scripts/rebuild-dev.sh

# Or for production
bash scripts/rebuild-prod.sh
```

### Clean Slate

```bash
# Remove everything and start fresh
bash scripts/clean.sh
bash scripts/start-dev.sh
```

## Script Features

### Color-Coded Output
- 🔵 Blue: Informational messages
- 🟡 Yellow: Warnings and progress
- 🟢 Green: Success messages
- 🔴 Red: Errors and critical warnings

### Health Checks
- Waits for MySQL to be ready
- Waits for backend API to respond
- Waits for frontend to be accessible
- Provides timeout warnings with troubleshooting hints

### Environment Detection
- Automatically detects dev vs production
- Uses appropriate compose files
- Shows environment-specific information

### Error Handling
- All scripts use `set -e` for safety
- Validates prerequisites
- Provides helpful error messages
- Suggests next steps on failure

## Troubleshooting

### Service Won't Start

```bash
# Check logs
bash scripts/logs.sh [service-name]

# Try rebuilding
bash scripts/rebuild-dev.sh

# Full cleanup and restart
bash scripts/clean.sh
bash scripts/start-dev.sh
```

### Permission Denied

```bash
# Make scripts executable
chmod +x scripts/*.sh
```

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3000  # Frontend
lsof -i :5000  # Backend
lsof -i :3306  # MySQL

# Stop conflicting service or modify port in docker-compose
```

### Database Connection Issues

```bash
# Check MySQL logs
bash scripts/logs.sh mysql

# Restart MySQL
bash scripts/stop.sh
bash scripts/start-dev.sh
```

## Environment Variables

Scripts respect these environment variables from `.env`:

- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` - Database configuration
- `SESSION_SECRET` - Backend session secret
- `REACT_APP_API_URL` - Frontend API endpoint
- `NODE_ENV` - Node.js environment

## Best Practices

1. **Always use scripts** instead of raw docker-compose commands
2. **Review .env** before starting production
3. **Use development mode** for local development
4. **View logs** when troubleshooting
5. **Clean periodically** to free disk space

## Script Locations

All scripts are in `docker/scripts/`:
- Development: `start-dev.sh`, `rebuild-dev.sh`
- Production: `start-prod.sh`, `rebuild-prod.sh`
- Utilities: `stop.sh`, `logs.sh`, `clean.sh`

## Need Help?

Check the main documentation:
- `docker/docs/DOCKER_SETUP.md` - Complete setup guide
- `docker/docs/DOCKER_TROUBLESHOOTING.md` - Troubleshooting guide
- `docker/README.md` - Docker overview
