module.exports = function(app){
  var controller = require('../controllers/login.controller');
  app.get('/login',controller.render);
}
