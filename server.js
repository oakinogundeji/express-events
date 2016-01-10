/**
*Module Dependencies
*/
var
  http = require('http'),
  app = require('./app');
//=============================================================================
/**
*Create Server instance
*/
var server = http.createServer(app);
//=============================================================================
/**
*Module variables
*/
var
  port = app.get('port');
//=============================================================================
/**
*Bind to port
*/
server.listen(port, function () {
  console.log('xpress-events seerver listening on port',port);
});
//=============================================================================
/**
*Conditionally export for testing
*/
if(require.main != module) {
  module.exports = server;
}
//=============================================================================
