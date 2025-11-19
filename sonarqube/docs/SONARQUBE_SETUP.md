# SonarQube Static Code Analysis Setup

Comprehensive guide for setting up and using SonarQube static code analysis for the QuantumCart E-Commerce Platform.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Detailed Setup](#detailed-setup)
5. [Running Analysis](#running-analysis)
6. [Quality Profiles](#quality-profiles)
7. [Understanding Results](#understanding-results)
8. [CI/CD Integration](#cicd-integration)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

## Overview

This project uses SonarQube for comprehensive static code analysis to maintain code quality, security, and maintainability.

### What SonarQube Analyzes

- **Code Smells**: Maintainability issues
- **Bugs**: Reliability issues
- **Vulnerabilities**: Security issues
- **Security Hotspots**: Security-sensitive code
- **Code Coverage**: Test coverage metrics
- **Duplications**: Code duplication
- **Complexity**: Cognitive and cyclomatic complexity
- **Technical Debt**: Time to fix all issues

## Prerequisites

### Required Tools

1. **Docker & Docker Compose** (for running SonarQube locally)
   ```bash
   # Verify installation
   docker --version
   docker-compose --version
   ```

2. **SonarQube Scanner** (for running analysis)
   ```bash
   # macOS
   brew install sonar-scanner

   # Linux
   # Download from https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/

   # Verify installation
   sonar-scanner --version
   ```

3. **Node.js** (v18 or higher)
   ```bash
   node --version
   npm --version
   ```

## Quick Start

### 1. Start SonarQube Server

```bash
# Navigate to sonarqube scripts
cd sonarqube/scripts

# Start SonarQube (first time may take 1-2 minutes)
bash start-sonarqube.sh
```

Access SonarQube at: **http://localhost:9000**

**Default Credentials:**
- Username: `admin`
- Password: `admin`

**⚠️ Important:** Change the password on first login!

### 2. Generate Access Token

1. Login to SonarQube
2. Go to **User > My Account > Security**
3. Generate a new token with name `quantumcart-local`
4. Save the token securely

### 3. Set Environment Variable

```bash
export SONAR_TOKEN=your_generated_token_here
```

### 4. Run Analysis

```bash
# Analyze both backend and frontend
bash sonarqube/scripts/analyze-all.sh

# Or analyze individually
bash sonarqube/scripts/analyze-backend.sh
bash sonarqube/scripts/analyze-frontend.sh
```

### 5. View Results

- **Backend Dashboard**: http://localhost:9000/dashboard?id=quantumcart-backend
- **Frontend Dashboard**: http://localhost:9000/dashboard?id=quantumcart-frontend

## Detailed Setup

### Project Structure

```
sonarqube/
├── sonar-project.properties       # Main configuration
├── quality-profiles/               # Custom quality rules
│   ├── backend-quality-profile.json
│   └── frontend-quality-profile.json
├── scripts/                        # Analysis scripts
│   ├── start-sonarqube.sh         # Start SonarQube server
│   ├── analyze-backend.sh         # Analyze backend
│   ├── analyze-frontend.sh        # Analyze frontend
│   └── analyze-all.sh             # Analyze everything
├── docker/                         # Docker setup
│   └── docker-compose.yml         # SonarQube & PostgreSQL
├── config/                         # Additional configs
└── docs/                           # Documentation
    ├── SONARQUBE_SETUP.md
    └── QUALITY_GATES.md
```

### Configuration File (sonar-project.properties)

The main configuration file defines:

```properties
# Project Identification
sonar.projectKey=quantumcart-ecommerce
sonar.projectName=QuantumCart E-Commerce Platform
sonar.projectVersion=1.0.0

# Source and Test Directories
sonar.sources=backend,frontend/src
sonar.tests=backend/tests,frontend/src/__tests__

# Coverage Reports
sonar.javascript.lcov.reportPaths=backend/coverage/lcov.info,frontend/coverage/lcov.info

# Exclusions
sonar.exclusions=**/node_modules/**,**/build/**,**/coverage/**
```

## Running Analysis

### Option 1: Using Scripts (Recommended)

**Full Project Analysis:**
```bash
cd sonarqube/scripts
bash analyze-all.sh
```

**Backend Only:**
```bash
bash analyze-backend.sh
```

**Frontend Only:**
```bash
bash analyze-frontend.sh
```

### Option 2: Manual SonarQube Scanner

**Backend:**
```bash
cd backend
npm test -- --coverage --watchAll=false

sonar-scanner \
  -Dsonar.projectKey=quantumcart-backend \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=$SONAR_TOKEN
```

**Frontend:**
```bash
cd frontend
CI=true npm test -- --coverage --watchAll=false

sonar-scanner \
  -Dsonar.projectKey=quantumcart-frontend \
  -Dsonar.sources=src \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=$SONAR_TOKEN
```

### Option 3: Using Docker for Scanner

```bash
docker run --rm \
  -v "$(pwd):/usr/src" \
  -e SONAR_HOST_URL="http://host.docker.internal:9000" \
  -e SONAR_LOGIN="$SONAR_TOKEN" \
  sonarsource/sonar-scanner-cli
```

## Quality Profiles

### Backend Quality Profile

**Focus Areas:**
- Security vulnerabilities (SQL injection, XSS, etc.)
- Authentication and authorization
- Error handling
- Code complexity
- Dead code and unused variables
- Code duplication

**Key Rules:**
- No hard-coded credentials
- Proper error handling
- HttpOnly cookies
- Input validation
- Secure random number generation
- No SQL injection vulnerabilities

### Frontend Quality Profile (React)

**Focus Areas:**
- React best practices
- Component structure
- Hook usage
- State management
- Security (XSS, target="_blank")
- Performance patterns

**Key Rules:**
- Proper Hook dependencies
- No dangerouslySetInnerHTML
- Key props in lists
- Stable component identity
- No nested components
- Memoization for Context values

## Understanding Results

### Quality Gates

Quality gates define pass/fail criteria:

| Metric | Threshold |
|--------|-----------|
| Coverage | ≥ 80% |
| Duplicated Lines | ≤ 3% |
| Maintainability Rating | ≥ A |
| Reliability Rating | ≥ A |
| Security Rating | ≥ A |
| Security Hotspots Reviewed | 100% |

### Issue Severity

- **🔴 Blocker**: Must fix immediately (security, data loss)
- **🟠 Critical**: Should fix soon (bugs, vulnerabilities)
- **🟡 Major**: Should fix (code smells, maintainability)
- **🔵 Minor**: Nice to fix (minor issues)
- **⚪ Info**: For information (TODO, FIXME)

### Metrics Explained

**Code Smells:**
- Maintainability issues
- Don't necessarily cause bugs
- Make code harder to understand/modify

**Bugs:**
- Code that is wrong or likely to behave unexpectedly
- Should be fixed

**Vulnerabilities:**
- Security issues that can be exploited
- Must be fixed immediately

**Security Hotspots:**
- Security-sensitive code requiring review
- Not necessarily vulnerable

**Technical Debt:**
- Estimated time to fix all issues
- Calculated based on issue severity

## CI/CD Integration

### GitHub Actions Example

```yaml
name: SonarQube Analysis

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  sonarqube:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Dependencies
        run: |
          cd backend && npm install
          cd ../frontend && npm install

      - name: Run Tests with Coverage
        run: |
          cd backend && npm test
          cd ../frontend && npm test

      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

### Environment Variables

```bash
# Local Development
export SONAR_HOST_URL=http://localhost:9000
export SONAR_TOKEN=your_token_here

# CI/CD
# Set these as secrets in your CI/CD platform
SONAR_HOST_URL=https://sonarcloud.io  # or your SonarQube server
SONAR_TOKEN=your_production_token
```

## Troubleshooting

### SonarQube Won't Start

```bash
# Check Docker logs
cd sonarqube/docker
docker-compose logs sonarqube

# Check if ports are in use
lsof -i :9000

# Increase Docker memory (if needed)
# Docker Desktop > Preferences > Resources > Memory (min 4GB)
```

### Analysis Fails

```bash
# Check scanner version
sonar-scanner --version

# Verify coverage files exist
ls -la backend/coverage/lcov.info
ls -la frontend/coverage/lcov.info

# Run tests first
cd backend && npm test
cd frontend && npm test

# Check SonarQube logs
docker-compose logs -f sonarqube
```

### Token Issues

```bash
# Generate new token
# Login to SonarQube > User > My Account > Security > Generate

# Verify token works
curl -u your_token: http://localhost:9000/api/system/status
```

### Coverage Not Showing

```bash
# Ensure tests run with coverage
npm test -- --coverage

# Verify lcov.info exists
ls -la coverage/lcov.info

# Check file paths in sonar-project.properties
cat sonarqube/sonar-project.properties | grep lcov
```

## Best Practices

### 1. Run Analysis Regularly

- Before committing
- Before creating PR
- In CI/CD pipeline
- Weekly full analysis

### 2. Fix Issues Promptly

- **Blockers**: Immediately
- **Critical**: Within 1 day
- **Major**: Within 1 week
- **Minor**: Within 2 weeks

### 3. Review Security Hotspots

- All hotspots should be reviewed
- Mark as "Safe" with justification or fix

### 4. Maintain Coverage

- Aim for 80%+ coverage
- Cover critical paths at 100%
- Add tests for new features

### 5. Monitor Technical Debt

- Track debt ratio over time
- Allocate time to reduce debt
- Don't let debt grow unchecked

### 6. Use Quality Gates

- Configure strict quality gates
- Block merges that fail gates
- Review and adjust gates periodically

## Additional Resources

- [SonarQube Documentation](https://docs.sonarqube.org/)
- [SonarQube JavaScript Rules](https://rules.sonarsource.com/javascript)
- [SonarQube React Rules](https://github.com/SonarSource/SonarJS/tree/master/docs)
- [Quality Gates](https://docs.sonarqube.org/latest/user-guide/quality-gates/)

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review SonarQube logs
3. Consult official documentation
4. Open an issue in the project repository

---

**Last Updated:** 2024
**Version:** 1.0.0
