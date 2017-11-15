
exports.render = function (req, res) {
    console.log("login 요청됨");
    if (!req.user) {
        console.log('사용자 인증이 안됨');
        res.render('login', { message: req.flash('loginMessage') });
        return;
    }
    console.log('사용자 인증이 됨');
    res.redirect('/main');
};

exports.login = function (req, res) {
    if (req.body.remenber) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
    }
    else {
        req.session.cookie.expires = false;
    }
    res.redirect('/main');
};

/*로그인 수정*/
//const DBPool = require('../../config/db_config.js');
// exports.login = function (req, res) {
//     var name = req.body.name;
//     var phone4 = req.body.phone4;

//     const resourcePromise = DBPool.acquire();
//     console.log("ㅇㅇ");
//     resourcePromise.then(function (client) {
//         var sql = `
//         select STUDENT_ID, STUDENT_NAME, PHONE_NO 
//           from tbm_cm_student 
//          where STUDENT_NAME like ?
//            AND PHONE_NO like ?
//            AND DEL_YN = 'N'
//            AND USE_YN = 'Y'
//         `
//         client.query(sql, ['%' + name + '%', '%' + phone4], function (err, result) {
//             // return object back to pool
//             if (result != 'undefined' && result.length == 1) {

//                 var userInfo =
//                 {
//                     name = result[0].STUDENT_NAME,
//                     id = result[0].STUDENT_ID            
//                 }

//                 client.query(`SELECT * FROM tbp_lm_attend_rslt WHERE STUDENT_ID = ?`, [userInfo.id], function (err2, result2) {
//                     DBPool.release(client);
//                     console.log("여기가 찍히느나?");
//                     var msg = name + ",님 반갑습니다.";                    
//                     res.send({ "result": true, "msg": msg });
//                 });

//             } else if (result != 'undefined' && result.length > 1) {
//                 DBPool.release(client);
//                 res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
//                 res.end("<h1>이런우연이! 동명이인이 있습니다.</h1>");
//             } else {
//                 DBPool.release(client);
//                 var msg = name + ",넌 누구냐?";

//                 //res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
//                 res.send({ "result": true, "msg": msg });
//             }

//         });
//     })
//         .catch(function (err) {
//             // handle error - this is generally a timeout or maxWaitingClients 
//             // error
//             res.end("Query Error: " + err);
//         });

// };
