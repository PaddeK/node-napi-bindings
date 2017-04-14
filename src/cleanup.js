'use strict';

let fs = require('fs'),
    path = require('path');

if (process.platform !== 'darwin') {
    fs.unlinkSync(path.resolve(__dirname, '..', 'bin', 'napi.dylib'));
    fs.unlinkSync(path.resolve(__dirname, '..', 'bin', 'napi-net.dylib'));
}
if (process.platform !== 'win32') {
    fs.unlinkSync(path.resolve(__dirname, '..', 'bin', 'napi.dll'));
}