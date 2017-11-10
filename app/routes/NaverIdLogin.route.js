module.exports = function(app){
  var controller = require('../controllers/login.controller');
  app.get('/login',controller.login);
  app.get('/login/callback',controller.callback);
  app.get('/login/member',controller.member);
}


