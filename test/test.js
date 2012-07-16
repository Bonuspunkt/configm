var fs = require('fs');
var path = require('path');
var test = require('tap').test;
var async = require('async');
var configm = require('../lib/configm');

var global = path.join(__dirname, 'global');
var parent = path.join(__dirname, 'dir');
var chdir = path.join(__dirname, 'dir', 'subdir');
var cfgFile = '.test';

// clear up last test run
try { fs.unlinkSync(path.join(global, cfgFile)); } catch(e) {}
try { fs.unlinkSync(path.join(parent, cfgFile)); } catch(e) {}
try { fs.unlinkSync(path.join(chdir, cfgFile)); } catch(e) {}

// setup directories
try { fs.mkdirSync(global); } catch(e) {}
try { fs.mkdirSync(parent); } catch(e) {}
try { fs.mkdirSync(chdir); } catch(e) {}

// lets start
var cfg = configm(cfgFile, global);

test(function(t) {

  process.chdir(parent);

  async.waterfall([
    function(callback) { 
      cfg.set('a', 'b', 'g', callback); 
    },
    function(callback) { 
      cfg.get(callback);
    },
    function(data, callback) {
      t.deepEqual(data, {a:'b'});

      cfg.set('a', 'c', callback);
    },
    function(callback) {
      cfg.get(callback);
    },
    function(data, callback) {
      t.deepEqual(data, {a:'c'});

      process.chdir(chdir);

      cfg.set({ d: 'e' }, callback);
    },
    function(callback) {
      cfg.get(callback);
    },
  ], function(err, result) {
    t.deepEqual(result, {a:'c', d:'e'});
    t.end();
  });

});