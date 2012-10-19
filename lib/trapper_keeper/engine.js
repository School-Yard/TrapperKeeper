var events = require('events'),
    util = require('util'),
    common = require('./common'),
    Resource = require('./resource');

var Engine = module.exports = function Engine(options) {
  if(!(this instanceof Engine)) {
    return new Engine(options);
  }

  events.EventEmitter.call(this);
  this.options = options;
};

util.inherits(Engine, events.EventEmitter);

Engine.prototype.resource = function resource(namespace, options) {
  if(!namespace) {
    throw Error('Must specify a namespace');
  }

  var attrs = { connection: this, namespace: common.slugify(namespace) };
  common.extend(attrs, options);
  return new Resource(attrs);
};