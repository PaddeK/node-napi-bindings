# node-napi-bindings 
Simple Node bindings for the Nymi API (NAPI) 4.0.

Please refer to the official [Nymi Github](https://github.com/Nymi/JSON-API) or [SDK Documentation](https://downloads.nymi.com/sdkDoc/latest/index.html) for details.
  
## Support
Currently the bindings are only support Windows.
When macOS Sierra is officially supported i will give it a go to support it.

Feel free to participate and create a pull request if you need Mac support sooner.
  
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

## Example
This example will initialize the NAPI, request info about all provisioned Nymi Bands and print the result.
The example makes the assumption you are using the Nymulator on your local machine on default port 9088.

````javascript
const napi = require('napi-bindings');

try {
    let init, put, get;

    init = napi.jsonNapiConfigureD('.', 0, 9088, '127.0.0.1');

    console.assert(init === napi.ConfigOutcome.OKAY, 'INIT: %s', Object.keys(napi.ConfigOutcome)[init]);

    put = napi.jsonNapiPutD(JSON.stringify({path: 'info/get', exchange: 'provisions'}));

    console.assert(put === napi.JsonPutOutcome.OKAY, 'PUT: %s', Object.keys(napi.JsonPutOutcome)[put]);

    get = napi.jsonNapiGetD();

    console.assert(get.outcome === napi.JsonGetOutcome.OKAY, 'GET: %s', Object.keys(napi.JsonGetOutcome)[get]);

    console.log(JSON.parse(get.message));
} catch(err) {
    console.error(err.message);
} finally {
    napi.jsonNapiTerminateD();
}
````

### License

See LICENSE file.