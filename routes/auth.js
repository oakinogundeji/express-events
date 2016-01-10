'use strict';
/**
*Export Module
*/
module.exports = function (passport) {
  //==============================================================================

  /**
  *Module Dependencies
  */
  var
    express = require('express'),
    UserUtils = require('../models/userutils');
  //==============================================================================
  /**
  *Create Router instance
  */
  var router = express.Router();
  //==============================================================================
  /**
  *Module variables
  */
  var
    isLoggedIn = require('../utils/isLoggedIn'),
    findUser = UserUtils.findUser,
    viewAllUsers = UserUtils.viewAllUsers,
    updateUser = UserUtils.updateUser,
    deleteUser = UserUtils.deleteUser;
  //==============================================================================
  /**
  *Middleware
  */
  router.use(passport.initialize());
  router.use(passport.session());
  //==============================================================================
  /**
  *Routes
  */
  router.route('/login')
    .get(function (req, res) {
      return res.app.emit('getLogin', req, res);
    })
    .post(function(req, res, next) {
      passport.authenticate('local-login', function(err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        if (!user) {
          return res.app.emit('failedLogin', req, res, info);
        }
        req.login(user, function(err){
          if(err){
            console.error(err);
            return next(err);
          }
          return res.status(302).redirect('/auth/dashboard');
        });
      })(req, res, next);
    });

  router.route('/signup')
    .get(function (req, res) {
      return res.app.emit('getSignup', req, res);
    })
    .post(function(req, res, next) {
      passport.authenticate('local-signup', function(err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        if (!user) {
          return res.app.emit('failedSignup', req, res, info);
        }
        req.login(user, function(err){
          if(err){
            console.error(err);
            return next(err);
          }
          return res.status(302).redirect('/auth/dashboard');
        });
      })(req, res, next);
    });

  router.get('/dashboard', isLoggedIn, function (req, res, next) {
    var
      user = req.user,
      profile = {
        local: {
          username: user.local.username,
          email: user.local.email
        },
        fb: {
          displayName: user.social.fb.displayName,
          email: user.social.fb.email,
          accessToken: user.social.fb.token
        },
        twitter: {
          displayName: user.social.twitter.displayName,
          handle: user.social.twitter.handle,
          location: user.social.twitter.metaData.location,
          description: user.social.twitter.metaData.description
        },
        photo: user.social.twitter.photo || user.social.fb.photo,
        acctLinkStatus: function () {
          var
            localLink = 'not linked',
            fbLink = 'not linked',
            twitterLink = 'not linked';
          if(this.local.email) {
            localLink = 'linked';
          }
          if(this.fb.displayName) {
            fbLink = 'linked';
          }
          if(this.twitter.displayName) {
            twitterLink = 'linked';
          }
          return {
            local: localLink,
            fb: fbLink,
            twitter: twitterLink
          };
        }
      },
      person = profile.local.username || profile.fb.displayName || profile.twitter.displayName,
      local = profile.local,
      facebook = profile.fb,
      twitter = profile.twitter,
      currentProfile = function getCurrentProfile() {
        if(local.email) {
          return 'local';
        }
        if(facebook.displayName) {
          return 'facebook';
        }
        return 'twitter';
      }(),
      linkStatus = profile.acctLinkStatus();
    res.app.locals.profile = profile;
    res.app.locals.person = person;
    return res.app.emit('getDashboard', req, res, {
      user: profile,
      currentProfile: currentProfile,
      person: person,
      linkStatus: linkStatus
    });
  });

  router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    return res.redirect('/');
  });
  //---------------------------OAuth Routes---------------------------------------
  router.get('/twitter', passport.authenticate('twitter'));
  router.get('/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect : '/auth/dashboard',
        failureRedirect : '/auth/login'
    })
  );

  router.get('/facebook', passport.authenticate('facebook', {scope: 'user_posts'}));
  router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/auth/dashboard',
        failureRedirect : '/auth/login'
    })
  );
  //==============================================================================
  return router;
};
