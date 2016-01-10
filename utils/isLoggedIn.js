'use strict';

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(302).redirect('/auth/login');
}

module.exports = isLoggedIn;
