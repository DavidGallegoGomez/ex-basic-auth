const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports.register = (req, res, next) => {
  res.render('auth/register');
}

module.exports.doRegister = (req, res, next) => {

  function renderWithErrors(errors) {
    res.render('auth/register', {
      user: req.body,
      errors: errors
    })
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        renderWithErrors({ email: 'Email already registered'})
      } else {
        user = new User(req.body);
        return user.save()
          .then(user => res.redirect('/login'))
      }
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        renderWithErrors(error.errors)
      } else {
        next(error);
      }
    });
}

module.exports.login = (req, res, next) => {
  res.render('auth/login');
}

module.exports.doLogin = (req, res, next) => {

  function renderWithErrors(errors) {
    res.render('auth/login', {
      user: req.body,
      errors: errors
    })
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        renderWithErrors({ password: 'Invalid email or password'})
      } else {
        return user.checkPassword(req.body.password)
          .then(match => {
            if (!match) {
              renderWithErrors({ password: 'Invalid email or password'})
            } else {
              req.session.user = user;
              res.redirect('/users');
            }
          })
      }
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        renderWithErrors(error.errors)
      } else {
        next(error);
      }
    });
}

module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect('/login');
}
