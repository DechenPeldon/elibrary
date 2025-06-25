const sequelize = require('../config/database');
const User = require('./user');
const Book = require('./Book');

// Define associations
User.hasMany(Book, { foreignKey: 'userId', as: 'books' });
Book.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Book
};