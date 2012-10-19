var Engine = require('../engine'),
    util = require('util'),
    common = require('../common'),
    url = require('url');

var Memory = module.exports = function Memory(options) {
  Engine.call(this);

  var self = this,
      counter = 0;

  this.options = options;

  this.increment = function() {
    return ++counter;
  };

  this.store = {};

  process.nextTick(function() {
    self.emit('ready');
  });

  return this;
};

util.inherits(Memory, Engine);

Memory.prototype.get = function get(id, namespace, callback) {
  var key = namespace + ':' + id.toString();

  if(key in this.store) {
    return callback(null, JSON.parse(this.store[key] || 'null'));
  } else {
    return callback(null, null);
  }
};

Memory.prototype.create = function create(attrs, namespace, callback) {
  var id = this.increment().toString(),
      key = namespace + ':' + id;

  attrs.id = id;
  this.store[key] = JSON.stringify(attrs);
  return callback(null, attrs);
};

Memory.prototype.save = function save(id, attrs, namespace, callback) {
  var key = namespace + ':' + id.toString();

  if(!attrs.id) {
    attrs.id = id.toString();
  }

  this.store[key] = JSON.stringify(attrs);
  return callback(null, attrs);
};

Memory.prototype.destroy = function destroy(id, namespace, callback) {
  var key = namespace + ':' + id.toString();

  if(key in this.store) {
    delete this.store[key];
    return callback(null, 1);
  } else {
    return callback(new Error('No record found with that id'), 0);
  }
};

Memory.prototype.update = function update(id, attrs, namespace, callback) {
  var key = namespace + ':' + id.toString();

  if(key in this.store) {
    var obj = JSON.parse(this.store[key]);
    common.extend(obj, attrs);
    callback(null, obj);
  } else {
    return callback(new Error('No record found with that id'), 0);
  }
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