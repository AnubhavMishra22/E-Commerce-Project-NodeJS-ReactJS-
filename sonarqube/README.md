# SonarQube Static Code Analysis

Static code analysis infrastructure for the QuantumCart E-Commerce Platform using SonarQube.

## 🎯 Purpose

This directory contains all SonarQube-related configuration, scripts, and documentation for comprehensive static code analysis of both backend (Node.js/Express) and frontend (React) codebases.

## 📁 Directory Structure

```
sonarqube/
├── README.md                           # This file
├── sonar-project.properties            # Main SonarQube configuration
├── config/                             # Additional configurations
├── quality-profiles/                   # Custom quality rules
│   ├── backend-quality-profile.json   # Backend (Node.js) rules
│   └── frontend-quality-profile.json  # Frontend (React) rules
├── scripts/                            # Analysis scripts
│   ├── start-sonarqube.sh             # Start SonarQube server
│   ├── analyze-backend.sh             # Analyze backend only
│   ├── analyze-frontend.sh            # Analyze frontend only
│   └── analyze-all.sh                 # Analyze entire project
├── docker/                             # Docker setup
│   └── docker-compose.yml             # SonarQube + PostgreSQL
└── docs/                               # Documentation
    ├── SONARQUBE_SETUP.md             # Setup guide
    └── QUALITY_GATES.md               # Quality gates reference
```

## 🚀 Quick Start

### 1. Start SonarQube

```bash
cd scripts
bash start-sonarqube.sh
```

Access at: **http://localhost:9000** (admin/admin)

### 2. Run Analysis

```bash
# Full project analysis
bash analyze-all.sh

# Backend only
bash analyze-backend.sh

# Frontend only
bash analyze-frontend.sh
```

### 3. View Results

- Backend: http://localhost:9000/dashboard?id=quantumcart-backend
- Frontend: http://localhost:9000/dashboard?id=quantumcart-frontend

## 📊 What Gets Analyzed

### Backend
- **Code Smells**: Maintainability issues
- **Bugs**: Reliability issues
- **Vulnerabilities**: Security issues (SQL injection, XSS, etc.)
- **Security Hotspots**: Security-sensitive code
- **Code Coverage**: From Jest tests
- **Duplications**: Code duplication
- **Complexity**: Cognitive and cyclomatic complexity

### Frontend (React)
- **React Best Practices**: Hook usage, component structure
- **Security**: XSS, dangerouslySetInnerHTML, target="_blank"
- **Performance**: Re-renders, memoization
- **Accessibility**: Basic accessibility checks
- **Code Quality**: Same as backend
- **Test Coverage**: From React Testing Library

## 🔧 Configuration

### Main Configuration (sonar-project.properties)

Key settings:
- Project identification
- Source directories
- Test directories
- Coverage report paths
- Exclusions (node_modules, build, coverage)
- Quality thresholds

### Quality Profiles

**Backend Profile:** 50+ JavaScript/Node.js rules
- Security-focused
- Express.js best practices
- Error handling
- Authentication/Authorization

**Frontend Profile:** 45+ React-specific rules
- React Hooks rules
- Component best practices
- State management
- Security (XSS prevention)

## 📝 Scripts

### start-sonarqube.sh
Starts SonarQube server using Docker Compose
- Starts PostgreSQL database
- Starts SonarQube server
- Waits for server to be ready
- Shows access instructions

### analyze-backend.sh
Analyzes backend code
- Runs backend tests with coverage
- Executes SonarQube scanner
- Uploads results to server

### analyze-frontend.sh
Analyzes frontend code
- Runs frontend tests with coverage
- Executes SonarQube scanner
- Uploads results to server

### analyze-all.sh
Analyzes entire project
- Runs both backend and frontend analysis
- Provides comprehensive results
- Shows dashboard links

## 🎯 Quality Gates

