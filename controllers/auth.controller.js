const mongoose = require('mongoose');
const User = require('../models/user.model');
const passport = require('passport');

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
  passport.authenticate('local-auth', (error, user, validation) => {
    if (error) {
      next(error);
    } else if (!user) {
      res.render('auth/login', {
        user: req.body,
        errors: validation
      })
    } else {
      return req.login(user, (error) => {
        if (error) {
          next(error)
        } else {
          res.redirect('/users')
        }
      })
    }
  })(req, res, next);
}

module.exports.loginWithIDPCallback = (req, res, next) => {
  const { idp } = req.params; 
  passport.authenticate(`${idp}-auth`, (error, user) => {
    if (error) {
      next(error);
    } else {
      req.login(user, (error) => {
        if (error) {
          next(error)
        } else {
          res.redirect('/users');
        }
      })
    }
  })(req, res, next);
}

module.exports.profile = (req, res, next) => {
  res.render('auth/profile'); // Ya se tiene el usuario con 'locals', NO hay que pasarlo por hbs
}

module.exports.doProfile = (req, res, next) => {
  delete req.body.email; // Se quitan para no mostrar ni editar (PROGRAMACIÓN DEFENSIVA)
  delete req.body.role; // Si los necesitamos ya están en la sesión
  if (!req.body.password) { // El string va vacío y no se debería cambiar la contraseña
    delete req.body.password; // Se elimina para no cambiar el password
  }

  if (req.file) {
    req.body.avatarURL = req.file.secure_url;
  }

  const user = req.user; // Se puede buscar en MongoDB pero ya tenemos al usuario en la sesión
  Object.assign(user, req.body);
  user.save() // Es más optimo que findAndUpdate()
    .then(user => res.redirect('/profile'))
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render('auth/profile', {
          user: req.body,
          errors: error.errors
        })
      } else {
        next(error);
      }
    });
}

module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/login');
}
