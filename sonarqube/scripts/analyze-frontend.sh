#!/bin/bash

# SonarQube Frontend Analysis Script
# Analyzes frontend React code quality using SonarQube Scanner

set -e

echo "====================================="
echo "SonarQube Frontend Analysis"
echo "====================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
SONAR_CONFIG="$PROJECT_ROOT/sonarqube/sonar-project.properties"
SONAR_HOST_URL="${SONAR_HOST_URL:-http://localhost:9000}"
SONAR_TOKEN="${SONAR_TOKEN:-}"

echo -e "${YELLOW}Project Root: $PROJECT_ROOT${NC}"
echo -e "${YELLOW}Frontend Directory: $FRONTEND_DIR${NC}"
echo -e "${YELLOW}SonarQube URL: $SONAR_HOST_URL${NC}"
echo ""

# Check if frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}Error: Frontend directory not found!${NC}"
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

# Navigate to frontend directory
cd "$FRONTEND_DIR"

# Run frontend tests to generate coverage
echo -e "${YELLOW}Running frontend tests to generate coverage...${NC}"
CI=true npm test -- --coverage --watchAll=false || {
    echo -e "${RED}Warning: Tests failed, but continuing with analysis...${NC}"
}

# Check if coverage report exists
if [ ! -f "$FRONTEND_DIR/coverage/lcov.info" ]; then
    echo -e "${YELLOW}Warning: Coverage report not found. Analysis will proceed without coverage data.${NC}"
fi

# Run SonarQube analysis
echo -e "${YELLOW}Running SonarQube analysis...${NC}"

if [ -z "$SONAR_TOKEN" ]; then
    echo -e "${YELLOW}No SONAR_TOKEN provided. Using default credentials (admin/admin)${NC}"
    sonar-scanner \
        -Dsonar.projectBaseDir="$PROJECT_ROOT" \
        -Dsonar.host.url="$SONAR_HOST_URL" \
        -Dsonar.projectKey=quantumcart-frontend \
        -Dsonar.projectName="QuantumCart Frontend (React)" \
        -Dsonar.sources=frontend/src \
        -Dsonar.tests=frontend/src/__tests__ \
        -Dsonar.javascript.lcov.reportPaths=frontend/coverage/lcov.info \
        -Dsonar.exclusions='**/node_modules/**,**/build/**,**/coverage/**,**/__tests__/**,**/__mocks__/**,**/public/**' \
        -Dsonar.test.inclusions='**/__tests__/**/*.test.js'
else
    echo -e "${YELLOW}Using provided SONAR_TOKEN${NC}"
    sonar-scanner \
        -Dsonar.projectBaseDir="$PROJECT_ROOT" \
        -Dsonar.host.url="$SONAR_HOST_URL" \
        -Dsonar.login="$SONAR_TOKEN" \
        -Dsonar.projectKey=quantumcart-frontend \
        -Dsonar.projectName="QuantumCart Frontend (React)" \
        -Dsonar.sources=frontend/src \
        -Dsonar.tests=frontend/src/__tests__ \
        -Dsonar.javascript.lcov.reportPaths=frontend/coverage/lcov.info \
        -Dsonar.exclusions='**/node_modules/**,**/build/**,**/coverage/**,**/__tests__/**,**/__mocks__/**,**/public/**' \
        -Dsonar.test.inclusions='**/__tests__/**/*.test.js'
fi

echo ""
echo -e "${GREEN}====================================="
echo "Frontend Analysis Complete!"
echo "=====================================${NC}"
echo -e "View results at: ${YELLOW}$SONAR_HOST_URL/dashboard?id=quantumcart-frontend${NC}"
echo ""
