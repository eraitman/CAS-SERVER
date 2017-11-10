var naverlib = require('../../libs/naverLibs.js');

exports.login = function(req,res){
    var api_url = naverlib.getLoginApiUrl(req, res);
    res.end("<a href='" + api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
}

exports.callback = function(req,res){
    var redirectURIafterSuccess = '/login/member/'
    naverlib.getCallbackASync(req,res,redirectURIafterSuccess);  
}

exports.member = function(req,res){
    var userInfo = naverlib.getUserInfo(req, res);
    
      if (userInfo != null) {
        var userInfoJson = JSON.parse(userInfo);
        //res.render('member', { name: bodyJson.response.name});  
        res.render('member', { name: userInfoJson.response.name });
      } else {
        res.end('뭔가이상하다' + body);
      }
}