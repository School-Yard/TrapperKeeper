var TrapperKeeper = require('./core');

/**
 * Resource constructor
 */

var Resource = module.exports = function Resource(options) {

  if(!(this instanceof Resource)) {
    return new Resource(options);
  }

  if(!options.connection) {
    throw new Error("A connection object must be specifiecd in the options parameter");
  }

  if(!options.namespace) {
    throw new Error("A namespace string must be specified in the options parameter");
  }

  this.options = options;
  this.connection = options.connection;
  this.namespace = options.namespace;
};

/**
 * Extend the Resource prototype with all
 * engine methods.
 */

TrapperKeeper.Methods.forEach(function(method) {
  method = method.toLowerCase();

  Resource.prototype[method] = function() {
    var args = Array.prototype.slice.call(arguments);
    this.connection[method].apply(this.connection,
      Array.prototype.concat(this.namespace, args));
  };
});