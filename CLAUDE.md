# CLAUDE.md - AI Assistant Guide for QuantumCart E-Commerce Platform

> **Last Updated**: 2025-11-15
> **Project**: QuantumCart - Full-stack E-Commerce Platform
> **Live Site**: https://quantumcart.netlify.app

---

## 🎯 Quick Reference

### Project Type
Full-stack monorepo with React frontend and Node.js/Express backend

### Tech Stack at a Glance
- **Frontend**: React 19, Tailwind CSS, Axios, Glass Morphism UI
- **Backend**: Node.js, Express 5, Sequelize ORM, Passport.js
- **Database**: MySQL with connection pooling
- **Deployment**: Netlify (frontend), Backend requires separate hosting

### Repository Structure
```
/backend/          # Node.js API server (port 8080)
/frontend/         # React SPA (port 3000)
netlify.toml       # Deployment config
```

---

## 📁 Directory Structure & File Locations

### Backend Organization (`/backend/`)
```
server.js                    # Main entry point (67 lines)
config/
  ├── database.js           # Sequelize MySQL connection config
  └── passport.js           # LocalStrategy auth configuration
models/
  ├── index.js              # Model initialization & associations
  ├── user.model.js         # User schema (email, password hash)
  ├── product.model.js      # Product schema (name, price, image)
  ├── order.model.js        # Order schema (total amount, userId)
  └── orderItem.model.js    # OrderItem (quantity, price at purchase)
routes/
  ├── auth.js               # Register, login, logout, status endpoints
  ├── products.js           # Product listing endpoints
  └── orders.js             # Order creation & history endpoints
seeders/
  └── seedProducts.js       # Initial product data (6 tech products)
```

### Frontend Organization (`/frontend/`)
```
src/
  ├── App.js                # Main component with ALL pages (450 lines)
  ├── index.js              # React app initialization
  └── index.css             # Tailwind + custom glass morphism styles
public/
  ├── index.html            # SPA entry point
  └── [assets]              # Logos, manifest, favicon
```

**IMPORTANT**: All React components are in a SINGLE FILE (`App.js`). No separate component files exist.

---

## 🔑 Key Conventions & Patterns

### Frontend Patterns

#### Component Architecture
- **Single File**: All components defined in `/frontend/src/App.js`
- **No Router**: Uses conditional rendering based on `page` state variable
- **State Management**: React Context API (AuthContext, CartContext)
- **Styling**: Tailwind CSS with extensive glass morphism effects

#### Page Navigation
```javascript
// Pages controlled by state, not routes
const [page, setPage] = useState('home');

// Pages: 'home', 'cart', 'orders', 'login'
setPage('cart'); // Navigate to cart
```

#### Data Persistence
- **Cart**: Stored in localStorage, synced on mount
- **Auth**: Session cookies (backend-managed)
- **Products**: Fetched fresh on ProductList mount

#### API Communication
```javascript
// Axios configured globally in App.js lines 4-7
const API_BASE_URL = 'http://localhost:8080/api';
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true; // CRITICAL for session cookies
```

### Backend Patterns

#### Request Flow
```
Request → CORS → Body Parser → Session → Passport → Route Handler → Response
```

#### Route Structure
All routes prefixed with `/api`:
- `/api/auth/*` - Authentication endpoints
- `/api/products/*` - Product endpoints
- `/api/orders/*` - Order endpoints (protected)

#### Authentication Middleware
```javascript
// Used in routes/orders.js
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'You must be logged in to do that.' });
};
```

#### Database Operations
- **ORM**: Sequelize models in `/backend/models/`
- **Associations**: Defined in `/backend/models/index.js`
- **Transactions**: Used in order creation (`/backend/routes/orders.js`)

---

## 🗄️ Database Schema

### Tables & Relationships
```
Users (id, email, password)
  └─── hasMany ───> Orders (id, userId, total)
                      └─── hasMany ───> OrderItems (id, orderId, productId, quantity, price)
                                          └─── belongsTo ───> Products (id, name, price, image)
```

