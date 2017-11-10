module.exports = function(app){
  var controller = require('../controllers/index.controller');
  app.get('/',controller.render);
}
