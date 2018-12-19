'use strict';

const
    FFI = require('ffi'),
    path = require('path'),
    ref = require('ref'),
    /**
     *  @typedef LogLevel
     *  @type {object}
     *  @property {int} NONE     No logging.
     *  @property {int} NORMAL   Normal logging of important events like errors and warnings. The default log level.
     *  @property {int} INFO     Logs significantly more information about the internals of NAPI.
     *  @property {int} DEBUG    The log level that will likely be used when working with Nymi Support.
     *  @property {int} VERBOSE  Logs pretty much everything down to the Bluetooth level.
     *  @constant
     */
    LogLevel = {
        NONE: 0,
        NORMAL: 1,
        INFO: 2,
        DEBUG: 3,
        VERBOSE: 4
    },
    /**
     *  @typedef ConfigOutcome
     *  @type {object}
     *  @property {int} OKAY                    Configured successfully.
     *  @property {int} INVALID_PROVISION_JSON  Provision information provided is invalid (likely invalid JSON).
     *  @property {int} MISSING_NEA_NAME        Provision information does not include neaName.
     *  @property {int} FAILED_TO_INIT          Configuration infomation is okay, but NAPI was unable to start successfully.
     *  @property {int} ERROR                   An error occurred, likely an exception, possibly involving the parameters provided.
     *  @property {int} IMPOSSIBLE
     *  @constant
     */
    ConfigOutcome = {
        OKAY: 0,
        INVALID_PROVISION_JSON: 1,
        MISSING_NEA_NAME: 2,
        FAILED_TO_INIT: 3,
        ERROR: 4,
        IMPOSSIBLE: 5
    },
    /**
     *  @typedef PutOutcome
     *  @type {object}
     *  @property {int} OKAY                Sending JSON was successful.
     *  @property {int} NAPI_NOT_RUNNING    NAPI is not running – either napiConfigure did not complete or napiTerminate was already called.
     *  @property {int} UNPARSEABLE_JSON    The provided string is not parseable as JSON.
     *  @property {int} ERROR               An error occurred, likely an exception.
     *  @property {int} IMPOSSIBLE
     *  @constant
     */
    PutOutcome = {
        OKAY: 0,
        NAPI_NOT_RUNNING: 1,
        UNPARSEABLE_JSON: 2,
        ERROR: 3,
        IMPOSSIBLE: 4
    },
    /**
     *  @typedef GetOutcome
     *  @type {object}
     *  @property {int} OKAY                A JSON string has been returned.
     *  @property {int} NAPI_NOT_RUNNING    NAPI is not running – either napiConfigure did not complete or napiTerminate was already called.
     *  @property {int} BUFFER_TOO_SMALL    The provided char* buffer is not long enough; the length value will contain the minimum required size.
     *  @property {int} NAPI_TERMINATED     Napi::terminate was called. This outcome will be returned once. Afterwards, the outcome is NAPI_NOT_RUNNING.
     *  @property {int} ERROR               An error occurred, likely an exception.
     *  @property {int} IMPOSSIBLE
     *  @constant
     */
    GetOutcome = {
        OKAY: 0,
        NAPI_NOT_RUNNING: 1,
        BUFFER_TOO_SMALL: 2,
        NAPI_TERMINATED: 3,
        ERROR: 4,
        IMPOSSIBLE: 5
    },
    /**
     *  @typedef TryGetOutcome
     *  @type {object}
     *  @property {int} OKAY                A JSON string has been returned.
     *  @property {int} NOTHING             There is no JSON available at the time of the call.
     *  @property {int} NAPI_NOT_RUNNING    NAPI is not running – either napiConfigure did not complete or napiTerminate was already called.
     *  @property {int} BUFFER_TOO_SMALL    The provided char* buffer is not long enough; the length value will contain the minimum required size.
     *  @property {int} NAPI_TERMINATED     Napi::terminate was called. This outcome will be returned once. Afterwards, the outcome is NAPI_NOT_RUNNING.
     *  @property {int} ERROR               An error occurred, likely an exception.
     *  @property {int} IMPOSSIBLE
     *  @constant
     */
    TryGetOutcome = {
        OKAY: 0,
        NOTHING: 1,
        NAPI_NOT_RUNNING: 2,
        BUFFER_TOO_SMALL: 3,
        NAPI_TERMINATED: 4,
        ERROR: 5,
        IMPOSSIBLE: 6
    },
    stringPtr = ref.refType('string'),
    intPtr = ref.refType('int'),
    NapiInterface = {
        napiConfigure: ['int', ['string', 'string', 'string', 'int', 'int', 'string']],
        napiGet: ['int', [stringPtr, 'int', intPtr]],
        napiTryGet: ['int', [stringPtr, 'int', intPtr]],
        napiPut: ['int', ['string']],
        napiTerminate: ['void', []]
    };

let
    priv = new WeakMap(),
    privates = {},
    _s = (scope, key, value) => {privates[key] = value; priv.set(scope, privates)},
    _g = (scope, key) => priv.get(scope)[key];

/**
 * <p><b>Class NapiBinding</b></p>
 *
 * @class NapuBinding
 */
class NapiBinding
{
    /**
     * GetOutcome
     *
     * @static
     * @return {GetOutcome}
     */
    static get GetOutcome ()
    {
        return GetOutcome;
    }

    /**
     * TryGetOutcome
     *
     * @static
     * @return {TryGetOutcome}
     */
    static get TryGetOutcome ()
    {
        return TryGetOutcome;
    }

