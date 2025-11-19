#!/bin/bash

# SonarQube Full Project Analysis Script
# Analyzes both backend and frontend code quality

set -e

echo "=============================================="
echo "SonarQube Full Project Analysis"
echo "QuantumCart E-Commerce Platform"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo -e "${BLUE}Starting comprehensive code analysis...${NC}"
echo ""

# Analyze Backend
echo -e "${YELLOW}==== Step 1/2: Analyzing Backend ====${NC}"
bash "$SCRIPT_DIR/analyze-backend.sh"

echo ""
echo -e "${YELLOW}==== Step 2/2: Analyzing Frontend ====${NC}"
bash "$SCRIPT_DIR/analyze-frontend.sh"

echo ""
echo -e "${GREEN}=============================================="
echo "Full Project Analysis Complete!"
echo "==============================================${NC}"
echo ""
echo -e "${BLUE}View results at:${NC}"
echo -e "  Backend:  ${YELLOW}http://localhost:9000/dashboard?id=quantumcart-backend${NC}"
echo -e "  Frontend: ${YELLOW}http://localhost:9000/dashboard?id=quantumcart-frontend${NC}"
echo ""
echo -e "${BLUE}Quality Metrics Analyzed:${NC}"
echo "  ✓ Code Smells"
echo "  ✓ Bugs"
echo "  ✓ Vulnerabilities"
echo "  ✓ Security Hotspots"
echo "  ✓ Code Coverage"
echo "  ✓ Duplications"
echo "  ✓ Complexity"
echo "  ✓ Technical Debt"
echo ""
