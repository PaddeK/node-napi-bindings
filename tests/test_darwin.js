'use strict';

const NapiBinding = require('../src/index.js');

exports.testNymulatorOnMac = function (test) {
    let napi = new NapiBinding(true),
        init = napi.napiConfigure('testnea', '#', '{', NapiBinding.LogLevel.NONE, 9088, '127.0.0.1');

    napi.napiTerminate();

    test.equal(init, NapiBinding.ConfigOutcome.INVALID_PROVISION_JSON);
    test.expect(1);
    test.done();
};

exports.testNativeOnMac = function (test) {
    let napi = new NapiBinding(false),
        init = napi.napiConfigure('testest', '#', '{}', NapiBinding.LogLevel.NONE, 9088, '127.0.0.1');

    napi.napiTerminate();

    test.equal(init, NapiBinding.ConfigOutcome.OKAY);
    test.expect(1);
    test.done();
};

exports.testNativeOnMacWithDefaultPort = function (test) {
    let napi = new NapiBinding(false),
        init = napi.napiConfigure('testest', '#', '{}', NapiBinding.LogLevel.NONE);

    napi.napiTerminate();

    test.equal(init, NapiBinding.ConfigOutcome.OKAY);
    test.expect(1);
    test.done();
};