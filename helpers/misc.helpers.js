const hbs = require('hbs');

hbs.registerHelper('isActive', (path, exp, exact, options) => {
  if (exact) {
    if (path === exp) {
      return options.fn(this);
    }
  } else {
    if (path.contains(exp)) {
      return options.fn(this);
    }
  }
  return options.inverse(this);
})