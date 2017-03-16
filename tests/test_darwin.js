'use strict';

const NapiBinding = require('../src/index.js');

exports.testNymulatorOnMac = function (test) {
    let napi = new NapiBinding(true),
        init = napi.jsonNapiConfigureD(__dirname + '/not-existent', NapiBinding.LogLevel.NORMAL, 9088, '127.0.0.1');

    napi.jsonNapiTerminateD();

    test.equal(init, NapiBinding.ConfigOutcome.CONFIGURATION_FILE_NOT_FOUND);
    test.expect(1);
    test.done();
};

exports.testNativeOnMac = function (test) {
    let napi = new NapiBinding(false),
        init = napi.jsonNapiConfigureD(__dirname, NapiBinding.LogLevel.NORMAL, 9088, '127.0.0.1');

    test.equal(init, NapiBinding.ConfigOutcome.OKAY);
    test.expect(1);
    test.done();
};

exports.testNativeOnMacWithDefaultPort = function (test) {
    let napi = new NapiBinding(false),
        init = napi.jsonNapiConfigureD(__dirname, NapiBinding.LogLevel.NORMAL);

    test.equal(init, NapiBinding.ConfigOutcome.OKAY);
    test.expect(1);
    test.done();
};