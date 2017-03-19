'use strict';

const
    FFI = require('ffi'),
    Struct = require('ref-struct'),
    path = require('path'),
    /**
     *  @typedef LogLevel
     *  @type {object}
     *  @property {int} NORMAL   Limited logging of important events like errors and warnings. The default log level.
     *  @property {int} INFO     Log significantly more information about the internals of NAPI.
     *  @property {int} DEBUG    The log level that will likely be used when working with Nymi Support.
     *  @property {int} VERBOSE  Log pretty much everything down to the Bluetooth level.
     *  @constant
     */
    LogLevel = {
        NORMAL: 0,
        INFO: 1,
        DEBUG: 2,
        VERBOSE: 3
    },
    /**
     *  @typedef ConfigOutcome
     *  @type {object}
     *  @property {int} OKAY                             Configured successfully.
     *  @property {int} FAILED_TO_INIT                   Configuration infomation is okay, but unable to start successfully.
     *  @property {int} CONFIGURATION_FILE_NOT_FOUND     The provided configuration file could not be found.
     *  @property {int} CONFIGURATION_FILE_NOT_READABLE  The provided configuration file could not be read.
     *  @property {int} CONFIGURATION_FILE_NOT_PARSED    The provided configuration file was not valid JSON.
     *  @property {int} IMPOSSIBLE
     *  @constant
     */
    ConfigOutcome = {
        OKAY: 0,
        FAILED_TO_INIT: 1,
        CONFIGURATION_FILE_NOT_FOUND: 2,
        CONFIGURATION_FILE_NOT_READABLE: 3,
        CONFIGURATION_FILE_NOT_PARSED: 4,
        IMPOSSIBLE: 5
    },
    /**
     *  @typedef JsonPutOutcome
     *  @type {object}
     *  @property {int} OKAY                 Sending JSON was successful.
     *  @property {int} NAPI_NOT_RUNNING     NAPI is not running – either jsonNapiConfigure did not complete or jsonNapiTerminate was already called.
     *  @property {int} IMPOSSIBLE
     *  @constant
     */
    JsonPutOutcome = {
        OKAY: 0,
        NAPI_NOT_RUNNING: 1,
        IMPOSSIBLE: 2
    },
    /**
     *  @typedef JsonGetOutcome
     *  @type {object}
     *  @property {int} OKAY                 A JSON string has been returned.
     *  @property {int} NAPI_NOT_RUNNING     NAPI is not running – either jsonNapiConfigure did not complete or jsonNapiTerminate was already called.
     *  @property {int} TIMED_OUT            The second variant of jsonNapiGet timed out.
     *  @property {int} QUIT_SIGNALED        The third variant of jsonNapiGet was called and quit was signaled.
     *  @property {int} NAPI_FINISHED        jsonNapiTerminate was called.
     *  @property {int} IMPOSSIBLE
     *  @constant
     */
    JsonGetOutcome = {
        OKAY: 0,
        NAPI_NOT_RUNNING: 1,
        TIMED_OUT: 2,
        QUIT_SIGNALED: 3,
        NAPI_FINISHED: 4,
        IMPOSSIBLE: 5
    },
    /**
     * @typedef JsonNapiResponse
     * @type {object}
     * @property {string} message           Contains reesponse from NAPI as stringified JSON.
     * @property {JsonGetOutcome} outcome   Return code of the call to jsonGetD, jsonGetSD or jsonGetTSD.
     * @property {boolean} quit             TRUE if jsonGetSD returned due to quit beeing triggered, FALSE otherwise.
     * @constant
     */
    JsonNapiResponse = new Struct({
        message: 'string',
        outcome: 'int',
        quit: 'bool'
    }),
    NapiInterface = {
        jsonNapiConfigureD: ['int', ['string', 'int', 'int', 'string']],
        jsonNapiGetD: [JsonNapiResponse, []],
        jsonNapiGetSD: [JsonNapiResponse, ['bool', 'int']],
        jsonNapiGetTSD: [JsonNapiResponse, ['int', 'int']],
        jsonNapiPutD: ['int', ['string']],
        jsonNapiTerminateD: ['void', []]
    };

let
    priv = new WeakMap(),
    privates = {},
    _s = (scope, key, value) => { privates[key] = value; priv.set(scope, privates)},
    _g = (scope, key) => priv.get(scope)[key];

/**
 * <p><b>Class NapiBinding</b></p>
 *
 * @class NapuBinding
 */
class NapiBinding
{
    /**
     * JsonGetOutcome
     *
     * @static
     * @return {JsonGetOutcome}
     */
    static get JsonGetOutcome ()
    {
        return JsonGetOutcome;
    }

    /**
     * JsonPutOutcome
     *
     * @static
     * @return {JsonPutOutcome}
     */
    static get JsonPutOutcome ()
    {
        return JsonPutOutcome;
    }

    /**
     * ConfigOutcome
     *
     * @static
     * @return {ConfigOutcome}
     */
    static get ConfigOutcome ()
    {
        return ConfigOutcome;
    }

    /**
     * LogLevel
     *
     * @static
     * @return {LogLevel}
     */
    static get LogLevel ()
    {
        return LogLevel;
    }

