#!/bin/bash

# Start SonarQube Server using Docker Compose
# This script starts a local SonarQube instance for code analysis

set -e

echo "====================================="
echo "Starting SonarQube Server"
echo "====================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/../docker"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed!${NC}"
    echo "Please install Docker from https://www.docker.com/get-started"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed!${NC}"
    echo "Please install Docker Compose"
    exit 1
fi

# Navigate to docker directory
cd "$DOCKER_DIR"

echo -e "${YELLOW}Stopping any existing SonarQube containers...${NC}"
docker-compose down || true

echo ""
echo -e "${YELLOW}Starting SonarQube and PostgreSQL...${NC}"
docker-compose up -d

echo ""
echo -e "${YELLOW}Waiting for SonarQube to be ready...${NC}"
echo "This may take 1-2 minutes on first start..."

# Wait for SonarQube to be ready
MAX_ATTEMPTS=60
ATTEMPT=0
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -s http://localhost:9000/api/system/status | grep -q '"status":"UP"'; then
        echo -e "${GREEN}SonarQube is ready!${NC}"
        break
    fi

    ATTEMPT=$((ATTEMPT + 1))
    echo -n "."
    sleep 2

    if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
        echo ""
        echo -e "${RED}Timeout waiting for SonarQube to start${NC}"
        echo "Check logs with: docker-compose logs sonarqube"
        exit 1
    fi
done

echo ""
echo -e "${GREEN}====================================="
echo "SonarQube Server Started!"
echo "=====================================${NC}"
echo ""
echo -e "${BLUE}Access SonarQube at:${NC} ${YELLOW}http://localhost:9000${NC}"
echo ""
echo -e "${BLUE}Default Credentials:${NC}"
echo "  Username: ${YELLOW}admin${NC}"
echo "  Password: ${YELLOW}admin${NC}"
echo "  ${RED}(You'll be prompted to change this on first login)${NC}"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo "  View logs:        ${YELLOW}docker-compose logs -f sonarqube${NC}"
echo "  Stop SonarQube:   ${YELLOW}docker-compose down${NC}"
echo "  Restart:          ${YELLOW}docker-compose restart${NC}"
echo "  Full cleanup:     ${YELLOW}docker-compose down -v${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Login to SonarQube at http://localhost:9000"
echo "  2. Change default password (admin/admin)"
echo "  3. Generate a token: User > My Account > Security > Generate Tokens"
echo "  4. Export token: ${YELLOW}export SONAR_TOKEN=your_token_here${NC}"
echo "  5. Run analysis: ${YELLOW}bash sonarqube/scripts/analyze-all.sh${NC}"
echo ""
