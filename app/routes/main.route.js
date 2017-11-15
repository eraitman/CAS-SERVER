module.exports = function(app, passport){
  
  var con = require('../controllers/main.controller');
  app.get('/main',con.render);

  app.post('/main/req',con.req);
}
