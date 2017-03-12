'use strict';

const NapiBinding = require('../src/index');


exports.testNymulatorOnWin = function (test) {
    let napi = new NapiBinding(true),
        init = napi.jsonNapiConfigureD(__dirname + '/not-existent', NapiBinding.LogLevel.NORMAL, 9088, '127.0.0.1');

    napi.jsonNapiTerminateD();

    test.ok(init === NapiBinding.ConfigOutcome.CONFIGURATION_FILE_NOT_FOUND);
    test.done();
};

exports.testIgnoreNymulatorFlagOnWin = function (test) {
    let napi = new NapiBinding(false),
        init = napi.jsonNapiConfigureD(__dirname + '/not-existent', NapiBinding.LogLevel.NORMAL, 9088, '127.0.0.1');

    napi.jsonNapiTerminateD();

    test.ok(init === NapiBinding.ConfigOutcome.CONFIGURATION_FILE_NOT_FOUND);
    test.done();
};

exports.testNativeOnWin = function (test) {
    let napi = new NapiBinding(false),
        init = napi.jsonNapiConfigureD(__dirname, NapiBinding.LogLevel.NORMAL, 9089, '127.0.0.1');

    napi.jsonNapiTerminateD();

    test.ok(init === NapiBinding.ConfigOutcome.OKAY);
    test.done();
};

exports.testNativeByPortOnWin = function (test) {
    let napi = new NapiBinding(true),
        init = napi.jsonNapiConfigureD(__dirname, NapiBinding.LogLevel.NORMAL, 9089, '127.0.0.1');

    napi.jsonNapiTerminateD();

    test.ok(init === NapiBinding.ConfigOutcome.OKAY);
    test.done();
};