### Model Files
| Model | File | Key Fields |
|-------|------|------------|
| User | `models/user.model.js` | email (unique), password (bcrypt hashed) |
| Product | `models/product.model.js` | name, price (DECIMAL), image (URL) |
| Order | `models/order.model.js` | userId (FK), total (DECIMAL) |
| OrderItem | `models/orderItem.model.js` | orderId (FK), productId (FK), quantity, price |

### Password Security
- **Hashing**: bcryptjs with 10 salt rounds
- **Hook**: `beforeCreate` in User model auto-hashes on creation
- **Verification**: `bcrypt.compare()` in Passport strategy

---

## 🔐 Authentication & Authorization

### Authentication Strategy
**Type**: Session-based (NOT JWT)
**Library**: Passport.js with LocalStrategy
**Session Store**: MySQL database (via connect-session-sequelize)

### Auth Flow
1. User submits credentials to `/api/auth/login` or `/api/auth/register`
2. Passport LocalStrategy authenticates (email/password)
3. Password verified with bcrypt
4. Session created in MySQL Sessions table
5. Session cookie sent to browser
6. Cookie included in subsequent requests (axios withCredentials: true)
7. Passport deserializes user on each request

### Protected Routes
**Backend**: Apply `isAuthenticated` middleware
```javascript
router.post('/orders', isAuthenticated, async (req, res) => { ... });
```

**Frontend**: Check user context
```javascript
if (!user) {
  showNotification('Please login first', 'error');
  setPage('login');
  return;
}
```

### Session Configuration
- **Duration**: 24 hours (86400000 ms)
- **Secret**: Hardcoded as 'secret_key_for_sessions' (TODO: use env var)
- **Resave**: false
- **SaveUninitialized**: false

---

## 🚀 API Reference

### Base URL
**Development**: `http://localhost:8080/api`

### Endpoints

#### Authentication
```http
POST /api/auth/register
Body: { email: string, password: string }
Response: { id: number, email: string }

POST /api/auth/login
Body: { email: string, password: string }
Response: { id: number, email: string }

POST /api/auth/logout
Response: { message: "Logged out successfully." }

GET /api/auth/status
Response: { id: number, email: string } | 401
```

#### Products
```http
GET /api/products
Response: [{ id, name, price, image, createdAt, updatedAt }]
Auth: Not required
```

#### Orders
```http
POST /api/orders
Auth: Required
Body: { cart: [{ id, name, price, quantity }] }
Response: { id, userId, total, createdAt, updatedAt }

GET /api/orders
Auth: Required
Response: [{
  id, userId, total, createdAt, updatedAt,
  orderItems: [{
    id, orderId, productId, quantity, price,
    product: { id, name, price, image }
  }]
}]
```

### Error Handling
- **401**: Not authenticated (protected routes)
- **400**: Validation errors (empty cart, missing fields)
- **500**: Server errors (database issues, transaction failures)

---

## 🛠️ Development Workflows

### Starting the Application

#### Backend (Terminal 1)
```bash
cd backend
npm install          # First time only
npm run dev          # Development with nodemon
# Server starts on http://localhost:8080
```

#### Frontend (Terminal 2)
```bash
cd frontend
npm install          # First time only
npm start            # Development server
# App opens at http://localhost:3000
```

#### Database Setup
```sql
CREATE DATABASE ecommerce_db;
```
Update credentials in `/backend/config/database.js`:
```javascript
HOST: "localhost",
USER: "root",
PASSWORD: "your_password",
DB: "ecommerce_db"
```

### Making Changes

#### Adding a New Component
**Location**: `/frontend/src/App.js`
```javascript
// Define component inside App component
const MyNewComponent = () => {
  return <div>Content</div>;
};

// Use it in JSX
return (
  <div>
    <MyNewComponent />
  </div>
);
```

#### Adding a New API Endpoint
1. **Create route handler** in `/backend/routes/[resource].js`
2. **Mount route** in `/backend/server.js`:
   ```javascript
   const newRoutes = require('./routes/new');
   app.use('/api/new', newRoutes);
   ```
