var common = require('./common'),
    util = require('utile'),
    Resource = require('./resource');

var trapper_keeper = exports;

trapper_keeper.engines = require('./engines');
trapper_keeper.connection = {};

trapper_keeper.connect = function(/* [engine], [uri], [port], [options] */) {
  var args = Array.prototype.slice.call(arguments),
      options = {},
      engine,
      engineName;

  engine = Array.prototype.shift.call(arguments);

  if(!engine) {
    throw Error('Must specifiy an engine');
  }

  args.forEach(function(a) {
    switch (typeof(a)) {
      case 'number': options.port = parseInt(a, 10); break;
      case 'string': options.uri  = a; break;
      case 'object': options      = a; break;
    }
  });

  engineName = common.capitalize(engine);
  this.connection = new trapper_keeper.engines[engineName](options);

  return this;
};


trapper_keeper.resource = function(namespace, options) {
  var resource,
      attrs;

  attrs = {
    namespace: namespace,
    connection: this.connection
  };

  common.extend(attrs, options);

  return new Resource(attrs);
};