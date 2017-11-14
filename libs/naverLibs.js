var express = require('express');
var app = express();

var client_id = '4vuRMig8p9KUfvARalLF';
var client_secret = 'UpFNnQGkhi';
var state = 'RANDOM_STATE';
var redirectURI = encodeURI("http://localhost:3000/login/callback");
var api_url = "";

function generateRandomState() {
    var stat_str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); });
    return stat_str;
}

exports.getLoginApiUrl = function (req, res) {

    if (req.session.state) {
        state = req.session.state;
    } else {
        state = generateRandomState();
        req.session.state = state;
    }

    api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
    return api_url;
    /*   res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
      res.end("<a href='" + api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
    */
}

///Sync방식으로 return이 있어서 biz로직을 route에서 처리
exports.getCallbackSync = function (req, res) {
    code = req.query.code;
    state = req.query.state;
    var storedstate = req.session.state;
    if (state != storedstate) {
        console.log("state가 다르다~!" + state + ":" + storedstate);
    } else {
        console.log("state가 같다~!");
    }

    api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
        + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;

    var request = require('sync-request');
    var options = {
        url: api_url,
        headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
    };

    var resToken = request('GET', api_url, options);
    return resToken.getBody();

}

///Async 방식으로, route정보가 포함 됨.
exports.getCallbackASync = function (req, res, redirectURIafterSuccess) {
    code = req.query.code;
    state = req.query.state;
    var storedstate = req.session.state;
    if (state != storedstate) {
        console.log("state가 다르다~!" + state + ":" + storedstate);
    } else {
        console.log("state가 같다~!");
    }

    api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
        + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;

    var request = require('sync-request');
    var options = {
        url: api_url,
        headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
    };

    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
            res.end(body);
            /*biz 로직 : 로그인 후에, member로 리다이렉트 시킨다 */
            var bodyJson = JSON.parse(body);
            var accessToken = bodyJson.access_token;
            var refreshToken = bodyJson.refresh_token;
            req.session.accessToken = accessToken;
            req.session.refreshToken = refreshToken;
            res.redirect(redirectURIafterSuccess);

        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });

}

exports.getUserInfo = function (req, res) {

    var token = req.session.accessToken;
    var header = "Bearer " + token; // Bearer 다음에 공백 추가
    var api_url = 'https://openapi.naver.com/v1/nid/me';
    var request = require('sync-request');
    var options = {
        url: api_url,
        headers: { 'Authorization': header }
    };
    var resToken = request('GET', api_url, options);
    return resToken.getBody();

    /* request.get(options, function (error, response, body) {
         if (!error && response.statusCode == 200) {
             res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
             if(body !=null)
             {
               var bodyJson = JSON.parse(body);
               //res.render('member', { name: bodyJson.response.name});  
               res.render('member', { name: 'Express' });
             }else
             {
               res.end('뭔가이상하다' + body);
             }
 
         } else {
             console.log('error');
             if (response != null) {
                 res.status(response.statusCode).end();
                 console.log('error = ' + response.statusCode);
                 
           
             }
         }
     });
     */
    return returnValue;
}