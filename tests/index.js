'use strict';

const   nodeunit = require('nodeunit'),
        fs = require('fs');

nodeunit.reporters.default.run(['tests/test_' + process.platform + '.js'], null, function() {
    [__dirname + '/ncl.log', __dirname + '/provisions.json'].forEach(file => {
        return fs.existsSync(file) && fs.unlinkSync(file);
    });
});
