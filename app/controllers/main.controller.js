const DBPool = require('../../config/db_config');
const util = require('../../libs/util');
exports.render = function (req, res) {
    console.log("main 요청됨");
    if (!req.user) {
        console.log('사용자 인증이 안됨');
        res.redirect('/login');
        return;
    }
    console.log('사용자 인증이 됨');
    res.render('main', { user: req.user });

};

exports.req = function (req, res) {
    console.log('교차/결석신청');
    console.log(req);
    const resourcePromise = DBPool.acquire();
    resourcePromise.then(function (client) {

        var lessonNumber = req.body.lessonNumber;
        var clz = lessonNumber.substr(0, 1);
        var lessonNum = lessonNumber.substr(1, lessonNumber.length - 1).lpad(2, '0');
        var ScheduleId = makeScheduleId(req.user.STUDENT_ID, clz, lessonNum);

        var sql =
        `SELECT max(REQ_SEQ) as MAX_REQ_SEQ from tbd_lm_attend_chg where STUDENT_ID = ? and SCHEDULE_ID = ? and LESSON_NO = ?`;

        client.query(sql, [req.user.STUDENT_ID, ScheduleId, lessonNum.toString()], function (err, rows) {
            console.log("번호찾기 완료");
            if (err) console.log(err.sql);
            var maxReqSeq = ""+ (parseInt(rows[0].MAX_REQ_SEQ,10) + 1);
            
            var sql2 = `
        INSERT INTO tbd_lm_attend_chg
        (STUDENT_ID,SCHEDULE_ID,LESSON_NO,REQ_SEQ,REQ_TYPE,FROM_SCHEDULE_ID,TO_SCHEDULE_ID,REQ_DT,APRV_STATUS,APRV_DT,FST_REG_DT,FST_REGER_ID,FNL_UPD_DT,FNL_UPDER_ID,DEL_YN,USE_YN)
        VALUES ?      
        `;
            var tbd_lm_attend_chg =
                [[req.user.STUDENT_ID, ScheduleId, lessonNum, maxReqSeq, 'ABS', null, null, util.newDate(), 'R', null, util.newDate(), req.user.STUDENT_ID, util.newDate(), req.user.STUDENT_ID, 'N', 'Y']];

            client.query(sql2, [tbd_lm_attend_chg], function (err, rows) {

                DBPool.release(client);
                console.log("완료됨");
                if (err) console.log(err);
                res.redirect('/');

            });
        });
    });
}

function makeScheduleId(studentId, clz, lessonNum) {
    var ScheduleId = studentId.substr(0, 5) + clz + lessonNum.lpad(2, '0');
    return ScheduleId;

    // const resourcePromise = DBPool.acquire();
    // resourcePromise.then(function (client) {
    //     var sql = `
    //     SELECT 
    //     cls.class_Year, cls.CLASS_QUARTER, cls.CLASS_GROUP
    // FROM
    //     tbm_cm_student stu,
    //     tbp_cm_student_class stucls,
    //     tbm_cm_class cls
    // WHERE
    //     stu.STUDENT_ID = ?
    //         AND stucls.STUDENT_ID = stu.STUDENT_ID
    //         AND (stucls.STUDENT_ID , stucls.CLASS_TERM, stucls.NO) IN (SELECT 
    //             STUDENT_ID, CLASS_TERM, MAX(NO)
    //         FROM
    //             tbp_cm_student_class subcls
    //         WHERE
    //             subcls.STUDENT_ID = stucls.STUDENT_ID
    //                 AND subcls.CLASS_TERM = stucls.CLASS_TERM)
    //         AND stucls.CLASS_TERM = cls.CLASS_TERM
    //         AND stucls.CLASS_ID = cls.CLASS_ID
    //         AND stu.DEL_YN = 'N'
    //         AND stucls.DEL_YN = 'N'
    //         AND cls.DEL_YN = 'N'
    //         AND stu.USE_YN = 'Y'
    //         AND stucls.USE_YN = 'Y'
    //         AND cls.USE_YN = 'Y'
    //     `

    //     client.query(sql, [studentId], function (err, rows) {
    //         if(err) console.log(err);
    //         var returnValue = rows[0].CLASS_YEAR + rows[0].CLASS_QUARTER + clz +  lessonNum
}

String.prototype.lpad = function (padLength, padString) {
    var s = this;
    while (s.length < padLength) { s = padString + s };
    return s;
}