module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define("orderItem", {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: { // Price at the time of purchase
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    });
    return OrderItem;
};