const { Book, User } = require('../models');

class DashboardController {
  async index(req, res) {
    try {
      const totalBooks = await Book.count();
      const totalUsers = await User.count();
      const recentBooks = await Book.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          as: 'user',
          attributes: ['name']
        }]
      });

      res.render('dashboard/index', {
        title: 'Dashboard - E-Library',
        totalBooks,
        totalUsers,
        recentBooks
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error loading dashboard');
      res.redirect('/');
    }
  }
}

module.exports = new DashboardController();