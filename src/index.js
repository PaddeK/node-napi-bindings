'use strict';

const   FFI = require('ffi'),
        Struct = require('ref-struct'),
        path = require('path'),
        NapiReturn = new Struct({
            message: 'string',
            outcome: 'int',
            quit: 'bool'
        }),
        LogLevel = {
            NORMAL: 0,
            INFO: 1,
            DEBUG: 2,
            VEBOSE: 3
        },
        ConfigOutcome = {
            OKAY: 0,
            FAILED_TO_INIT: 1,
            CONFIGURATION_FILE_NOT_FOUND: 2,
            CONFIGURATION_FILE_NOT_READABLE: 3,
            CONFIGURATION_FILE_NOT_PARSED: 4,
            IMPOSSIBLE: 5
        },
        JsonPutOutcome = {
            OKAY: 0,
            NAPI_NOT_RUNNING: 1,
            IMPOSSIBLE: 2
        },
        JsonGetOutcome = {
            OKAY: 0,
            NAPI_NOT_RUNNING: 1,
            TIMED_OUT: 2,
            QUIT_SIGNALED: 3,
            NAPI_FINISHED: 4,
            IMPOSSIBLE: 5
        };

module.exports = new FFI.Library(path.resolve(__dirname, '../bin/napi'), {
    jsonNapiConfigureD: ['int', ['string', 'int', 'int', 'string']],
    jsonNapiGetD: [NapiReturn, []],
    jsonNapiGetSD: [NapiReturn, ['bool', 'int']],
    jsonNapiGetTSD: [NapiReturn, ['int', 'int']],
    jsonNapiPutD: ['int', ['string']],
    jsonNapiTerminateD: ['void', []]
}, {
    LogLevel: LogLevel,
    ConfigOutcome: ConfigOutcome,
    JsonGetOutcome: JsonGetOutcome,
    JsonPutOutcome: JsonPutOutcome
});