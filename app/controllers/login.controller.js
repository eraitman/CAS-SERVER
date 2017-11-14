const DBPool = require('../../config/db_config.js');

exports.render = function (req, res) {
    res.render('login');
};

exports.login = function (req, res) {
    var name = req.body.name;
    var phone4 = req.body.phone4;

    const resourcePromise = DBPool.acquire();
    console.log("ㅇㅇ");
    resourcePromise.then(function (client) {
        var sql = `
        select STUDENT_ID, STUDENT_NAME, PHONE_NO 
          from tbm_cm_student 
         where STUDENT_NAME like ?
           AND PHONE_NO like ?
           AND DEL_YN = 'N'
           AND USE_YN = 'Y'
        `
        client.query(sql, ['%' + name + '%', '%' + phone4], function (err, result) {
            // return object back to pool
                      if (result != 'undefined' && result.length == 1) {
                res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
                var rslt = result;
                client.query(`SELECT * FROM tbp_lm_attend_rslt WHERE STUDENT_ID = ?`, [rslt[0].STUDENT_ID], function (err2, result2) {
                    DBPool.release(client);
                    //T
                    res.end(rslt[0].STUDENT_NAME + "님, 반갑습니다." + JSON.stringify(result2));
                });

            } else if (result != 'undefined' && result.length > 1) {
                DBPool.release(client);
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                res.end("<h1>이런우연이! 동명이인이 있습니다.</h1>");
            } else {
                DBPool.release(client);
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                res.end("<h1>넌 누구냐?</h1>");
            }

        });
    })
        .catch(function (err) {
            // handle error - this is generally a timeout or maxWaitingClients 
            // error
            res.end("Query Error: " + err);
        });

};
