// require('dotenv').config();
// const express = require('express');
// const exphbs = require('express-handlebars');
// const session = require('express-session');
// const pgSession = require('connect-pg-simple')(session);
// const flash = require('connect-flash');
// const methodOverride = require('method-override');
// const path = require('path');
// const pg = require('pg');

// // Import models
// const db = require('./models');

// // Import routes
// const authRoutes = require('./routes/auth');
// const dashboardRoutes = require('./routes/dashboard');
// const bookRoutes = require('./routes/books');

// const app = express();

// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(methodOverride('_method'));
// app.use(express.static(path.join(__dirname, 'public')));

// // Session configuration
// const pgPool = new pg.Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
// });

// app.use(session({
//   store: new pgSession({
//     pool: pgPool,
//     tableName: 'session'
//   }),
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
// }));

// app.use(flash());

// // Handlebars configuration
// app.engine('ejs', exphbs.engine({
//   defaultLayout: 'main',
//   extname: '.ejs',
//   helpers: {
//     eq: (a, b) => a === b,
//     formatDate: (date) => {
//       return new Date(date).toLocaleDateString();
//     }
//   }
// }));
// app.set('view engine', 'ejs');

// // Global variables for templates
// app.use((req, res, next) => {
//   res.locals.user = req.session.user || null;
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error = req.flash('error');
//   next();
// });

// // Routes
// app.use('/auth', authRoutes);
// app.use('/dashboard', dashboardRoutes);
// app.use('/books', bookRoutes);

// // Home route
// app.get('/', (req, res) => {
//   if (req.session.user) {
//     res.redirect('/dashboard');
//   } else {
//     res.redirect('/auth/login');
//   }
// });

// // Database sync and server start
// const PORT = process.env.PORT || 3000;

// db.sequelize.sync({ force: false }).then(() => {
//   console.log('Database connected successfully');
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// }).catch(err => {
//   console.error('Unable to connect to database:', err);
// });

require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const pg = require('pg');

// Import models
const db = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const bookRoutes = require('./routes/books');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
const pgPool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

app.use(session({
  store: new pgSession({
    pool: pgPool,
    tableName: 'session',
    createTableIfMissing: true  // Add this line to auto-create the session table
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use(flash());

// Handlebars configuration
app.engine('ejs', exphbs.engine({
  defaultLayout: 'main',
  extname: '.ejs',
  helpers: {
    eq: (a, b) => a === b,
    formatDate: (date) => {
      return new Date(date).toLocaleDateString();
    }
  }
}));
app.set('view engine', 'ejs');

// Global variables for templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/books', bookRoutes);

// Home route
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/auth/login');
  }
});

// Database sync and server start
const PORT = process.env.PORT || 3000;

db.sequelize.sync({ force: false }).then(() => {
  console.log('Database connected successfully');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to database:', err);
});