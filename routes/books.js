const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { requireAuth } = require('../middleware/auth');

// Validation rules
const bookValidation = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('author').trim().isLength({ min: 1, max: 100 }).withMessage('Author is required and must be less than 100 characters'),
  body('isbn').optional().trim().isLength({ max: 20 }).withMessage('ISBN must be less than 20 characters'),
  body('publishedYear').optional().isInt({ min: 1000, max: new Date().getFullYear() }).withMessage('Please enter a valid year'),
  body('totalCopies').isInt({ min: 1 }).withMessage('Total copies must be at least 1')
];

// Routes
router.get('/', requireAuth, bookController.index);
router.get('/add', requireAuth, bookController.showAdd);
router.post('/add', requireAuth, bookValidation, bookController.add);
router.get('/edit/:id', requireAuth, bookController.showEdit);
router.put('/edit/:id', requireAuth, bookValidation, bookController.edit);
router.delete('/:id', requireAuth, bookController.delete);

module.exports = router;