    /**
     * <p>Create bindings for the Nymi API</p>
     *
     * @constructor
     * @param {boolean} [nymulator=false]   TRUE create bindings for networked library, FALSE create bindings for native library.
     */
    constructor (nymulator)
    {
        nymulator = nymulator || false;

        let lib = process.platform === 'darwin' && nymulator ? '../bin/napi-net' : '../bin/napi';

        _s(this, 'binding', new FFI.Library(path.resolve(__dirname, lib), NapiInterface));
    }

    /**
     * <p>Configure and start NAPI.</p>
     * <p>For most NEAs the default arguments are correct so the call would be similar to jsonNapiConfigure("root-directory-path");.
     * The default host of "" is treated as "127.0.0.1". The default port of -1 will choose the port depending on platform (OS X or Windows) and libary (native or networked).
     * The rootDirectory is a directory that must contain a file called config.json. When the NEA runs, it saves provision information into a file called provisions.json.
     * The NEA will also create log files in that directory.</p>
     *
     * @param {string} rootDirectory            Path to a directory that contains the config.json file and to which NAPI writes provisions.json and any log files.
     * @param {int} [logLevel=LogLevel.NORMAL]  The log level to use (see LogLevel).
     * @param {int} [port=-1]                   The default port for networked Nymi Bands (on Windows) or the Nymulator.
     * @param {string} [host='']                The default host for networked Nymi Bands (on Windows) or the Nymulator.
     * @return {ConfigOutcome}
     */
    jsonNapiConfigureD (rootDirectory, logLevel, port, host)
    {
        logLevel = logLevel || LogLevel.NORMAL;
        port = port || -1;
        host = host || '';
        return _g(this, 'binding').jsonNapiConfigureD(rootDirectory, logLevel, port, host);
    }

    /**
     * <p>Receive a JSON message from NAPI; standard usage.</p>
     * <p>jsonNapiGetD is a blocking call.
     * If NAPI is not running, wait a short time and call jsonNapiGetD again. No JSON messages are lost.
     * </p>
     * <b>This variant returns when:</b>
     * <li>A message is available from NAPI (JsonGetOutcome.OKAY)</li>
     * <li>NAPI is not running (JsonGetOutcome.NAPI_NOT_RUNNING)</li>
     * <li>NAPI has finished (JsonGetOutcome.NAPI_FINISHED)</li>
     *
     * @return {JsonNapiResponse}
     */
    jsonNapiGetD ()
    {
        return _g(this, 'binding').jsonNapiGetD();
    }

    /**
     * <p>Receive a JSON message from NAPI; variant two.</p>
     * <p>jsonNapiGetSD is a blocking call.
     * If NAPI is not running, wait a short time and call jsonNapiGetSD again. No JSON messages are lost.
     * </p>
     * <b>This variant returns when:</b>
     * <li>A message is available from NAPI (JsonGetOutcome.OKAY)</li>
     * <li>NAPI is not running (JsonGetOutcome.NAPI_NOT_RUNNING)</li>
     * <li>NAPI has finished (JsonGetOutcome.NAPI_FINISHED)</li>
     * <li>Quit has been signaled (JsonGetOutcome.QUIT_SIGNALED)</li>
     *
     * @param {boolean} quit        An bool that causes this function to return when it is set to true.
     * @param {int} [sleep=100]     Quit is checked every sleep milliseconds.
     * @return {JsonNapiResponse}
     */
    jsonNapiGetSD (quit, sleep)
    {
        sleep = sleep || 100;
        return _g(this, 'binding').jsonNapiGetSD(quit, sleep);
    }

    /**
     * <p>Receive a JSON message from NAPI; variant one.</p>
     * <p>jsonNapiGetTSD is a blocking call.
     * If NAPI is not running, wait a short time and call jsonNapiGetTSD again. No JSON messages are lost.
     * </p>
     * <b>This variant returns when:</b>
     * <li>A message is available from NAPI (JsonGetOutcome.OKAY)</li>
     * <li>NAPI is not running (JsonGetOutcome.NAPI_NOT_RUNNING)</li>
     * <li>NAPI has finished (JsonGetOutcome.NAPI_FINISHED)</li>
     * <li>A timeout has expired without a message or finish (JsonGetOutcome.TIMED_OUT)</li>
     *
     * @param {int} timeout      The timeout in milliseconds.
     * @param {int} [sleep=100]  The timeout is implemented by waiting for sleep milliseconds until the timeout is exceeded.
     * @return {JsonNapiResponse}
     */
    jsonNapiGetTSD (timeout, sleep)
    {
        sleep = sleep || 100;
        return _g(this, 'binding').jsonNapiGetTSD(timeout, sleep);
    }

    /**
     * <p>Send a JSON message to NAPI.</p>
     *
     * @param {string} json      Stringified JSON to send to NAPI.
     * @return {JsonPutOutcome}
     */
    jsonNapiPutD (json)
    {
        try {
            return _g(this, 'binding').jsonNapiPutD(JSON.stringify(json));
        } catch (err) {
            return JsonPutOutcome.IMPOSSIBLE;
        }
    }

    /**
     * <p>Shutdown NAPI.</p>
     * <p>The NEA should call this function before exiting.</p>
     * <b>Note:</b>
     * Calling this function, followed by a second call to jsonNapiConfigD, may appear to work, but it will eventually break in unpredictable ways.
     * A future release will support this or provide other means to achieve the same effect.
     *
     * @return {void}
     */
    jsonNapiTerminateD ()
    {
        _g(this, 'binding').jsonNapiTerminateD();
    }
}

module.exports = NapiBinding;