# node-napi-bindings 
Simple Node bindings for the Nymi API (NAPI) 4.0.

Please refer to the official [Nymi Github](https://github.com/Nymi/JSON-API) or [SDK Documentation](https://downloads.nymi.com/sdkDoc/latest/index.html) for details.
  
## Support
All Platforms supported by the Nymi SDK 4.0 should be supported by this module.

Tested on Windows 7 64bit and macOS Sierra 10.12.2.

##### Apple Mac OS
 - OS X Yosemite (10.10)
 - OS X El Capitan (10.11)
 - macOS Sierra (10.12.2 or later)
 
##### Microsoft Windows 
 - Windows 10, 8.1, 7 
 - 64bit only
  
## Install
```
npm i napi-bindings
```

## Prerequisite
Create a file in the root directory of your project named `config.json` with the following content.
````json
{
    "neaName" : "sample",
    "sigAlgorithm" : "NIST256P",
    "automaticFirmwareVersion" : false
}
````

## Breaking changes in 1.1.0
To get a better usability like autocomplete and JSDoc documentation 
i had to change some things around. The example below is changed accordingly. 

## Example
This example will initialize the NAPI, request info about all provisioned Nymi Bands and print the result.
The example makes the assumption you are using the Nymulator on your local machine on default port 9088.

````javascript
const NapiBinding = require('../src/index.js'),
      napi = new NapiBinding(true); // true for using Nymulator or false for using physical Nymi Band (default: false)

try {
    let init, put, get;

    init = napi.jsonNapiConfigureD(__dirname, NapiBinding.LogLevel.NORMAL, 9088, '127.0.0.1');

    console.assert(init === NapiBinding.ConfigOutcome.OKAY, 'INIT: %s', Object.keys(NapiBinding.ConfigOutcome)[init]);

    put = napi.jsonNapiPutD(JSON.stringify({path: 'info/get', exchange: 'provisions'}));

    console.assert(put === NapiBinding.JsonPutOutcome.OKAY, 'PUT: %s', Object.keys(NapiBinding.JsonPutOutcome)[put]);

    get = napi.jsonNapiGetD();

    console.assert(get.outcome === NapiBinding.JsonGetOutcome.OKAY, 'GET: %s', Object.keys(NapiBinding.JsonGetOutcome)[get]);

    console.log(JSON.parse(get.message));
} catch(err) {
    console.error(err.message);
} finally {
    napi.jsonNapiTerminateD();
}
````

### License

See LICENSE file.