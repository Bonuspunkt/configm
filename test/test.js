var fs = require('fs');
var path = require('path');
var test = require('tap').test;
var configm = require('../lib/configm');

var global = path.join(__dirname, 'global');
var parent = path.join(__dirname, 'dir');
var chdir = path.join(__dirname, 'dir', 'subdir');
var cfgFile = '.test';

try { fs.unlinkSync(path.join(global, cfgFile)); } catch(e) {}
try { fs.unlinkSync(path.join(parent, cfgFile)); } catch(e) {}
try { fs.unlinkSync(path.join(chdir, cfgFile)); } catch(e) {}

var cfg = configm(cfgFile, global);

test(function(t) {

  process.chdir(parent);

  cfg.set('a', 'b', 'g', function(e) {
    cfg.get(function(e, data) {
      
      t.deepEqual(data, {a:'b'});

      cfg.set('a', 'c', function(e) {
        cfg.get(function(e, data) {
          t.deepEqual(data, {a:'c'});

          process.chdir(chdir);

          cfg.set('d', 'e', function(e) {
            cfg.get(function(e, data) {
              t.deepEqual(data, {a:'c', d:'e'});
              t.end();
            });
          });

        });
      });

    });
  });

});