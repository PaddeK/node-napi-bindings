'use strict';

const NapiBinding = require('../src/index');

exports.testNymulatorOnWin = function (test) {
    let napi = new NapiBinding(true),
        init = napi.napiConfigure('testnea', '#', '{', NapiBinding.LogLevel.NONE, 9088, '127.0.0.1');

    napi.napiTerminate();

    test.equal(init, NapiBinding.ConfigOutcome.INVALID_PROVISION_JSON);
    test.expect(1);
    test.done();
};

exports.testIgnoreNymulatorFlagOnWin = function (test) {
    let napi = new NapiBinding(false),
        init = napi.napiConfigure('tes', '#', '{}', NapiBinding.LogLevel.NONE, 9088, '127.0.0.1');

    napi.napiTerminate();

    test.equal(init, NapiBinding.ConfigOutcome.FAILED_TO_INIT);
    test.expect(1);
    test.done();
};

exports.testNativeOnWin = function (test) {
    let napi = new NapiBinding(false),
        init = napi.napiConfigure('testest', '#', '{}', NapiBinding.LogLevel.NONE, 9089, '127.0.0.1');

    napi.napiTerminate();

    test.equal(init, NapiBinding.ConfigOutcome.OKAY);
    test.expect(1);
    test.done();
};

exports.testNativeByPortOnWin = function (test) {
    let napi = new NapiBinding(true),
        init = napi.napiConfigure('testest', '#', '{}', NapiBinding.LogLevel.NONE, 9089, '127.0.0.1');

    napi.napiTerminate();

    test.equal(init, NapiBinding.ConfigOutcome.OKAY);
    test.expect(1);
    test.done();
};