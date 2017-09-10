# configm [![Build Status](https://secure.travis-ci.org/Bonuspunkt/configm.png)](http://travis-ci.org/Bonuspunkt/configm)

[![Greenkeeper badge](https://badges.greenkeeper.io/Bonuspunkt/configm.svg)](https://greenkeeper.io/)
merging your config

## installation
    npm install configm

## usage
    var configm = require('configm')('sample.json', process.env.HOME);
initialize configm - the config will be saved to `sample.json` and `process.env.HOME` will be used as global directory

    configm.set({ key: value }, callback);
    // equals
    configm.set('key', value, callback);
applies the object/keyvalue pair to the config at the local directory

    configm.set(key, value, 'g', callback);
applies the keyvalue pair to the global directory

    configm.get([dir], callback)
gets the config. `dir` defaults to current working directory

    +-- HOME (global)
        +-- sample.json
            { a: 1, b: 2, c: 3 }
    
    +-- Parent
        +-- sample.json
        |   { b: 3, c: 4, d: 5 }
        |
        +-- workingDir
            +-- sample.json
                { c: 5, d: 6, e: 7 }
will return

    {a:1, b:3, c:5, d:6, e:7}
