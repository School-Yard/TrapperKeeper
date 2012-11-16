var common = require('./common'),
    TrapperKeeper = module.exports = exports;

/**
 * Setup possible `engines`
 */
TrapperKeeper.Engines = require('./engines'),

/**
 * Define methods that are avaliable
 */
TrapperKeeper.Methods = [
  'ALL',
  'GET',
  'FIND',
  'SAVE',
  'CREATE',
  'UPDATE',
  'DESTROY'
];

/**
 * Define a connection
 *
 * @param {String} engine
 * @param {String} uri
 * @param {Number} port
 * @param {Object} options
 * @return {Engine}
 */
TrapperKeeper.Connect = function(/* [engine], [uri], [port], [options] */) {
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
  var connection = new TrapperKeeper.Engines[engineName](options);

  return connection;
};