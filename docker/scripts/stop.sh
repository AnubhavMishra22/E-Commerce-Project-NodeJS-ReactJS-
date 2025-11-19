#!/bin/bash

# Stop QuantumCart E-Commerce Services
# This script stops all running Docker containers

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}Stopping QuantumCart Services${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"

cd "$DOCKER_DIR"

# Check which environment is running
DEV_RUNNING=$(docker-compose -f docker-compose.dev.yml ps -q 2>/dev/null | wc -l)
PROD_RUNNING=$(docker-compose ps -q 2>/dev/null | wc -l)

if [ "$DEV_RUNNING" -gt 0 ]; then
    echo -e "${YELLOW}Stopping development environment...${NC}"
    docker-compose -f docker-compose.dev.yml down
    echo -e "${GREEN}✓ Development environment stopped${NC}"
fi

if [ "$PROD_RUNNING" -gt 0 ]; then
    echo -e "${YELLOW}Stopping production environment...${NC}"
    docker-compose down
    echo -e "${GREEN}✓ Production environment stopped${NC}"
fi

if [ "$DEV_RUNNING" -eq 0 ] && [ "$PROD_RUNNING" -eq 0 ]; then
    echo -e "${YELLOW}No services are currently running${NC}"
fi

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}All Services Stopped${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "${BLUE}Note:${NC} Data volumes are preserved"
echo -e "To remove volumes as well, use: ${YELLOW}bash scripts/clean.sh${NC}"
echo ""
