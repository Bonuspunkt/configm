var fs = require('fs');
var path = require('path');

//write = load / apply / save

module.exports = function(filename, globalDir) {

  var globalFile = path.join(globalDir, filename);

  function updateConfig(path, execOnConfig, callback) {

    function writeFile(config) {
      execOnConfig(config);
      fs.writeFile(path, JSON.stringify(config), function(e) {
        callback(e);
      });
    }

    fs.exists(path, function(exist) {
      if (exist) {
        fs.readFile(path, function(e, data) {
          if (e) { callback(e); return; }
          var config = JSON.parse(data);
          writeFile(config);
        });
      } else {
        writeFile({});
      }
    });
  }

  function writeGlobal(execOnConfig, callback) {
    updateConfig(globalFile, execOnConfig, callback)
  }

  // function writeParent(execOnConfig, , callback) {
  //   fs.exists(path, function(exists) {
  //     if (!exists) {
  //       var parent = path.resolve(path, '..');
  //       if (parent === path) {
  //         return callback(new Error('no config found'));
  //       }
  //       writeParent(execOnConfig, parent, callback);
  //       return;
  //     }
  //     updateConfig(path, execOnConfig, callback)
  //   });
  // }

  function read(dir, callback) {
    var file = path.join(dir, filename);

    fs.exists(file, function(exist){
      if (exist) {
        fs.readFile(file, function(e, data){
          if (e) { return callback(e); }

          var config = JSON.parse(data);

          callback(null, config);
        });
      }
      else {
        callback(null, {});
      }
    });
  }

  return {
    set: function(option, value, flag, callback) {
      var applyFunction = function(cfg) {
        cfg[option] = value;
      };
      //sort arguments
      if (typeof option === 'object') {
        callback = flag;
        flag = value;

        applyFunction = function(cfg) {
          Object.keys(option).forEach(function(key){
            cfg[key] = option[key];
          });
        };
      }
      if (typeof flag === 'function') {
        callback = flag;
      }

      switch (flag) {
        case 'g':
          writeGlobal(applyFunction, callback)
          // write it to global
          break;
        // case 'r':
        //   // write it to some parent
        //   break;
        default:
          var file = path.join(process.cwd(), filename);
          updateConfig(file, applyFunction, callback)
          break;
      }
    },

    get: function(dir, callback) {
      if (typeof dir === 'function') {
        callback = dir;
        dir = process.cwd();
      }

      var parent = dir;
      var i = 0;
      var completed = 0;
      var content = [];

      function checkDone() {
        if (completed > i) {
          var config = content.reduce(function(prev, curr) {
            Object.keys(prev).forEach(function(key) {
              curr[key] = prev[key];
            });
            return curr;
          })
          callback(null, config);
        }
      }

      do {
        (function(i) {
          dir = parent;
          read(dir, function(e, cfg) {
            content[i] = cfg;
            completed++;
            checkDone();
          });

          parent = path.resolve(dir, '..');
        }(i));
        i++;
      } while (parent !== dir);

      read(globalDir, function(e, cfg) {
        content[i] = cfg;
        completed++;

        checkDone();
      });
    }
  };
}