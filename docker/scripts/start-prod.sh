#!/bin/bash

# Start QuantumCart E-Commerce in Production Mode
# This script starts all services in production configuration

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}QuantumCart E-Commerce - Production${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"

cd "$DOCKER_DIR"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "Please create .env file from .env.example"
    echo "Command: cp .env.example .env"
    exit 1
fi

# Verify critical environment variables are set
echo -e "${YELLOW}Checking environment configuration...${NC}"
source .env

if [ "$SESSION_SECRET" == "your_secure_session_secret_change_in_production" ]; then
    echo -e "${RED}⚠ Warning: SESSION_SECRET is using default value!${NC}"
    echo "Please update SESSION_SECRET in .env file before deploying to production"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}✓ Environment configuration checked${NC}"
echo ""

echo -e "${YELLOW}Building Docker images...${NC}"
docker-compose build

echo ""
echo -e "${YELLOW}Starting services in production mode...${NC}"
docker-compose up -d

echo ""
echo -e "${YELLOW}Waiting for services to be ready...${NC}"

# Wait for MySQL
echo -n "MySQL: "
for i in {1..30}; do
    if docker-compose exec -T mysql mysqladmin ping -h localhost -u root -p${DB_PASS:-root} &>/dev/null; then
        echo -e "${GREEN}✓ Ready${NC}"
        break
    fi
    echo -n "."
    sleep 2
    if [ $i -eq 30 ]; then
        echo -e "${RED}✗ Timeout${NC}"
        echo "Check logs: docker-compose logs mysql"
    fi
done

# Wait for Backend
echo -n "Backend: "
for i in {1..40}; do
    if curl -s http://localhost:5000/api/products &>/dev/null; then
        echo -e "${GREEN}✓ Ready${NC}"
        break
    fi
    echo -n "."
    sleep 2
    if [ $i -eq 40 ]; then
        echo -e "${RED}✗ Timeout${NC}"
        echo "Check logs: docker-compose logs backend"
    fi
done

# Wait for Frontend
echo -n "Frontend: "
for i in {1..30}; do
    if curl -s http://localhost/health &>/dev/null; then
        echo -e "${GREEN}✓ Ready${NC}"
        break
    fi
    echo -n "."
    sleep 2
    if [ $i -eq 30 ]; then
        echo -e "${RED}✗ Timeout${NC}"
        echo "Check logs: docker-compose logs frontend"
    fi
done

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}Production Environment Ready!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "${BLUE}Access the application:${NC}"
echo -e "  Frontend:  ${YELLOW}http://localhost${NC}"
echo -e "  Backend:   ${YELLOW}http://localhost:5000/api${NC}"
echo -e "  MySQL:     ${YELLOW}localhost:3306${NC}"
echo ""
echo -e "${BLUE}Features:${NC}"
echo -e "  ${GREEN}✓${NC} Optimized production builds"
echo -e "  ${GREEN}✓${NC} Nginx serving React SPA"
echo -e "  ${GREEN}✓${NC} Security headers enabled"
echo -e "  ${GREEN}✓${NC} Gzip compression enabled"
echo -e "  ${GREEN}✓${NC} Health checks active"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo -e "  View logs:       ${YELLOW}bash scripts/logs.sh${NC}"
echo -e "  Stop services:   ${YELLOW}bash scripts/stop.sh${NC}"
echo -e "  Rebuild:         ${YELLOW}bash scripts/rebuild-prod.sh${NC}"
echo -e "  Clean all:       ${YELLOW}bash scripts/clean.sh${NC}"
echo ""
