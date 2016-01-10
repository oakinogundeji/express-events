/**
*Module Dependencies
*/
var
  express = require('express'),
  UserUtils = require('../models/userutils');
//=============================================================================
/**
*Create Router instance
*/
var router = express.Router();
//=============================================================================
/**
*Module variables
*/
var
  findUser = UserUtils.findUser,
  viewAllUsers = UserUtils.viewAllUsers,
  updateUser = UserUtils.updateUser,
  deleteUser = UserUtils.deleteUser;
//=============================================================================
/**
*Routes
*/
router.get('/', function (req, res) {
  return req.app.emit('getRoot', req, res);
});
//---------------------------User API sub routes--------------------------------
router.get('/api/users', function (req, res, next) {
  return viewAllUsers(req, res, next);
});

router.route('/api/users/:email')
  .get(function (req, res, next) {
    return findUser(req, res, next);
  })
  .put(function (req, res, next) {
    return updateUser(req, res, next);
  })
  .delete(function (req, res, next) {
    return deleteUser(req, res, next);
  });
//=============================================================================
/**
*Export Module
*/
module.exports = router;
//=============================================================================
