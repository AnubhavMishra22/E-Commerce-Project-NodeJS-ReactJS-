#!/bin/bash

# Clean QuantumCart Docker Environment
# This script removes all containers, volumes, and images

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${RED}=====================================${NC}"
echo -e "${RED}Clean Docker Environment${NC}"
echo -e "${RED}=====================================${NC}"
echo ""
echo -e "${YELLOW}⚠ WARNING: This will remove:${NC}"
echo "  - All containers"
echo "  - All volumes (including database data)"
echo "  - All images"
echo ""
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"

cd "$DOCKER_DIR"

echo ""
echo -e "${YELLOW}Stopping and removing development environment...${NC}"
docker-compose -f docker-compose.dev.yml down -v --remove-orphans 2>/dev/null || true

echo -e "${YELLOW}Stopping and removing production environment...${NC}"
docker-compose down -v --remove-orphans 2>/dev/null || true

echo ""
echo -e "${YELLOW}Removing QuantumCart Docker images...${NC}"
docker images | grep -E "ecommerce|quantumcart" | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true

echo ""
echo -e "${YELLOW}Pruning unused Docker resources...${NC}"
docker system prune -f

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}Cleanup Complete!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "${BLUE}All containers, volumes, and images removed${NC}"
echo -e "To start fresh, run: ${YELLOW}bash scripts/start-dev.sh${NC}"
echo ""
