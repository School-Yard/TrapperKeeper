var EventEmitter2 = require('eventemitter2').EventEmitter2,
    util = require('utile');

var Resource = module.exports = function Resource(options) {

  if(!(this instanceof Resource)) {
    return new Resource(options);
  }

  this.options = options;

  if(!options.connection) {
    throw new Error("A connection object must be specifiecd in the options parameter");
  }

  if(!options.namespace) {
    throw new Error("A namespace string must be specified in the options parameter");
  }

  this.connection = options.connection;
  this.namespace = options.namespace;

  EventEmitter2.call(this, {
    wildcard: true,
    delimiter: '::',
    maxListeners: 0
  });

};

util.inherits(Resource, EventEmitter2);

Resource.prototype.get = function get(id, callback) {
  this.connection.get(id, this.namespace, callback);
};

Resource.prototype.create = function create(attrs, callback) {
  this.connection.create(attrs, this.namespace, callback);
};

Resource.prototype.save = function save(obj, callback) {
  this.connection.save(obj, this.namespace, callback);
};

Resource.prototype.destroy = function destroy(id, callback) {
  this.connection.destroy(id, this.namespace, callback);
};

Resource.prototype.update = function update(id, obj, callback) {
  this.connection.update(id, obj, this.namespace, callback);
};

Resource.prototype.find = function find(conditions, callback) {
  this.connection.find(conditions, this.namespace, callback);
};

Resource.prototype.all = function all(callback) {
  this.connection.all(this.namespace, callback);
};