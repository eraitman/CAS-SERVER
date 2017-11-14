
var con = require('./config.js');
var genericPool = require('generic-pool');
var DbDriver = require('mysql');

/**
 * Step 1 - Create pool using a factory object
 */
const factory = {
    create: function () {
        return new Promise(function (resolve, reject) {
            var client = DbDriver.createConnection({
                host: 'localhost',
                port: '3306',
                user: 'cliffDev',
                password: 'skfk@akfTkal',
                database: 'CASDB'
            });
            client.connect(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Connected!");
                    resolve(client);
                }
            });
        });
    },
    destroy: function (client) {
        return new Promise(function (resolve) {
            client.on('end', function () {
                resolve();
            })
            client.disconnect();
        });
    }
}

var opts = {
    max: 10, // maximum size of the pool
    min: 2 // minimum size of the pool
}

var Pool = genericPool.createPool(factory, opts);

module.exports = Pool;
