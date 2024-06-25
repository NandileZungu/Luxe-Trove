const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const exphbs = require('express-handlebars');
const keys = require('./config/keys');
const authController = require('./controllers/authController');
const { ensureAuthenticated, forwardAuthenticated } = require('./config/auth');

const app = express();
console.log('Express app initialized');

app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
console.log('Handlebars setup complete');

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
console.log('Express session initialized');

app.use(passport.initialize());
app.use(passport.session());
console.log('Passport middleware initialized');

app.use(flash());
console.log('Flash middleware initialized');

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
console.log('Global variables setup complete');

try {
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
console.log('Routes initialized');
} catch (err) {
  console.error('Error initializing routes:', err);
}

mongoose.connect(keys.MongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

