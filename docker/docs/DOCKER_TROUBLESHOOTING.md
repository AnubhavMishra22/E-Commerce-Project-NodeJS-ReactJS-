# Docker Troubleshooting Guide

Common issues and solutions when running QuantumCart E-Commerce with Docker.

## 📋 Table of Contents

1. [Docker Installation Issues](#docker-installation-issues)
2. [Container Startup Problems](#container-startup-problems)
3. [Database Connection Issues](#database-connection-issues)
4. [Frontend Not Loading](#frontend-not-loading)
5. [Backend API Errors](#backend-api-errors)
6. [Performance Issues](#performance-issues)
7. [Build Failures](#build-failures)
8. [Port Conflicts](#port-conflicts)
9. [Volume and Data Issues](#volume-and-data-issues)
10. [Network Problems](#network-problems)

---

## Docker Installation Issues

### Issue: Docker command not found

**Symptoms:**
```bash
bash: docker: command not found
```

**Solution:**
1. Install Docker Desktop (macOS/Windows) or Docker Engine (Linux)
2. Verify installation:
   ```bash
   docker --version
   docker-compose --version
   ```
3. Restart terminal after installation

### Issue: Permission denied (Linux)

**Symptoms:**
```bash
docker: Got permission denied while trying to connect to the Docker daemon socket
```

**Solution:**
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in, then verify
docker ps
```

### Issue: Docker Desktop won't start (macOS/Windows)

**Solutions:**
1. **Check system requirements**: Ensure virtualization is enabled in BIOS
2. **Reset Docker Desktop**:
   - macOS: Docker Desktop → Troubleshoot → Reset to factory defaults
   - Windows: Docker Desktop → Settings → Troubleshoot → Reset to factory defaults
3. **Increase resources**: Settings → Resources → Increase memory/CPU

---

## Container Startup Problems

### Issue: Services won't start

**Symptoms:**
```bash
bash scripts/start-dev.sh
# Containers exit immediately
```

**Diagnosis:**
```bash
# Check container status
docker ps -a

# View logs
bash scripts/logs.sh

# Check specific service
docker logs ecommerce-backend-dev
```

**Common Solutions:**

1. **MySQL initialization failing:**
   ```bash
   bash scripts/logs.sh mysql
   # If you see "Cannot allocate memory"
   # Increase Docker memory in Docker Desktop → Settings → Resources
   ```

2. **Backend crashing:**
   ```bash
   bash scripts/logs.sh backend
   # Check for:
   # - Missing dependencies: Run rebuild
   # - Environment variable errors: Check .env
   # - Database connection errors: See database section below
   ```

3. **Frontend not building:**
   ```bash
   bash scripts/logs.sh frontend
   # Common issues:
   # - Out of memory: Increase Docker memory
   # - npm install failed: Clear node_modules and rebuild
   ```

**Complete Rebuild:**
```bash
bash scripts/stop.sh
bash scripts/clean.sh
bash scripts/start-dev.sh
```

### Issue: Services timeout waiting to be ready

**Symptoms:**
```
Waiting for services to be ready...
Backend: ....................✗ Timeout
```

**Solutions:**

1. **Check logs for errors:**
   ```bash
   bash scripts/logs.sh backend
   ```

2. **Manually test service:**
   ```bash
   # Check if container is running
   docker ps | grep backend

   # If running, test directly
   curl http://localhost:5000/api/products
   ```

3. **Increase timeout in start script** (if needed):
   ```bash
   # Edit scripts/start-dev.sh
   # Change: for i in {1..30}
   # To: for i in {1..60}
   ```

---

## Database Connection Issues

### Issue: Backend can't connect to MySQL

**Symptoms:**
```
Error: connect ECONNREFUSED mysql:3306
SequelizeConnectionError: connect ECONNREFUSED
```

**Solutions:**

1. **Verify MySQL is running:**
   ```bash
   docker ps | grep mysql
   ```

2. **Check MySQL logs:**
   ```bash
   bash scripts/logs.sh mysql
   ```

3. **Test MySQL connectivity:**
   ```bash
   docker exec -it ecommerce-mysql-dev mysql -u root -proot -e "SHOW DATABASES;"
   ```

4. **Verify environment variables:**
   ```bash
   docker exec ecommerce-backend-dev env | grep DB_
   # Should show:
   # DB_HOST=mysql
   # DB_USER=ecommerce_user
   # DB_PASS=root
   # DB_NAME=ecommerce_db
   ```

5. **Restart with clean database:**
   ```bash
   bash scripts/stop.sh
   docker volume rm mysql_data_dev
   bash scripts/start-dev.sh
   ```

### Issue: Access denied for user

**Symptoms:**
```
SequelizeAccessDeniedError: Access denied for user 'ecommerce_user'@'%'
```

**Solutions:**

1. **Check .env credentials:**
   ```bash
   cat docker/.env | grep DB_
   ```

2. **Reset database with correct credentials:**
   ```bash
   bash scripts/clean.sh
   # Edit .env with correct credentials
   bash scripts/start-dev.sh
   ```

3. **Manually grant privileges:**
   ```bash
   docker exec -it ecommerce-mysql-dev mysql -u root -proot
   ```
   ```sql
   GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'%';
   FLUSH PRIVILEGES;
   EXIT;
   ```

---

## Frontend Not Loading

### Issue: Cannot access http://localhost:3000

**Diagnosis:**
```bash
# Check if frontend container is running
docker ps | grep frontend

# Check frontend logs
bash scripts/logs.sh frontend

# Test frontend health
curl http://localhost:3000
```

**Solutions:**

1. **Container not running:**
   ```bash
   bash scripts/logs.sh frontend
   # Look for build errors or crashes
   # If needed:
   bash scripts/rebuild-dev.sh
   ```

2. **Port conflict:**
   ```bash
   # Check what's using port 3000
   lsof -i :3000
   # or
   netstat -an | grep 3000

   # Kill conflicting process or change port in docker-compose.dev.yml
   ```

3. **React app compilation errors:**
   ```bash
   bash scripts/logs.sh frontend
   # Fix any ESLint or compilation errors in frontend code
   ```

### Issue: Frontend shows blank page

**Solutions:**

1. **Check browser console** (F12) for errors

2. **Verify API connection:**
   ```javascript
   // Browser console
   fetch('http://localhost:5000/api/products')
     .then(r => r.json())
     .then(console.log)
   ```

3. **Check environment variable:**
   ```bash
   docker exec ecommerce-frontend-dev env | grep REACT_APP_API_URL
   # Should show: REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Clear browser cache:**
   - Chrome: Ctrl/Cmd + Shift + Delete
   - Or use incognito mode

---

## Backend API Errors

### Issue: 404 on API endpoints

**Test:**
```bash
curl http://localhost:5000/api/products
# Should return JSON, not 404
```

**Solutions:**

1. **Check backend logs:**
   ```bash
   bash scripts/logs.sh backend
   ```

2. **Verify routes are loaded:**
   ```bash
   # Backend logs should show:
   # "Server is running on port 5000"
   ```

3. **Test basic endpoint:**
   ```bash
   curl http://localhost:5000/api/products
   ```

### Issue: 500 Internal Server Error

**Diagnosis:**
```bash
bash scripts/logs.sh backend
# Look for stack traces
```

**Common Causes:**

1. **Database not ready:**
   - Wait 30 seconds and retry
   - Check MySQL logs: `bash scripts/logs.sh mysql`

2. **Sequelize sync failed:**
   ```bash
   # Logs show: "Unable to connect to database"
   # Solution: Restart services
   bash scripts/stop.sh
   bash scripts/start-dev.sh
   ```

3. **Missing environment variables:**
   ```bash
   docker exec ecommerce-backend-dev env
   # Verify all required vars are set
   ```

---

## Performance Issues

### Issue: Slow container startup

**Solutions:**

1. **Increase Docker resources:**
   - Docker Desktop → Settings → Resources
   - RAM: At least 4GB (8GB recommended)
   - CPUs: At least 2 cores (4 recommended)

2. **Optimize Docker Desktop:**
   - macOS: Disable "Use gRPC FUSE for file sharing" if slow
   - Windows: Use WSL2 backend

3. **Check disk space:**
   ```bash
   docker system df
   # If low, clean up:
   docker system prune -a
   ```

### Issue: Hot reload is slow

**Development Mode:**

1. **Check file watching:**
   ```bash
   # Backend: nodemon should detect changes
   # Frontend: React dev server should rebuild
   ```

2. **Reduce volume mount overhead** (macOS):
   - Use :delegated flag in docker-compose.dev.yml:
     ```yaml
     volumes:
       - ../frontend:/app:delegated
     ```

3. **Exclude node_modules from sync:**
   ```yaml
   volumes:
     - ../frontend:/app
     - /app/node_modules  # Don't sync node_modules
   ```

---

## Build Failures

### Issue: Docker build fails

**Symptoms:**
```
ERROR [internal] load build definition
```

**Solutions:**

1. **Check Docker daemon is running:**
   ```bash
   docker info
   ```

2. **Clear build cache:**
   ```bash
   docker builder prune -a
   ```

3. **Rebuild without cache:**
   ```bash
   bash scripts/rebuild-dev.sh
   ```

### Issue: npm install fails in Docker build

**Symptoms:**
```
npm ERR! code ENOTFOUND
npm ERR! network request failed
```

**Solutions:**

1. **Check internet connectivity**

2. **Use different npm registry:**
   ```dockerfile
   # In Dockerfile
   RUN npm config set registry https://registry.npmjs.org/
   RUN npm install
   ```

3. **Clear npm cache:**
   ```bash
   docker-compose -f docker-compose.dev.yml build --no-cache
   ```

---

## Port Conflicts

### Issue: Port already in use

**Symptoms:**
```
Error starting userland proxy: listen tcp 0.0.0.0:3000: bind: address already in use
```

**Find what's using the port:**
```bash
# macOS/Linux
lsof -i :3000
lsof -i :5000
lsof -i :3306

# Windows
netstat -ano | findstr :3000
```

**Solutions:**

1. **Kill conflicting process:**
   ```bash
   # macOS/Linux
   kill -9 <PID>

   # Windows
   taskkill /PID <PID> /F
   ```

2. **Change Docker port mapping:**
   ```yaml
   # In docker-compose.dev.yml
   services:
     frontend:
       ports:
         - "3001:3000"  # Change external port to 3001
   ```

---

## Volume and Data Issues

### Issue: Database data lost after restart

**Cause:** Volume was removed

**Prevention:**
```bash
# Use stop (preserves volumes)
bash scripts/stop.sh

# Don't use clean unless you want to delete data
# bash scripts/clean.sh  # This removes volumes!
```

**Recovery:**
```bash
# If you have a backup:
bash scripts/start-dev.sh
docker exec -i ecommerce-mysql-dev mysql -u root -proot ecommerce_db < backup.sql
```

### Issue: Permission denied on mounted volumes (Linux)

**Solution:**
```bash
# Fix ownership
sudo chown -R $USER:$USER backend frontend

# Or run containers with your UID
docker-compose -f docker-compose.dev.yml run --user $(id -u):$(id -g) backend bash
```

---

## Network Problems

### Issue: Services can't communicate

**Diagnosis:**
```bash
# Check network
docker network ls | grep ecommerce

# Inspect network
docker network inspect ecommerce-network-dev
```

**Solutions:**

1. **Verify services are on same network:**
   ```bash
   docker inspect ecommerce-backend-dev | grep NetworkMode
   docker inspect ecommerce-mysql-dev | grep NetworkMode
   ```

2. **Recreate network:**
   ```bash
   bash scripts/stop.sh
   docker network prune
   bash scripts/start-dev.sh
   ```

---

## General Debugging Techniques

### Get container information

```bash
# Container processes
docker top ecommerce-backend-dev

# Container details
docker inspect ecommerce-backend-dev

# Container stats
docker stats ecommerce-backend-dev

# Container filesystem
docker exec ecommerce-backend-dev ls -la /app
```

### Execute commands in containers

```bash
# Backend shell
docker exec -it ecommerce-backend-dev bash
cd /app
ls -la
npm list
env | grep DB_
exit

# Test from inside container
docker exec ecommerce-backend-dev curl http://mysql:3306
docker exec ecommerce-frontend-dev wget -qO- http://backend:5000/api/products
```

### Check container health

```bash
# Health status
docker inspect --format='{{json .State.Health}}' ecommerce-backend-dev | jq

# Health check logs
docker inspect ecommerce-backend-dev | grep -A 10 Health
```

---

## When All Else Fails

### Nuclear Option: Complete Reset

```bash
# 1. Stop everything
bash scripts/stop.sh

# 2. Remove all project containers, volumes, and images
bash scripts/clean.sh

# 3. Remove any orphaned volumes
docker volume prune

# 4. Remove unused networks
docker network prune

# 5. Optional: Full Docker cleanup
docker system prune -a --volumes

# 6. Start fresh
bash scripts/start-dev.sh
```

### Get Help

1. **Check logs thoroughly:**
   ```bash
   bash scripts/logs.sh > full-logs.txt
   ```

2. **System information:**
   ```bash
   docker version
   docker-compose version
   docker info
   uname -a
   ```

3. **Report issue with:**
   - Full logs output
   - Docker version
   - Operating system
   - Steps to reproduce

---

## Preventive Maintenance

### Regular Cleanup

```bash
# Weekly: Remove unused images
docker image prune

# Monthly: Clean build cache
docker builder prune

# When low on space: Full cleanup
docker system df  # Check usage first
docker system prune -a
```

### Monitoring

```bash
# Watch resource usage
docker stats

# Check disk usage
docker system df

# Monitor specific container
watch -n 1 docker stats ecommerce-backend-dev
```

---

## Additional Resources

- **Docker Documentation**: https://docs.docker.com/
- **Docker Compose Troubleshooting**: https://docs.docker.com/compose/faq/
- **Stack Overflow**: Tag questions with `docker`, `docker-compose`, `nodejs`, `react`

---

**Still having issues?** Check the main setup guide in `DOCKER_SETUP.md` or open an issue in the repository.
