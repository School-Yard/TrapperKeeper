var EventEmitter2 = require('eventemitter2').EventEmitter2,
    util = require('utile'),
    common = require('../common'),
    url = require('url');

var Memory = module.exports = function Memory(options) {

  var self = this,
      counter = 0;

  this.options = options;

  this.increment = function() {
    return ++counter;
  };

  this.store = {};

  EventEmitter2.call(this, {
    wildcard: true,
    delimiter: '::',
    maxListeners: 0
  });

  return this;
};

util.inherits(Memory, EventEmitter2);

Memory.prototype.ready = function ready() {
  this.emit('ready');
};

Memory.prototype.get = function get(id, namespace, callback) {
  var key = id.toString();
  if(key in this.store) {
    return callback(null, JSON.parse(this.store[key] || 'null'));
  } else {
    return callback(null, {});
  }
};

Memory.prototype.create = function create(attrs, namespace, callback) {
  var key = this.increment().toString();
  attrs.id = key;

  this.store[key] = JSON.stringify(attrs);
  return callback(null, attrs);
};

Memory.prototype.save = function save(id, attrs, namespace, callback) {
  var key = id.toString();
  if(!attrs.id) {
    attrs.id = key;
  }

  this.store[key] = JSON.stringify(attrs);
  return callback(null, attrs);
};

Memory.prototype.destroy = function destroy(id, namespace, callback) {
  var key = id.toString();
  delete this.store[key];
  return callback(null, 1);
};

Memory.prototype.update = function update(id, attrs, namespace, callback) {
  var key = id.toString(),
      obj = JSON.parse(this.store[key] || {});

  common.extend(obj, attrs);
  callback(null, obj);
};

Memory.prototype.find = function find(conditions, namespace, callback) {
  this.filter(
    function(obj) {
      return Object.keys(conditions).every(function(k) {
        var val = JSON.parse(obj);
        return conditions[k] === val[k];
      });
    },
    callback
  );
};

Memory.prototype.all = function all(namespace, callback) {
  this.filter(
    function(obj) {
      return true;
    },
    callback
  );
};

Memory.prototype.filter = function (filter, callback) {
  var objects = [],
      store = this.store;

  Object.keys(this.store).forEach(function(k) {
    if(filter(store[k])) {
      objects.push(JSON.parse(store[k]));
    }
  });

  callback(null, objects);
};