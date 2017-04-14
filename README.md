# node-napi-bindings 
Simple Node bindings for the Nymi API (NAPI) 4.1.

Please refer to the official [Nymi Github](https://github.com/Nymi/JSON-API) or [SDK Documentation](https://downloads.nymi.com/sdkDoc/latest/index.html) for details.
  
## Support
All Platforms supported by the Nymi SDK 4.1 should be supported by this module.

Tested on Windows 7 64bit, macOS Sierra 10.12.2, macOS Sierra 10.12.3 and macOS Sierra 10.12.4.

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
None so far.

## Versioning
As of Nymi API SDK 4.1 i decided to version the bindings accordingly.

## Example
This example will initialize the NAPI, request info about all provisioned Nymi Bands and print the result.
The example makes the assumption you are using the Nymulator on your local machine on default port 9088.

````javascript
const 
    NapiBinding = require('napi-bindings'),
    napi = new NapiBinding(true); // true for using Nymulator or false for using physical Nymi Band (default: false)

try {
    let init, put, get;

    init = napi.napiConfigure('NeaTest', '.', '{}', NapiBinding.LogLevel.NONE, 9088, '127.0.0.1');

    console.assert(init === NapiBinding.ConfigOutcome.OKAY, 'INIT: %s', Object.keys(NapiBinding.ConfigOutcome)[init]);

    put = napi.napiPut({path: 'info/get'});

    console.assert(put === NapiBinding.PutOutcome.OKAY, 'PUT: %s', Object.keys(NapiBinding.PutOutcome)[put]);

    get = napi.napiGet();

    console.assert(get.outcome === NapiBinding.GetOutcome.OKAY, 'GET: %s', Object.keys(NapiBinding.GetOutcome)[get]);
    
    console.log(get.json);    
} catch(err) {
    console.error(err.message);
} finally {
    napi.napiTerminate();
}
````

### License

See LICENSE file.