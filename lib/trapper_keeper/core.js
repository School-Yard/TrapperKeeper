var common = require('./common'),
    util = require('util'),
    Resource = require('./resource');

var trapper_keeper = exports;

trapper_keeper.engines = require('./engines');
trapper_keeper.connection = {};

trapper_keeper.connect = function(/* [engine], [uri], [port], [options] */) {
  var args = Array.prototype.slice.call(arguments),
      options = {},
      engine,
      engineName;

  engine = Array.prototype.shift.call(args);

  if(!engine) {
    throw Error('Must specify an engine');
  }

  args.forEach(function(a) {
    switch (typeof(a)) {
      case 'number': options.port = parseInt(a, 10); break;
      case 'string': options.uri  = a; break;
      case 'object': options      = common.extend(a, options); break;
    }
  });

  engineName = common.capitalize(engine);
  var connection = new trapper_keeper.engines[engineName](options);

  return connection;
};