Default thresholds:
- **Coverage**: ≥ 80%
- **Duplicated Lines**: ≤ 3%
- **Maintainability**: A rating
- **Reliability**: A rating
- **Security**: A rating
- **Security Hotspots**: 100% reviewed

## 📖 Documentation

Comprehensive guides in `docs/`:

- **SONARQUBE_SETUP.md**: Complete setup and usage guide
  - Prerequisites
  - Installation steps
  - Running analysis
  - Troubleshooting
  - CI/CD integration

- **QUALITY_GATES.md**: Quality gates reference
  - Gate configuration
  - Metrics explanation
  - Custom gates
  - Best practices

## 🐳 Docker Setup

### Services
- **SonarQube**: Community Edition 10.3
- **PostgreSQL**: 15-alpine (database)

### Volumes
- `sonarqube_data`: SonarQube data
- `sonarqube_extensions`: Plugins and extensions
- `sonarqube_logs`: Log files
- `postgresql_data`: Database data

### Ports
- **9000**: SonarQube web interface

### Management
```bash
cd docker

# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f sonarqube

# Full cleanup
docker-compose down -v
```

## 🔐 Security

### Default Credentials
- Username: `admin`
- Password: `admin`

**⚠️ IMPORTANT:** Change password on first login!

### Token Generation
1. Login to SonarQube
2. User > My Account > Security
3. Generate token
4. Save securely
5. Use in CI/CD: `export SONAR_TOKEN=your_token`

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: SonarQube

on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install & Test
        run: |
          cd backend && npm install && npm test
          cd ../frontend && npm install && npm test
      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

## 📈 Metrics Tracked

| Metric | Description | Target |
|--------|-------------|--------|
| Code Coverage | % of code covered by tests | ≥ 80% |
| Code Smells | Maintainability issues | < 100 |
| Bugs | Reliability issues | 0 |
| Vulnerabilities | Security issues | 0 |
| Security Hotspots | Needs review | 0 unreviewed |
| Duplicated Lines | Code duplication | ≤ 3% |
| Complexity | Cognitive complexity | < 15 per function |
| Technical Debt | Time to fix issues | < 5% dev time |

## 🛠️ Customization

### Adding Custom Rules

1. Edit quality profiles in `quality-profiles/`
2. Add rule to JSON configuration
3. Import in SonarQube UI
4. Assign to project

### Adjusting Exclusions

Edit `sonar-project.properties`:
```properties
sonar.exclusions=**/node_modules/**,**/build/**,...
```

### Custom Quality Gates

See `docs/QUALITY_GATES.md` for configuration examples.

## 🐛 Troubleshooting

### Server Won't Start
```bash
docker-compose logs sonarqube
docker system prune
docker-compose up -d --force-recreate
```

### Analysis Fails
```bash
# Verify scanner installation
sonar-scanner --version

# Check coverage files
ls -la backend/coverage/lcov.info
ls -la frontend/coverage/lcov.info

# Re-run tests
npm test -- --coverage
```

### No Coverage Data
```bash
# Ensure tests generate coverage
npm test -- --coverage --watchAll=false

# Check paths in configuration
cat sonar-project.properties | grep lcov
```

## 📚 Resources

- [SonarQube Documentation](https://docs.sonarqube.org/)
- [JavaScript Rules](https://rules.sonarsource.com/javascript)
- [React Rules](https://github.com/SonarSource/SonarJS)
- [Quality Gates Guide](https://docs.sonarqube.org/latest/user-guide/quality-gates/)

## 🤝 Contributing

When adding features:
1. Run SonarQube analysis
2. Fix any critical/blocker issues
3. Maintain coverage above 80%
4. Review security hotspots
5. Update quality profiles if needed

## 📞 Support

For issues:
1. Check `docs/SONARQUBE_SETUP.md`
2. Review logs: `docker-compose logs`
3. Consult SonarQube documentation
4. Open project issue

---

**Version:** 1.0.0
**Last Updated:** 2024
**Maintainer:** QuantumCart Development Team
