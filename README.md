# QuantumCart - E-commerce Platform

[![Netlify Status](https://api.netlify.com/api/v1/badges/b33424ed-1edc-419c-a57f-42bf66b5cb12/deploy-status)](https://app.netlify.com/projects/quantumcart/deploys)
![CI Tests](https://github.com/AnubhavMishra22/E-Commerce-Project-NodeJS-ReactJS-/workflows/CI%20-%20Test%20%26%20Build/badge.svg)
![Docker Build](https://github.com/AnubhavMishra22/E-Commerce-Project-NodeJS-ReactJS-/workflows/Docker%20Build%20%26%20Push/badge.svg)
![Code Quality](https://github.com/AnubhavMishra22/E-Commerce-Project-NodeJS-ReactJS-/workflows/Code%20Quality%20Analysis/badge.svg)

A modern e-commerce platform built with React frontend and Node.js backend with MySQL database.

## 🌐 Live Demo

**Visit the live site:** [quantumcart.netlify.app](https://quantumcart.netlify.app)

## 🚀 Features

- **Modern UI/UX** with glass morphism effects
- **Product Catalog** with high-quality images
- **Shopping Cart** functionality
- **User Authentication** (login/register)
- **Order Management** with order history
- **Responsive Design** for all devices
- **Real-time Updates** with notifications

## 🛠️ Tech Stack

### Frontend
- React 19
- Tailwind CSS
- Axios for API calls
- Glass morphism effects

### Backend
- Node.js
- Express.js
- MySQL database
- Sequelize ORM
- Passport.js for authentication
- CORS enabled
- Express Validator for input validation
- Express Rate Limit for brute-force protection
- bcryptjs for password hashing
- Environment-based configuration

### DevOps & Quality
- **CI/CD**: GitHub Actions with automated testing and Docker builds
- **Testing**: Jest (Backend), React Testing Library (Frontend) - 90+ test cases
- **Code Quality**: SonarQube static analysis with 95+ quality rules
- **Containerization**: Docker & Docker Compose for development and production
- **Coverage**: 80%+ code coverage across backend and frontend

## 🔄 CI/CD Pipeline

This project uses **GitHub Actions** for continuous integration and deployment:

### Automated Workflows

**On every push and pull request:**
- ✅ **Automated Testing**: Runs 90+ unit tests for backend and frontend
- ✅ **Code Coverage**: Generates and uploads coverage reports (80%+ coverage)
- ✅ **Docker Builds**: Verifies all Docker images build successfully
- ✅ **Security Audits**: Checks for npm vulnerabilities and outdated packages
- ✅ **Quality Checks**: ESLint and code quality verification
- ✅ **Dependency Review**: Analyzes new dependencies in pull requests

### Workflows

1. **CI - Test & Build**: Runs all tests with coverage reporting
2. **Docker Build & Push**: Builds and verifies Docker images
3. **Code Quality Analysis**: Security audits and quality checks

**See [CI/CD Documentation](.github/workflows/README.md) for detailed setup and usage.**

## 🧪 Testing

Comprehensive test coverage with automated CI:

### Backend Tests
- **Framework**: Jest with Supertest
- **Coverage**: 80%+ across models, routes, and controllers
- **Database**: SQLite in-memory for fast, isolated tests
- **Tests**: 50+ test cases covering authentication, products, orders

### Frontend Tests
- **Framework**: React Testing Library with Jest
- **Coverage**: 80%+ across components and user interactions
- **Tests**: 40+ test cases for UI, state management, and API integration

**Run tests:**
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# With coverage
npm test -- --coverage
```

## 🐳 Docker Support

Full Docker containerization for easy deployment:

### Quick Start
```bash
# Development
cd docker && bash scripts/start-dev.sh

# Production
cd docker && bash scripts/start-prod.sh
```

### Features
- **Development**: Hot reload for backend and frontend
- **Production**: Multi-stage builds, Nginx, optimized images
- **Services**: MySQL, Backend (Node.js), Frontend (React)
- **Management**: Automated scripts for start, stop, rebuild, logs

**See [Docker Documentation](docker/README.md) for detailed setup.**

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MySQL database
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ecommerce-app
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Configure Backend Environment**
   - Create a MySQL database named `ecommerce_db`
   - Create a `.env` file in the `backend` directory with the following variables:
     ```
     PORT=5000
     DB_HOST=localhost
     DB_USER=root
     DB_PASS=your_password
     DB_NAME=ecommerce_db
     SESSION_SECRET=your_secure_secret_key
     ```

5. **Configure Frontend Environment** (Optional)
   - Create a `.env` file in the `frontend` directory:
     ```
     REACT_APP_API_URL=http://localhost:5000/api
     ```
   - Note: If not set, the app defaults to `http://localhost:5000/api`

6. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```

7. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```

## 🌐 Deployment

### Netlify Deployment

This project is configured for easy deployment on Netlify:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository
   - Build settings are pre-configured:
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `build`

3. **Environment Variables** (if needed)
   - Add any environment variables in Netlify dashboard
   - For production, you'll need to host the backend separately

## 📁 Project Structure

```
E-Commerce-Project-NodeJS-ReactJS-/
├── .github/
│   └── workflows/           # GitHub Actions CI/CD pipelines
│       ├── ci.yml          # Automated testing workflow
│       ├── docker.yml      # Docker build & push workflow
│       ├── code-quality.yml # Code quality & security checks
│       └── README.md       # CI/CD documentation
├── frontend/               # React application
│   ├── src/
│   │   ├── __tests__/     # Frontend test suite (40+ tests)
│   │   └── __mocks__/     # Mock data for testing
│   ├── public/
│   ├── .dockerignore
│   └── package.json
├── backend/                # Node.js server
│   ├── config/            # Database & Passport configuration
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── seeders/           # Database seeders
│   ├── tests/             # Backend test suite (50+ tests)
│   │   ├── models/
│   │   ├── routes/
│   │   ├── helpers/
│   │   └── mocks/
│   ├── .dockerignore
│   ├── server.js
│   └── package.json
├── docker/                 # Docker configuration
│   ├── backend/
│   │   ├── Dockerfile     # Production Dockerfile
│   │   └── Dockerfile.dev # Development Dockerfile
│   ├── frontend/
│   │   ├── Dockerfile
│   │   ├── Dockerfile.dev
│   │   └── nginx.conf     # Nginx configuration for production
│   ├── mysql/
│   │   └── init/          # Database initialization scripts
│   ├── scripts/           # Docker management scripts
│   │   ├── start-dev.sh
│   │   ├── start-prod.sh
│   │   ├── stop.sh
│   │   ├── logs.sh
│   │   └── clean.sh
│   ├── docs/              # Docker documentation
│   ├── docker-compose.yml # Production configuration
│   ├── docker-compose.dev.yml # Development configuration
│   └── README.md
├── sonarqube/             # Static code analysis
│   ├── quality-profiles/  # Custom quality rules (95+ rules)
│   ├── scripts/           # SonarQube management scripts
│   ├── docker/            # SonarQube Docker setup
│   ├── docs/              # SonarQube documentation
│   └── sonar-project.properties
├── netlify.toml           # Netlify configuration
├── TESTING.md             # Testing documentation
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables
Create a `.env` file in the `backend` directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=ecommerce_db
SESSION_SECRET=your_secure_secret_key
NODE_ENV=development
```

### Frontend Environment Variables
Create a `.env` file in the `frontend` directory (optional):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Note**: The frontend defaults to `http://localhost:5000/api` if `REACT_APP_API_URL` is not set.

**Important**: Never commit `.env` files to version control. They're already included in `.gitignore`. Use `.env.example` files as templates.

## 🎨 Features

- **Glass Morphism Design**: Modern UI with transparency effects
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Product Management**: Add, view, and manage products
- **Shopping Cart**: Add items, update quantities, checkout
- **User Authentication**: Secure login and registration
- **Order Tracking**: View order history and status

## 📱 Screenshots

- Homepage with product catalog
- Shopping cart with glass morphism effects
- User authentication pages
- Order history and management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository.