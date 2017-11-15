module.exports = function(app, passport){
  var controller = require('../controllers/index.controller');
  app.get('/',controller.render);
}