3. **Call from frontend** using axios:
   ```javascript
   const response = await axios.get('/new/endpoint');
   ```

#### Adding a New Database Model
1. **Create model** in `/backend/models/newmodel.model.js`
2. **Import & associate** in `/backend/models/index.js`:
   ```javascript
   db.NewModel = require('./newmodel.model')(sequelize, DataTypes);
   // Add associations
   db.NewModel.belongsTo(db.OtherModel);
   ```
3. **Restart server** (tables auto-sync on startup)

#### Protecting a New Route
```javascript
// In route file
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: 'You must be logged in to do that.' });
};

router.get('/protected', isAuthenticated, async (req, res) => {
    // req.user is available here
});
```

### Database Migrations
**⚠️ WARNING**: This project does NOT use Sequelize migrations.

**Current Approach**:
- Models auto-sync on server startup
- `db.sequelize.sync({ force: false })` in server.js
- Setting `force: true` DROPS ALL TABLES (data loss!)

**For Schema Changes**:
1. Edit model file
2. Restart server
3. Sequelize attempts to alter table
4. May require manual SQL for complex changes

---

## 🎨 Styling Conventions

### Tailwind CSS Classes
**Glass Morphism Pattern** (used throughout):
```jsx
className="bg-white/10 backdrop-blur-md border border-white/20"
```

### Common Patterns
```jsx
// Card
"bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-6 border border-white/20"

// Button (Primary)
"bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"

// Button (Secondary)
"bg-white/20 hover:bg-white/30 text-white border border-white/20 px-4 py-2 rounded"

// Input
"w-full px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg"
```

### Background
```css
/* Applied to body in index.css */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
min-height: 100vh;
```

---

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```
- **Framework**: Jest (via react-scripts)
- **Library**: React Testing Library
- **Setup**: `/frontend/src/setupTests.js`
- **Test Files**: `*.test.js` (currently only App.test.js exists)

### Backend Tests
**Status**: Not configured
- No test files exist
- No testing framework installed
- `npm test` returns error

**Recommendation**: Add Jest + Supertest for API testing

---

## 📦 Deployment

### Frontend (Netlify)
**Configuration**: `/netlify.toml`
- **Build Command**: `npm run build`
- **Publish Directory**: `build`
- **Base Directory**: `frontend`
- **Node Version**: 18

**Auto-Deployment**:
1. Push to GitHub (main or other configured branch)
2. Netlify auto-builds and deploys
3. Live at: https://quantumcart.netlify.app

**SPA Routing**: All routes redirect to `/index.html` (status 200)

### Backend (Separate Hosting Required)
**Options**: Heroku, AWS, DigitalOcean, Railway, Render

**Environment Variables Needed**:
```env
PORT=8080
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASS=your_mysql_password
DB_NAME=ecommerce_db
SESSION_SECRET=random_secure_string
```

**Production Considerations**:
- Update CORS to allow production frontend URL
- Use environment variable for database config
- Update `API_BASE_URL` in frontend App.js
- Set up MySQL database on hosting provider
- Enable HTTPS

---

## ⚠️ Important Gotchas & Known Issues

### Configuration Issues
1. **Hardcoded Values**: Database config, session secret, API URL not using env vars
2. **CORS**: Currently only allows `http://localhost:3000`
3. **Session Secret**: Hardcoded as 'secret_key_for_sessions'

### Architecture Limitations
1. **No Migration System**: Schema changes require manual intervention
2. **Single File Frontend**: All components in App.js (450 lines)
3. **No Router**: Page navigation via state, not URL-based
4. **No Error Boundaries**: React errors may crash entire app
5. **No Loading States**: Some API calls lack loading indicators

### Security Considerations
1. **No Rate Limiting**: Auth endpoints vulnerable to brute force
2. **No CSRF Protection**: Session-based but lacks CSRF tokens
3. **No Input Validation**: Beyond basic Sequelize validations
4. **No Request Logging**: No audit trail for API calls

