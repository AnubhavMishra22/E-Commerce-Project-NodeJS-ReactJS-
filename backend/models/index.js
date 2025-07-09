// Initializes Sequelize and imports all model definitions.
const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database.js');

// Create a Sequelize instance
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user.model.js')(sequelize, Sequelize);
db.Product = require('./product.model.js')(sequelize, Sequelize);
db.Order = require('./order.model.js')(sequelize, Sequelize);
db.OrderItem = require('./orderItem.model.js')(sequelize, Sequelize);

// --- Define Associations ---

// User-Order Association (One-to-Many)
db.User.hasMany(db.Order);
db.Order.belongsTo(db.User);

// Order-OrderItem Association (One-to-Many)
db.Order.hasMany(db.OrderItem);
db.OrderItem.belongsTo(db.Order);

// Product-OrderItem Association (One-to-Many)
db.Product.hasMany(db.OrderItem);
db.OrderItem.belongsTo(db.Product);

module.exports = db;

// =================================================================
// >> USER MODEL (models/user.model.js)
// =================================================================

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    // Hook: Automatically hashes the password before a user is created.
    User.beforeCreate(async (user, options) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    });

    // Instance Method: To validate a password during login.
    User.prototype.validPassword = async function(password) {
        return await bcrypt.compare(password, this.password);
    };

    return User;
};