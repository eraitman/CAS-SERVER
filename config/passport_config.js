var LocalStrategy = require('passport-local').Strategy;
const util = require('../libs/util');
const DBPool = require('./db_config.js');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        console.log('serial', user);
        done(null, user.STUDENT_ID);
    });

    passport.deserializeUser(function (id, done) {
        const resourcePromise = DBPool.acquire();
        resourcePromise.then(function (client) {
            var sql = `
        select *
          from tbm_cm_student
         where STUDENT_ID = ?
           AND DEL_YN = 'N'
           AND USE_YN = 'Y'
        `
            client.query(sql, [id], function (err, rows) {
                DBPool.release(client);
                done(err, rows[0]);
            });
        });
    });

    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
            function (req, username, password, done) {
                const resourcePromise = DBPool.acquire();
                resourcePromise.then(function (client) {
                    var sql = `
        select *
          from tbm_cm_student
         where STUDENT_NAME = ?
           AND DEL_YN = 'N'
           AND USE_YN = 'Y'
        `;

                    client.query(sql, [username], function (err, rows) {
                        DBPool.release(client);
                        if (err) {
                            return done(err);
                        }
                        if (!rows.length) {
                            return done(null, false, req.flash('loginMessage', 'No User found'));
                        }

                        if (util.Right(rows[0].PHONE_NO,4) != password) {
                            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password'));
                        }
                        return done(err, rows[0]);
                    });
                });
            })
    )
}

