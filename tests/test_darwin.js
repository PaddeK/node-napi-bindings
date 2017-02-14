'use strict';

exports.testNymulatorOnMac = function (test) {
    let napi = require('../src/index.js')(true),
        init = napi.jsonNapiConfigureD(__dirname + '/not-existent', napi.LogLevel.NORMAL, 9088, '127.0.0.1');

    test.ok(init === 2);
    test.done();
};

exports.testNoNymulatorOnMac = function (test) {
    let napi = require('../src/index.js')(false),
        init = napi.jsonNapiConfigureD(__dirname, napi.LogLevel.NORMAL, 9088, '127.0.0.1');

    test.ok(init === 0);
    test.done();
};