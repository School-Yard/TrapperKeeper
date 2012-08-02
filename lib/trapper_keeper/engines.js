var fs = require('fs'),
    path = require('path'),
    common = require('./common');

var engines = exports;

// Based on the Flatiron Resourceful Engine.js
// https://github.com/flatiron/resourceful/blob/master/lib/resourceful/engines.js

// Setup all engines as lazy-loaded getters.
fs.readdirSync(path.join(__dirname, 'engines')).forEach(function(file) {
  var engine = file.replace('.js', ''),
      name  = common.capitalize(engine);

  engines.__defineGetter__(name, function () {
    return require('./engines/' + engine);
  });
});