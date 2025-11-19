# CI/CD Pipeline Documentation

Automated workflows for testing, building, and deploying the QuantumCart E-Commerce Platform.

## 🚀 Overview

This project uses **GitHub Actions** for continuous integration and continuous deployment (CI/CD). The pipeline automatically runs tests, builds Docker images, and performs code quality checks on every push and pull request.

## 📋 Workflows

### 1. **CI - Test & Build** (`ci.yml`)

**Triggers:**
- Push to `main`, `develop`, or `claude/**` branches
- Pull requests to `main` or `develop`

**What it does:**
- ✅ Runs backend tests with coverage
- ✅ Runs frontend tests with coverage
- ✅ Performs code quality checks
- ✅ Uploads coverage reports
- ✅ Archives test results

**Jobs:**
- `backend-tests`: Tests all backend code with Jest
- `frontend-tests`: Tests all frontend code with React Testing Library
- `lint`: Runs ESLint (if configured)
- `test-summary`: Provides final status

**Status Checks:**
- All tests must pass before PR can be merged
- Coverage reports available in artifacts

### 2. **Docker Build & Push** (`docker.yml`)

**Triggers:**
- Push to `main`, `develop`, or `claude/**` branches
- Pull requests to `main` or `develop`

**What it does:**
- ✅ Builds backend Docker image
- ✅ Builds frontend Docker image
- ✅ Verifies docker-compose configuration
- ✅ Tests complete stack build
- ✅ Pushes to Docker Hub (main branch only, if configured)

**Jobs:**
- `docker-build-test`: Verifies individual images build successfully
- `docker-compose-test`: Tests full stack deployment
- `docker-push`: Pushes images to Docker Hub (optional)

**Caching:**
- Uses GitHub Actions cache for faster builds
- Layer caching enabled for efficiency

### 3. **Code Quality Analysis** (`code-quality.yml`)

**Triggers:**
- Push to `main`, `develop`, or `claude/**` branches
- Pull requests to `main` or `develop`

**What it does:**
- ✅ Runs SonarCloud analysis (if configured)
- ✅ Performs security audits
- ✅ Checks for outdated packages
- ✅ Reviews dependencies on PRs

**Jobs:**
- `sonarcloud`: Static code analysis (optional)
- `security-audit`: npm audit for vulnerabilities
- `dependency-review`: Checks new dependencies in PRs

## 🔧 Setup Instructions

### Basic Setup (Already Working!)

**No setup required!** The workflows are already configured and will run automatically on:
- Every push to main, develop, or claude branches
- Every pull request to main or develop

### Optional: Enable Docker Hub Push

To push Docker images to Docker Hub:

