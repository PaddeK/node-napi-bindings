'use strict';

const
    nodeunit = require('nodeunit'),
    cluster = require('cluster'),
    fs = require('fs');

// The NAPI created file ncl.log is locked by the process which created it, so calling unlink always throws EBUSY.
// To circumvent this problem and in order to be able to clean up we run the UnitTests in a worker.
if (cluster.isMaster) {
    cluster.fork();

    cluster.on('exit', () => {
        [__dirname + '/../ncl.log', __dirname + '/../napi.log'].forEach(file => {
            return fs.existsSync(file) && fs.unlinkSync(file);
        });
    });
} else {
    if (process.argv.includes('functional')) {
        return nodeunit.reporters.default.run(['tests/test_functional.js'], null, process.exit);
    }
    nodeunit.reporters.default.run(['tests/test_' + process.platform + '.js'], null, process.exit);
}

