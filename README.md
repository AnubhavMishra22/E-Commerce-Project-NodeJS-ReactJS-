# QuantumCart - E-commerce Platform

[![Netlify Status](https://api.netlify.com/api/v1/badges/b33424ed-1edc-419c-a57f-42bf66b5cb12/deploy-status)](https://app.netlify.com/projects/quantumcart/deploys)

A modern e-commerce platform built with React frontend and Node.js backend with MySQL database.

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

4. **Configure Database**
   - Create a MySQL database named `ecommerce_db`
   - Update database credentials in `backend/config/database.js`

5. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```

6. **Start Frontend Development Server**
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
ecommerce-app/
├── frontend/          # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Node.js server
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── server.js
├── netlify.toml      # Netlify configuration
└── README.md
```

## 🔧 Configuration

### Database Configuration
Update `backend/config/database.js` with your MySQL credentials:
```javascript
module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "your_password",
    DB: "ecommerce_db",
    dialect: "mysql"
};
```

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