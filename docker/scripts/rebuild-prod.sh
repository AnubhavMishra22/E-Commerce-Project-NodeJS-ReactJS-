#!/bin/bash

# Rebuild and Restart Production Environment
# This script rebuilds Docker images and restarts services

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}Rebuild Production Environment${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"

cd "$DOCKER_DIR"

echo -e "${YELLOW}Stopping existing containers...${NC}"
docker-compose down

echo ""
echo -e "${YELLOW}Rebuilding Docker images...${NC}"
docker-compose build --no-cache

echo ""
echo -e "${YELLOW}Starting services...${NC}"
docker-compose up -d

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}Rebuild Complete!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "${BLUE}Services are starting...${NC}"
echo "Run ${YELLOW}bash scripts/logs.sh${NC} to view logs"
echo ""
