/**
*Declare Renderer Handlers
*/
function renderRoot(req, res) {
  return res.status(200).render('pages/index');
}

function renderLogin(req, res) {
  return res.status(200).render('pages/login');
}

function renderFailedLogin(req, res, data) {
  return res.status(409).render('pages/login', data);
}

function renderSignup(req, res) {
  res.status(200).render('pages/signup');
}

function renderFailedSignup(req, res, data) {
  return res.status(409).render('pages/signup', data);
}

function renderDashboard(rerq, res, data) {
  return res.render('pages/dashboard', data);
}
//=============================================================================
/**
*Export Module
*/
module.exports = {
  root: renderRoot,
  login: renderLogin,
  failedLogin: renderFailedLogin,
  signup: renderSignup,
  failedSignup: renderFailedSignup,
  dashboard: renderDashboard
};
//=============================================================================
