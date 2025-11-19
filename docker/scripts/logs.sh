#!/bin/bash

# View Logs for QuantumCart Services
# Usage: bash logs.sh [service] [options]
# Examples:
#   bash logs.sh              # All services
#   bash logs.sh backend      # Backend only
#   bash logs.sh -f           # Follow mode

set -e

# Colors for output
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"

cd "$DOCKER_DIR"

# Check which environment is running
DEV_RUNNING=$(docker-compose -f docker-compose.dev.yml ps -q 2>/dev/null | wc -l)
PROD_RUNNING=$(docker-compose ps -q 2>/dev/null | wc -l)

COMPOSE_FILE=""
ENV_NAME=""

if [ "$DEV_RUNNING" -gt 0 ]; then
    COMPOSE_FILE="docker-compose.dev.yml"
    ENV_NAME="Development"
elif [ "$PROD_RUNNING" -gt 0 ]; then
    COMPOSE_FILE="docker-compose.yml"
    ENV_NAME="Production"
else
    echo -e "${YELLOW}No services are currently running${NC}"
    exit 1
fi

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}Logs - $ENV_NAME Environment${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Pass all arguments to docker-compose logs
if [ -z "$1" ]; then
    # No arguments, show all logs with follow
    docker-compose -f "$COMPOSE_FILE" logs -f
else
    # Pass arguments to docker-compose logs
    docker-compose -f "$COMPOSE_FILE" logs "$@"
fi
