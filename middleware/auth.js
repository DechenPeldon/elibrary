const requireAuth = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    req.flash('error_msg', 'Please login to access this page');
    res.redirect('/auth/login');
  }
};

const requireAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  } else {
    req.flash('error_msg', 'Access denied. Admin privileges required.');
    res.redirect('/dashboard');
  }
};

const redirectIfAuth = (req, res, next) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    next();
  }
};

module.exports = {
  requireAuth,
  requireAdmin,
  redirectIfAuth
};