# Testing Documentation

Comprehensive unit testing suite for the QuantumCart E-commerce Platform.

## Overview

This project includes extensive unit tests for both backend and frontend components, ensuring code quality, reliability, and maintainability.

## Test Coverage

### Backend Tests
- **Models**: User, Product, Order, OrderItem
- **Routes**: Authentication, Products, Orders
- **Total Tests**: 50+ test cases

### Frontend Tests
- **Components**: App, ProductList, Cart, Login, OrderHistory
- **Functionality**: Authentication, Cart Management, Checkout
- **Total Tests**: 40+ test cases

## Technologies Used

### Backend Testing
- **Jest**: Test framework
- **Supertest**: HTTP assertions
- **SQLite**: In-memory test database
- **Coverage**: Models, Routes, Controllers

### Frontend Testing
- **React Testing Library**: Component testing
- **Jest**: Test framework
- **Jest-DOM**: Custom matchers
- **User Event**: Simulating user interactions

## Running Tests

### Backend Tests

```bash
# Run all backend tests
cd backend
npm test

# Run tests in watch mode
npm run test:watch

# Run only model tests
npm run test:models

# Run only route tests
npm run test:routes
```

### Frontend Tests

```bash
# Run all frontend tests
cd frontend
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Run All Tests

```bash
# From project root, run both backend and frontend tests
cd backend && npm test && cd ../frontend && npm test
```

## Test Structure

### Backend Structure

```
backend/
└── tests/
    ├── models/
    │   ├── user.model.test.js
    │   └── product.model.test.js
    ├── routes/
    │   ├── auth.routes.test.js
    │   ├── products.routes.test.js
    │   └── orders.routes.test.js
    ├── mocks/
    │   └── mockData.js
    └── helpers/
        └── testDb.js
```

### Frontend Structure

```
frontend/src/
├── __tests__/
│   ├── App.test.js
│   ├── Cart.test.js
│   └── Auth.test.js
├── __mocks__/
│   └── mockData.js
└── setupTests.js
```

## Backend Test Cases

### User Model Tests (user.model.test.js)
- ✅ User creation with valid data
- ✅ Password hashing on creation
- ✅ Password hashing on update
- ✅ Validation for email and password
- ✅ Unique email constraint
- ✅ Password validation method
- ✅ User retrieval by email and ID

### Product Model Tests (product.model.test.js)
- ✅ Product creation
- ✅ Required field validation
- ✅ Decimal price handling
- ✅ Product retrieval
- ✅ Product update
- ✅ Product deletion

### Auth Routes Tests (auth.routes.test.js)
- ✅ User registration with validation
- ✅ Input validation (email, password)
- ✅ Duplicate email prevention
- ✅ User login
- ✅ Authentication status check
- ✅ User logout
- ✅ Error handling

### Product Routes Tests (products.routes.test.js)
- ✅ Get all products
- ✅ Empty product list
- ✅ Product data structure
- ✅ Error handling

### Order Routes Tests (orders.routes.test.js)
- ✅ Create order with cart
- ✅ Empty cart validation
- ✅ Multiple items in order
- ✅ User association
- ✅ Price snapshot in order items
- ✅ Get user orders
- ✅ Order sorting
- ✅ User-specific orders

## Frontend Test Cases

### App Component Tests (App.test.js)
- ✅ App initialization
- ✅ Loading state
- ✅ Authentication check
- ✅ Product loading
- ✅ Header rendering
- ✅ Navigation
- ✅ Notification system

### Cart Tests (Cart.test.js)
- ✅ Empty cart display
- ✅ Cart items display
- ✅ Quantity management
- ✅ Total calculation
- ✅ Item removal
- ✅ Checkout process
- ✅ Authentication redirect
- ✅ Order creation
- ✅ Error handling

### Authentication Tests (Auth.test.js)
- ✅ Login form rendering
- ✅ Login/Signup toggle
- ✅ Form submission
- ✅ Success/Error messages
- ✅ Navigation after login
- ✅ Registration process
- ✅ Logout functionality
- ✅ Cart clearing on logout
- ✅ Protected routes

## Mock Data

### Backend Mock Data
Located in `backend/tests/mocks/mockData.js`:
- Mock users (2)
- Mock products (3)
- Mock orders (2)
- Mock order items (2)
- Mock cart (2 items)

### Frontend Mock Data
Located in `frontend/src/__mocks__/mockData.js`:
- Mock products (3)
- Mock user
- Mock cart (2 items)
- Mock orders (1 with items)

## Test Database

Backend tests use SQLite in-memory database for fast, isolated testing:
- No external database required
- Clean state for each test
- Fast execution
- No side effects

## Coverage Goals

- **Backend**: > 80% coverage
- **Frontend**: > 75% coverage
- **Critical Paths**: 100% coverage (auth, checkout)

## Continuous Integration

Tests should be run before:
- Committing changes
- Creating pull requests
- Deploying to production

## Best Practices

1. **Isolation**: Each test is independent
2. **Clean State**: Database/state reset between tests
3. **Descriptive Names**: Test names describe what they test
4. **Arrange-Act-Assert**: Tests follow AAA pattern
5. **Mock External Dependencies**: APIs and services mocked
6. **Coverage**: Aim for high coverage, but focus on critical paths

## Troubleshooting

### Backend Tests Failing

```bash
# Clear node modules and reinstall
cd backend
rm -rf node_modules
npm install
npm test
```

### Frontend Tests Failing

```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules
npm install
npm test
```

### Coverage Not Generated

```bash
# Backend
cd backend
npm test -- --coverage

# Frontend
cd frontend
npm run test:coverage
```

## Contributing

When adding new features:
1. Write tests first (TDD)
2. Ensure all tests pass
3. Maintain coverage above threshold
4. Update this documentation

## Future Enhancements

- [ ] Integration tests
- [ ] End-to-end tests (Cypress/Playwright)
- [ ] Performance tests
- [ ] Load testing
- [ ] Visual regression tests
- [ ] API contract testing

## Support

For issues with tests, please check:
1. Dependencies are installed
2. Node version compatibility
3. Test database configuration
4. Mock data is valid

---

**Note**: Tests use mock data and in-memory databases. No real data is affected during testing.
