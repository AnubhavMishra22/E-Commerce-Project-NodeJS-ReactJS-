#!/bin/bash

# Start QuantumCart E-Commerce in Development Mode
# This script starts all services with hot-reload enabled

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}QuantumCart E-Commerce - Development${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"

cd "$DOCKER_DIR"

# Check if .env exists, if not copy from .env.example
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠ Please review and update .env with your settings${NC}"
    echo ""
fi

echo -e "${YELLOW}Starting services in development mode...${NC}"
docker-compose -f docker-compose.dev.yml up -d

echo ""
echo -e "${YELLOW}Waiting for services to be ready...${NC}"

# Wait for MySQL
echo -n "MySQL: "
for i in {1..30}; do
    if docker-compose -f docker-compose.dev.yml exec -T mysql mysqladmin ping -h localhost -u root -proot &>/dev/null; then
        echo -e "${GREEN}✓ Ready${NC}"
        break
    fi
    echo -n "."
    sleep 2
    if [ $i -eq 30 ]; then
        echo -e "${RED}✗ Timeout${NC}"
        echo "Check logs: docker-compose -f docker-compose.dev.yml logs mysql"
    fi
done

# Wait for Backend
echo -n "Backend: "
for i in {1..30}; do
    if curl -s http://localhost:5000/api/products &>/dev/null; then
        echo -e "${GREEN}✓ Ready${NC}"
        break
    fi
    echo -n "."
    sleep 2
    if [ $i -eq 30 ]; then
        echo -e "${RED}✗ Timeout${NC}"
        echo "Check logs: docker-compose -f docker-compose.dev.yml logs backend"
    fi
done

# Wait for Frontend
echo -n "Frontend: "
for i in {1..30}; do
    if curl -s http://localhost:3000 &>/dev/null; then
        echo -e "${GREEN}✓ Ready${NC}"
        break
    fi
    echo -n "."
    sleep 2
    if [ $i -eq 30 ]; then
        echo -e "${RED}✗ Timeout${NC}"
        echo "Check logs: docker-compose -f docker-compose.dev.yml logs frontend"
    fi
done

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}Development Environment Ready!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "${BLUE}Access the application:${NC}"
echo -e "  Frontend:  ${YELLOW}http://localhost:3000${NC}"
echo -e "  Backend:   ${YELLOW}http://localhost:5000/api${NC}"
echo -e "  MySQL:     ${YELLOW}localhost:3306${NC}"
echo ""
echo -e "${BLUE}Features:${NC}"
echo -e "  ${GREEN}✓${NC} Hot reload enabled for backend and frontend"
echo -e "  ${GREEN}✓${NC} Source code mounted as volumes"
echo -e "  ${GREEN}✓${NC} Node.js debugging port: 9229"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo -e "  View logs:       ${YELLOW}bash scripts/logs.sh${NC}"
echo -e "  Stop services:   ${YELLOW}bash scripts/stop.sh${NC}"
echo -e "  Rebuild:         ${YELLOW}bash scripts/rebuild-dev.sh${NC}"
echo -e "  Clean all:       ${YELLOW}bash scripts/clean.sh${NC}"
echo ""