### Data Consistency
1. **Cart-Order Sync**: Cart stores product info, but prices could change
2. **No Stock Tracking**: Products can be ordered infinitely
3. **No Payment**: Order creation doesn't process payment

---

## 🔧 Common Tasks for AI Assistants

### Task: Add a New Product Field
1. Edit `/backend/models/product.model.js`:
   ```javascript
   description: { type: DataTypes.TEXT, allowNull: true }
   ```
2. Restart backend server (table auto-updates)
3. Update frontend ProductList in `/frontend/src/App.js`:
   ```jsx
   <p>{product.description}</p>
   ```

### Task: Add User Profile Page
1. Add page state: `setPage('profile')`
2. Create `ProfilePage` component in App.js
3. Add conditional render in return statement
4. Create `/api/users/profile` endpoint in backend
5. Fetch user data in useEffect when page mounts

### Task: Implement Product Search
1. **Backend**: Add query param to `/api/products`:
   ```javascript
   const { search } = req.query;
   const where = search ? { name: { [Op.like]: `%${search}%` } } : {};
   Product.findAll({ where });
   ```
2. **Frontend**: Add search input and filter state in ProductList

### Task: Add Order Status
1. Add `status` field to Order model
2. Update order creation to set initial status
3. Display status in OrderHistoryPage
4. Create endpoint to update status (admin only)

### Task: Fix Authentication Issue
1. Check `axios.defaults.withCredentials = true` in App.js
2. Verify CORS allows credentials in server.js
3. Check session middleware is before Passport middleware
4. Verify passport.serializeUser and deserializeUser
5. Check Sessions table in MySQL has records

---

## 📝 Code Style Guidelines

### JavaScript/React
- **ES6+**: Use arrow functions, destructuring, template literals
- **Async/Await**: Prefer over .then() chains
- **Functional Components**: Use hooks, no class components
- **Naming**: camelCase for variables, PascalCase for components

### File Naming
- **Components**: PascalCase (ProductList, CartPage)
- **Routes**: lowercase (auth.js, products.js)
- **Models**: lowercase with .model.js suffix

### Comments
- Explain WHY, not WHAT
- Document complex logic
- Add TODO comments for future improvements

---

## 🔍 Debugging Tips

### Backend Issues
```bash
# Check server logs
cd backend && npm run dev

# Common issues:
# - Database connection: Check credentials in config/database.js
# - Port in use: Kill process on port 8080 or change PORT
# - Auth not working: Check session middleware order
```

### Frontend Issues
```bash
# Check browser console for errors
# Common issues:
# - CORS errors: Backend not running or wrong URL
# - Auth not persisting: Check withCredentials: true
# - State not updating: Check useState and useEffect dependencies
```

### Database Issues
```bash
# Connect to MySQL
mysql -u root -p

# Check tables
USE ecommerce_db;
SHOW TABLES;
DESCRIBE Users;

# Check sessions
SELECT * FROM Sessions;
```

---

## 📚 Key Dependencies Reference

### Backend
- **express**: Web framework (v5.1.0)
- **sequelize**: ORM for MySQL (v6.37.7)
- **mysql2**: MySQL driver (v3.14.1)
- **passport**: Authentication (v0.7.0)
- **passport-local**: Email/password strategy (v1.0.0)
- **bcryptjs**: Password hashing (v3.0.2)
- **express-session**: Session management (v1.18.1)
- **cors**: Cross-origin requests (v2.8.5)

### Frontend
- **react**: UI library (v19.1.0)
- **axios**: HTTP client (v1.11.0)
- **tailwindcss**: CSS framework (v3.4.17)
- **react-scripts**: Build tools (v5.0.1)

---

## 🎓 Learning Resources

### Understanding the Codebase
1. Start with `/backend/server.js` to understand middleware flow
2. Read `/backend/models/index.js` to understand data relationships
3. Review `/frontend/src/App.js` to see component structure
4. Check `/backend/routes/` to understand API contracts

