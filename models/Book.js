const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 200]
    }
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  publishedYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1000,
      max: new Date().getFullYear()
    }
  },
  availableCopies: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 0
    }
  },
  totalCopies: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'books',
  timestamps: true
});

module.exports = Book;