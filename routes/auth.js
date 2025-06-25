const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { redirectIfAuth } = require('../middleware/auth');

// Validation rules
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
];

// Routes
router.get('/login', redirectIfAuth, authController.showLogin);
router.get('/register', redirectIfAuth, authController.showRegister);
router.post('/login', redirectIfAuth, loginValidation, authController.login);
router.post('/register', redirectIfAuth, registerValidation, authController.register);
router.get('/verify/:token', authController.verifyEmail);
router.post('/logout', authController.logout);

module.exports = router;