### Key Concepts
- **Sequelize ORM**: https://sequelize.org/docs/v6/
- **Passport.js**: http://www.passportjs.org/docs/
- **React Context API**: https://react.dev/reference/react/useContext
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 🚨 Critical Rules for AI Assistants

### DO
- ✅ Use existing patterns (Context API, glass morphism styling)
- ✅ Add new components to App.js (don't create new files unless necessary)
- ✅ Include loading states for async operations
- ✅ Handle errors gracefully with user-friendly messages
- ✅ Test authentication by checking user context
- ✅ Use transactions for multi-step database operations
- ✅ Verify CORS settings when adding new endpoints

### DO NOT
- ❌ Remove or modify existing authentication logic without understanding flow
- ❌ Use `force: true` in db.sync() (drops all tables!)
- ❌ Hardcode sensitive data (use environment variables)
- ❌ Skip error handling in API calls
- ❌ Break glass morphism design consistency
- ❌ Create separate component files (keep in App.js)
- ❌ Change API URLs without updating both frontend and backend

### ALWAYS CHECK
- 🔍 Is backend running on port 8080?
- 🔍 Is frontend running on port 3000?
- 🔍 Is MySQL database running and accessible?
- 🔍 Are session cookies being sent (withCredentials: true)?
- 🔍 Does new code follow existing patterns?

---

## 📞 Getting Help

### Logs to Check
1. **Backend**: Terminal running `npm run dev` in /backend
2. **Frontend**: Browser console (F12)
3. **Database**: MySQL error logs
4. **Network**: Browser DevTools Network tab

### Common Error Solutions
| Error | Solution |
|-------|----------|
| CORS error | Check backend CORS config includes frontend URL |
| 401 Unauthorized | User not logged in or session expired |
| Session not persisting | Check withCredentials: true in axios config |
| Database connection failed | Verify MySQL running and credentials correct |
| Port already in use | Kill process or change PORT in .env |

---

## 🎯 Quick Command Reference

```bash
# Backend Development
cd backend
npm install
npm run dev           # Start with nodemon
npm start             # Start production

# Frontend Development
cd frontend
npm install
npm start             # Development server
npm test              # Run tests
npm run build         # Production build

# Database
mysql -u root -p
CREATE DATABASE ecommerce_db;

# Git
git status
git add .
git commit -m "message"
git push origin main
```

---

## 📊 Project Statistics

- **Total Files**: ~30 (excluding node_modules)
- **Backend Files**: 12
- **Frontend Files**: 10
- **Lines of Code**: ~1,500
- **Largest File**: `/frontend/src/App.js` (450 lines)
- **Database Tables**: 5 (Users, Products, Orders, OrderItems, Sessions)
- **API Endpoints**: 6
- **React Components**: 8 (all in App.js)

---

## 🔄 Version History

| Date | Changes |
|------|---------|
| 2025-11-15 | CLAUDE.md created with comprehensive codebase documentation |
| Earlier | Project initialized with React 19, Express 5, Sequelize 6 |

---

## 📝 Notes for Future Development

### Recommended Improvements
1. **Environment Variables**: Move all config to .env files
2. **Component Splitting**: Extract components from App.js to separate files
3. **React Router**: Implement URL-based routing
4. **Error Boundaries**: Add React error boundaries
5. **Testing**: Add comprehensive backend API tests
6. **Validation**: Implement input validation library (Joi, Yup)
7. **Rate Limiting**: Add express-rate-limit for auth routes
8. **Logging**: Implement Winston or Morgan for request logging
9. **Stock Management**: Add inventory tracking to products
10. **Payment Integration**: Integrate Stripe or PayPal

### Performance Optimizations
1. Add React.memo for expensive components
2. Implement pagination for products and orders
3. Add database indexes on frequently queried columns
4. Use Redis for session storage (faster than MySQL)
5. Implement image optimization/lazy loading

---

**End of CLAUDE.md**

For questions or clarifications about this codebase, refer to:
- README.md for user-facing documentation
- This file (CLAUDE.md) for technical architecture
- Code comments for implementation details