    /**
     * PutOutcome
     *
     * @static
     * @return {PutOutcome}
     */
    static get PutOutcome ()
    {
        return PutOutcome;
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

        let lib = process.platform === 'darwin' && nymulator ? './../bin/napi-net' : './../bin/napi';

        _s(this, 'binding', new FFI.Library(path.resolve(__dirname, lib), NapiInterface));
    }

    /**
     * <p>Configure and start NAPI.</p>
     * <p>For most NEAs the default arguments are correct so the call would be similar to napiConfigure("root-directory-path");.
     * The default host of "" is treated as "127.0.0.1". The default port of -1 will choose the port depending on platform (OS X or Windows) and libary (native or networked).
     * The value of provisions should be the same as the last saved value.
     * </p>
     *
     * @param {string} neaName                  Name of this NEA (used when provisioning). (6 to 18 characters)
     * @param {string} logDirectory             Path to a directory that will contain log files.
     * @param {string} [provisions = '{}']      The provision data saved by previous runs of the NEA.
     * @param {int} [logLevel=LogLevel.NORMAL]  The log level to use (see LogLevel).
     * @param {int} [port=-1]                   The default port for networked Nymi Bands (on Windows) or the Nymulator.
     * @param {string} [host='']                The default host for networked Nymi Bands (on Windows) or the Nymulator.
     * @return {ConfigOutcome}
     */
    napiConfigure (neaName, logDirectory, provisions, logLevel, port, host)
    {
        neaName = String(neaName);
        logDirectory = String(logDirectory);
        provisions = String(provisions) || '{}';
        logLevel = ~~logLevel || LogLevel.NORMAL;
        port = ~~port || -1;
        host = String(host) || '';
        return _g(this, 'binding').napiConfigure(neaName, logDirectory, provisions, logLevel, port, host);
    }

    /**
     * <p>Receive a JSON message from NAPI, blocks if nothing is available yet; standard usage.</p>
     * <p>napiGet is a blocking call.
     * If NAPI is not running, wait a short time and call napiGet again. No JSON messages are lost.
     * </p>
     * <b>This variant returns when:</b>
     * <li>A message is available from NAPI (GetOutcome.OKAY)</li>
     * <li>A message from NAPI is ready, but the provided buffer is too small (GetOutcome::BUFFER_TOO_SMALL)</li>
     * <li>NAPI is not running (GetOutcome.NAPI_NOT_RUNNING)</li>
     * <li>NAPI has terminated (GetOutcome.NAPI_TERMINATED)</li>
     *
     * @return {{outcome: GetOutcome, json: object}}
     */
    napiGet ()
    {
        let outcome, buf, len,
            json = null;

        try {
            buf = Buffer.alloc(4096);
            len = ref.alloc('int');
            buf.type = stringPtr;

            outcome = _g(this, 'binding').napiGet(buf, buf.length, len);

            if (outcome === NapiBinding.GetOutcome.BUFFER_TOO_SMALL) {
                outcome = _g(this, 'binding').napiGet(buf, len.deref(), len);
            }

            if (outcome === NapiBinding.GetOutcome.OKAY) {
                json = JSON.parse(buf.readCString(0));
            }
        } catch (err) {
            outcome = NapiBinding.GetOutcome.ERROR;
        }

        return {outcome: outcome, json: json};
    }

    /**
     * <p>Receive a JSON message from NAPI if one is available, non-blocking; standard usage.</p>
     * <p>napiTryGet is a non-blocking call.
     * If NAPI is not running, wait a short time and call napiTryGet again. No JSON messages are lost.
     * </p>
     * <b>This variant returns when:</b>
     * <li>A message is available from NAPI (TryGetOutcome.OKAY)</li>
     * <li>No message is available at the time of the call. (TryGetOutcome::NOTHING)</li>
     * <li>A message from NAPI is ready, but the provided buffer is too small (TryGetOutcome::BUFFER_TOO_SMALL)</li>
     * <li>NAPI is not running (TryGetOutcome.NAPI_NOT_RUNNING)</li>
     * <li>NAPI has terminated (TryGetOutcome.NAPI_TERMINATED)</li>
     *
     * @return {{outcome: (TryGetOutcome), json: object}}
     */
    napiTryGet ()
    {
        let outcome, buf, len,
            json = null;

        try {
            buf = Buffer.alloc(4096);
            len = ref.alloc('int');
            buf.type = stringPtr;

            outcome = _g(this, 'binding').napiTryGet(buf, buf.length, len);

            if (outcome === NapiBinding.TryGetOutcome.BUFFER_TOO_SMALL) {
                outcome = _g(this, 'binding').napiTryGet(buf, len.deref(), len);
            }

            if (outcome === NapiBinding.TryGetOutcome.OKAY) {
                json = JSON.parse(buf.readCString(0));
            }
        } catch (err) {
            outcome = NapiBinding.TryGetOutcome.ERROR;
        }

        return {outcome: outcome, json: json};
    }

    /**
     * <p>Send a JSON message to NAPI.</p>
     *
     * @param {object} json      Stringified JSON to send to NAPI.
     * @return {PutOutcome}
     */
    napiPut (json)
    {
        try {
            return _g(this, 'binding').napiPut(JSON.stringify(json));
        } catch (err) {
            return PutOutcome.IMPOSSIBLE;
        }
    }

    /**
     * <p>Shutdown NAPI.</p>
     * <p>The NEA should call this function before exiting.</p>
     * <b>Note:</b>
     * Calling this function, followed by a second call to napiConfigD, may now work (consider it beta functionality).
     *
     * @return {void}
     */
    napiTerminate ()
    {
        _g(this, 'binding').napiTerminate();
    }
}

module.exports = NapiBinding;