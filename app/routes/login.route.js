module.exports = function (app, passport) {
  var controller = require('../controllers/login.controller');
  app.get('/login', controller.render);
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/main',
    failureRedirect: '/login',
    failureFlash: true
  }), controller.login);
};
