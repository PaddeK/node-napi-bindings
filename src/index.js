'use strict';

var FFI = require('ffi'),
    Struct = require('ref-struct'),
    NapiReturn = new Struct({
        message: 'string',
        outcome: 'int',
        quit: 'bool'
    });

module.exports = new FFI.Library('./bin/napi', {
    jsonNapiConfigureD: ['int', ['string', 'int', 'int', 'string']],
    jsonNapiGetD: [NapiReturn, []],
    jsonNapiPutD: ['int', ['string']],
    jsonNapiTerminateD: ['void', []]
});