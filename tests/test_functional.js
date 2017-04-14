'use strict';

const NapiBinding = require('../src/index');

// This test requires a running Nymulator to pass!
exports.testFunctional = function (test) {
    let napi = new NapiBinding(true);

    try {
        let init, put, get;

        init = napi.napiConfigure('testnea', '.', '{}', NapiBinding.LogLevel.NONE, 9088, '127.0.0.1');

        test.equal(init, NapiBinding.ConfigOutcome.OKAY);

        put = napi.napiPut({path: 'info/get'});

        test.equal(put, NapiBinding.PutOutcome.OKAY);

        get = napi.napiGet();

        test.equal(get.outcome, NapiBinding.GetOutcome.OKAY);
        test.notEqual(get.json, '');
    } catch(err) {
        test.ok(false, err);
    } finally {
        napi.napiTerminate();
        test.expect(4);
        test.done();
    }
};