'use strict';

const   nodeunit = require('nodeunit'),
        fs = require('fs');

nodeunit.reporters.default.run([__filename]);

exports.testNymulator = function (test) {
    let napi = require('../src/index.js')(true),
        init = napi.jsonNapiConfigureD(__dirname + '/not-existent', napi.LogLevel.NORMAL, 9088, '127.0.0.1');

    test.ok(init === 2);
    test.done();
};

exports.testNoNymulator = function (test) {
    let napi = require('../src/index.js')(false),
        init = napi.jsonNapiConfigureD(__dirname, napi.LogLevel.NORMAL, 9088, '127.0.0.1');

    test.ok(init === 0);

    fs.unlinkSync(__dirname + '/ncl.log');
    fs.unlinkSync(__dirname + '/provisions.json');

    test.done();
};