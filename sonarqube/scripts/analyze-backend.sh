#!/bin/bash

# SonarQube Backend Analysis Script
# Analyzes backend code quality using SonarQube Scanner

set -e

echo "====================================="
echo "SonarQube Backend Analysis"
echo "====================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
SONAR_CONFIG="$PROJECT_ROOT/sonarqube/sonar-project.properties"
SONAR_HOST_URL="${SONAR_HOST_URL:-http://localhost:9000}"
SONAR_TOKEN="${SONAR_TOKEN:-}"

echo -e "${YELLOW}Project Root: $PROJECT_ROOT${NC}"
echo -e "${YELLOW}Backend Directory: $BACKEND_DIR${NC}"
echo -e "${YELLOW}SonarQube URL: $SONAR_HOST_URL${NC}"
echo ""

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}Error: Backend directory not found!${NC}"
    exit 1
fi

# Check if sonar-scanner is installed
if ! command -v sonar-scanner &> /dev/null; then
    echo -e "${RED}Error: sonar-scanner is not installed!${NC}"
    echo "Please install sonar-scanner:"
    echo "  - macOS: brew install sonar-scanner"
    echo "  - Linux: Download from https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/"
    echo "  - Or use Docker: docker run --rm -v \"\$(pwd):/usr/src\" sonarsource/sonar-scanner-cli"
    exit 1
fi

# Navigate to backend directory
cd "$BACKEND_DIR"

# Run backend tests to generate coverage
echo -e "${YELLOW}Running backend tests to generate coverage...${NC}"
npm test -- --coverage --watchAll=false || {
    echo -e "${RED}Warning: Tests failed, but continuing with analysis...${NC}"
}

# Check if coverage report exists
if [ ! -f "$BACKEND_DIR/coverage/lcov.info" ]; then
    echo -e "${YELLOW}Warning: Coverage report not found. Analysis will proceed without coverage data.${NC}"
fi

# Run SonarQube analysis
echo -e "${YELLOW}Running SonarQube analysis...${NC}"

if [ -z "$SONAR_TOKEN" ]; then
    echo -e "${YELLOW}No SONAR_TOKEN provided. Using default credentials (admin/admin)${NC}"
    sonar-scanner \
        -Dsonar.projectBaseDir="$PROJECT_ROOT" \
        -Dsonar.host.url="$SONAR_HOST_URL" \
        -Dsonar.projectKey=quantumcart-backend \
        -Dsonar.projectName="QuantumCart Backend" \
        -Dsonar.sources=backend \
        -Dsonar.tests=backend/tests \
        -Dsonar.javascript.lcov.reportPaths=backend/coverage/lcov.info \
        -Dsonar.exclusions='**/node_modules/**,**/coverage/**,**/tests/**' \
        -Dsonar.test.inclusions='**/tests/**/*.test.js'
else
    echo -e "${YELLOW}Using provided SONAR_TOKEN${NC}"
    sonar-scanner \
        -Dsonar.projectBaseDir="$PROJECT_ROOT" \
        -Dsonar.host.url="$SONAR_HOST_URL" \
        -Dsonar.login="$SONAR_TOKEN" \
        -Dsonar.projectKey=quantumcart-backend \
        -Dsonar.projectName="QuantumCart Backend" \
        -Dsonar.sources=backend \
        -Dsonar.tests=backend/tests \
        -Dsonar.javascript.lcov.reportPaths=backend/coverage/lcov.info \
        -Dsonar.exclusions='**/node_modules/**,**/coverage/**,**/tests/**' \
        -Dsonar.test.inclusions='**/tests/**/*.test.js'
fi

echo ""
echo -e "${GREEN}====================================="
echo "Backend Analysis Complete!"
echo "=====================================${NC}"
echo -e "View results at: ${YELLOW}$SONAR_HOST_URL/dashboard?id=quantumcart-backend${NC}"
echo ""
