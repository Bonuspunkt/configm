# configm
merging your config

ex.
    *global* { abc: true, d: 4 }
    /parent { e: 'string' }
    /parent/workDir { d: 8, fg: [1,2] }
    = { abc: true, d: 8, e: 'string', fg: [1,2] }

## installation
    npm install configm

## usage
    var config = require('configm')('.cfg', '*globalDir*');
    config.set({}) = config.clear(flag, cb)
    config.set(completeConfig, cb)
    config.set(option, value, cb);
    config.set(option, value, 'r', cb); // searches next config upward
    config.set(option, value, 'g', cb); // set it globally
    config.get([path], function(e, cfg) {});
