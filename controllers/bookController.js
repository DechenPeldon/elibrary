const { validationResult } = require('express-validator');
const { Book, User } = require('../models');

class BookController {
  // Show all books
  async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const { count, rows: books } = await Book.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          as: 'user',
          attributes: ['name']
        }]
      });

      const totalPages = Math.ceil(count / limit);

      res.render('books/index', {
        title: 'Books - E-Library',
        books,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error loading books');
      res.redirect('/dashboard');
    }
  }

  // Show add book form
  showAdd(req, res) {
    res.render('books/add', {
      title: 'Add Book - E-Library'
    });
  }

  // Handle add book
  async add(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error_msg', errors.array()[0].msg);
        return res.redirect('/books/add');
      }

      const { title, author, isbn, genre, description, publishedYear, totalCopies } = req.body;

      await Book.create({
        title,
        author,
        isbn: isbn || null,
        genre: genre || null,
        description: description || null,
        publishedYear: publishedYear || null,
        totalCopies: parseInt(totalCopies) || 1,
        availableCopies: parseInt(totalCopies) || 1,
        userId: req.session.user.id
      });

      req.flash('success_msg', 'Book added successfully');
      res.redirect('/books');
    } catch (error) {
      console.error(error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        req.flash('error_msg', 'ISBN already exists');
      } else {
        req.flash('error_msg', 'Error adding book');
      }
      res.redirect('/books/add');
    }
  }

  // Show edit book form
  async showEdit(req, res) {
    try {
      const book = await Book.findByPk(req.params.id);
      if (!book) {
        req.flash('error_msg', 'Book not found');
        return res.redirect('/books');
      }

      res.render('books/edit', {
        title: 'Edit Book - E-Library',
        book
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error loading book');
      res.redirect('/books');
    }
  }

  // Handle edit book
  async edit(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error_msg', errors.array()[0].msg);
        return res.redirect(`/books/edit/${req.params.id}`);
      }

      const book = await Book.findByPk(req.params.id);
      if (!book) {
        req.flash('error_msg', 'Book not found');
        return res.redirect('/books');
      }

      const { title, author, isbn, genre, description, publishedYear, totalCopies } = req.body;

      await book.update({
        title,
        author,
        isbn: isbn || null,
        genre: genre || null,
        description: description || null,
        publishedYear: publishedYear || null,
        totalCopies: parseInt(totalCopies),
        availableCopies: Math.min(book.availableCopies, parseInt(totalCopies))
      });

      req.flash('success_msg', 'Book updated successfully');
      res.redirect('/books');
    } catch (error) {
      console.error(error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        req.flash('error_msg', 'ISBN already exists');
      } else {
        req.flash('error_msg', 'Error updating book');
      }
      res.redirect(`/books/edit/${req.params.id}`);
    }
  }

  // Handle delete book
  async delete(req, res) {
    try {
      const book = await Book.findByPk(req.params.id);
      if (!book) {
        req.flash('error_msg', 'Book not found');
        return res.redirect('/books');
      }

      await book.destroy();
      req.flash('success_msg', 'Book deleted successfully');
      res.redirect('/books');
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error deleting book');
      res.redirect('/books');
    }
  }
}

module.exports = new BookController();