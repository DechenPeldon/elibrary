const { validationResult } = require('express-validator');
const crypto = require('crypto');
const { User } = require('../models');
const { sendVerificationEmail } = require('../utils/email');

class AuthController {
  // Show login page
  showLogin(req, res) {
    res.render('auth/login', {
      title: 'Login - E-Library',
      layout: 'main'
    });
  }

  // Show register page
  showRegister(req, res) {
    res.render('auth/register', {
      title: 'Register - E-Library',
      layout: 'main'
    });
  }

  // Handle login
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error_msg', errors.array()[0].msg);
        return res.redirect('/auth/login');
      }

      const { email, password } = req.body;
      
      const user = await User.findOne({ where: { email } });
      if (!user) {
        req.flash('error_msg', 'Invalid email or password');
        return res.redirect('/auth/login');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        req.flash('error_msg', 'Invalid email or password');
        return res.redirect('/auth/login');
      }

      if (!user.isVerified) {
        req.flash('error_msg', 'Please verify your email before logging in');
        return res.redirect('/auth/login');
      }

      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };

      req.flash('success_msg', 'Welcome back!');
      res.redirect('/dashboard');
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Server error occurred');
      res.redirect('/auth/login');
    }
  }

  // Handle register
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error_msg', errors.array()[0].msg);
        return res.redirect('/auth/register');
      }

      const { name, email, password } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        req.flash('error_msg', 'Email already registered');
        return res.redirect('/auth/register');
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        verificationToken
      });

      // Send verification email
      await sendVerificationEmail(email, verificationToken);

      req.flash('success_msg', 'Registration successful! Please check your email to verify your account.');
      res.redirect('/auth/login');
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Server error occurred');
      res.redirect('/auth/register');
    }
  }

  // Handle email verification
  async verifyEmail(req, res) {
    try {
      const { token } = req.params;
      
      const user = await User.findOne({ where: { verificationToken: token } });
      if (!user) {
        req.flash('error_msg', 'Invalid verification token');
        return res.redirect('/auth/login');
      }

      user.isVerified = true;
      user.verificationToken = null;
      await user.save();

      req.flash('success_msg', 'Email verified successfully! You can now login.');
      res.redirect('/auth/login');
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Server error occurred');
      res.redirect('/auth/login');
    }
  }

  // Handle logout
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      res.redirect('/auth/login');
    });
  }
}

module.exports = new AuthController();