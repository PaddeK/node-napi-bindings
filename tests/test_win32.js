'use strict';

exports.testNymulatorOnWin = function (test) {
    let napi = require('../src/index.js')(true),
        init = napi.jsonNapiConfigureD(__dirname + '/not-existent', napi.LogLevel.NORMAL, 9088, '127.0.0.1');

    test.ok(init === 2);
    test.done();
};

exports.testNoNymulatorOnWin = function (test) {
    let napi = require('../src/index.js')(false),
        init = napi.jsonNapiConfigureD(__dirname + '/not-existent', napi.LogLevel.NORMAL, 9089, '127.0.0.1');

    test.ok(init === 2);
    test.done();
};