1. **Create Docker Hub account** (if you don't have one)
   - Sign up at https://hub.docker.com

2. **Add secrets to GitHub repository:**
   - Go to: Settings → Secrets and variables → Actions → New repository secret
   - Add:
     - `DOCKER_USERNAME`: Your Docker Hub username
     - `DOCKER_PASSWORD`: Your Docker Hub access token

3. **Images will automatically push on merge to main**

### Optional: Enable SonarCloud

To enable code quality analysis with SonarCloud:

1. **Sign up for SonarCloud**
   - Visit https://sonarcloud.io
   - Sign in with GitHub
   - Import your repository

2. **Get your tokens:**
   - Organization key (found in SonarCloud dashboard)
   - Project key (auto-generated for your repo)
   - Token (generate in My Account → Security)

3. **Add secrets to GitHub repository:**
   - `SONAR_TOKEN`: Your SonarCloud token
   - `SONAR_ORGANIZATION`: Your organization key
   - `SONAR_PROJECT_KEY`: Your project key

4. **Analysis will run automatically on every push**

## 📊 Viewing Results

### Test Results

**On Pull Requests:**
- Scroll to bottom of PR page
- See all workflow status checks
- Click "Details" to view logs

**Coverage Reports:**
- Available in workflow artifacts
- Download from Actions tab → Select workflow run → Artifacts

### Docker Build Status

**Build Logs:**
- Actions tab → Docker Build & Push workflow
- View which images built successfully
- Check build times and sizes

### Code Quality

**Security Audit:**
- Actions tab → Code Quality Analysis
- Check for vulnerabilities
- Review outdated packages

**SonarCloud (if configured):**
- Visit SonarCloud dashboard
- View quality metrics, bugs, vulnerabilities
- See code smells and technical debt

## 🎯 Status Badges

Add these badges to your README:

```markdown
![CI Tests](https://github.com/AnubhavMishra22/E-Commerce-Project-NodeJS-ReactJS-/workflows/CI%20-%20Test%20%26%20Build/badge.svg)
![Docker Build](https://github.com/AnubhavMishra22/E-Commerce-Project-NodeJS-ReactJS-/workflows/Docker%20Build%20%26%20Push/badge.svg)
![Code Quality](https://github.com/AnubhavMishra22/E-Commerce-Project-NodeJS-ReactJS-/workflows/Code%20Quality%20Analysis/badge.svg)
```

## 🔄 Workflow Details

### Workflow Execution Order

**On Push:**
```
1. CI Workflow starts
   ├── Backend Tests (parallel)
   ├── Frontend Tests (parallel)
   └── Lint Checks (parallel)
2. Docker Workflow starts
   ├── Build Backend Image (parallel)
   ├── Build Frontend Image (parallel)
   └── Test Docker Compose
3. Code Quality Workflow starts
   ├── Run Tests for Coverage
   ├── SonarCloud Analysis (optional)
   ├── Security Audit
   └── Dependency Review
```

**On Pull Request:**
- All workflows run
- Status checks appear on PR
- Must pass before merge allowed (if branch protection enabled)

### Caching Strategy

**Node Modules:**
- Cached based on package-lock.json
- Speeds up dependency installation

**Docker Layers:**
- Cached in GitHub Actions cache
- Faster subsequent builds

**Coverage Reports:**
- Stored as artifacts for 30 days
- Downloadable from workflow runs

## 🐛 Troubleshooting

### Tests Failing?

1. **Check logs:**
   - Actions tab → Failed workflow
   - Click on failed job
   - Expand failed step

2. **Run locally:**
   ```bash
   cd backend && npm test
   cd frontend && npm test
   ```

3. **Common issues:**
   - Missing dependencies: `npm ci`
   - Outdated packages: `npm update`
   - Test timeouts: Check database connections

### Docker Build Failing?

1. **Check Dockerfile:**
   - Verify syntax
   - Check file paths

2. **Test locally:**
   ```bash
   cd docker
   docker-compose build
   ```

3. **Common issues:**
   - Missing files in build context
   - .dockerignore excluding needed files
   - Build args not set correctly

### Secrets Not Working?

1. **Verify secret names match exactly**
2. **Check secret values (no extra spaces)**
3. **Secrets are only available on push, not on pull_request from forks**

## 📈 Performance Metrics

**Typical Workflow Times:**
- CI Tests: 3-5 minutes
- Docker Build: 5-8 minutes
- Code Quality: 4-6 minutes

**Total PR Check Time:** ~10-15 minutes

**Cost:**
- Public repos: **FREE** (unlimited minutes)
- Private repos: **FREE** up to 2,000 minutes/month

## 🎓 Learning Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [SonarCloud Documentation](https://docs.sonarcloud.io/)

## 🤝 Contributing

When contributing:
1. All tests must pass
2. Code quality checks must pass
3. Docker builds must succeed
4. Review coverage reports

## 📝 Next Steps

**Recommended Enhancements:**
1. Add deployment workflow (Railway, Render, AWS)
2. Enable SonarCloud for quality tracking
3. Add performance testing
4. Implement semantic versioning
5. Add changelog generation

---

**Questions?** Check workflow logs in the Actions tab or review this documentation.
