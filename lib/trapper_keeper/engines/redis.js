var Engine = require('../engine'),
    util = require('util'),
    url = require('url'),
    redis = require('redis');

var Redis = module.exports = function Redis(options) {
  var uri,
      self = this;

  // Call parent class constructor
  Engine.call(this, options);

  if(options.uri) {
    uri = url.parse(options.uri, true);
    options.host = uri.hostname;
    options.port = uri.port || options.port;
  }

  options.host = options.host || '127.0.0.1';
  options.port = options.port || 6379;

  // Set up error handler
  this.error = options.error;
  if(typeof this.error !== 'function') {
    this.error = function(err) {
      return self.emit('error', err);
    };
  }

  this.connection = redis.createClient(options.port, options.host, options);
  if(options.password) this.connection.auth(options.password, this.error);

  this.connection.on('ready', function(err) {
    if(err) return self.error(err);
    return self.emit('ready');
  });

  /**
   * Call the error function if one was passed in options
   * and reconnect
   */
  this.connection.on('error', function(err) {
    return self.error(err);
  });

  return this;
};

util.inherits(Redis, Engine);

/**
 * HGETALL `namespace:id`
 */

Redis.prototype.get = function get(namespace, id, callback) {
  throw new Error('Not implemented');
};

/**
 * HMSET `namespace:id` `attrs`
 * Create an id, and then increment the id key
 */

Redis.prototype.create = function create(namespace, attrs, callback) {
  throw new Error('Not implemented');
};

/**
 * HMSET `namespace:id` `attrs`
 */

Redis.prototype.save = function save(namespace, id, attrs, callback) {
  throw new Error('Not implemented');
};

/**
 * HMSET `namespace:id` `attrs`
 */

Redis.prototype.update = function update(namespace, id, attrs, callback) {
  throw new Error('Not implemented');
};

/**
 * Delete from `namespace:index` set, delete key `namespace:id`
 */

Redis.prototype.destroy = function destroy(namespace, id, callback) {
  throw new Error('Not implemented');
};

/**
 * Search through all items in `namespace:index`
 */

Redis.prototype.find = function find(namespace, conditions, callback) {
  throw new Error('Not implemented');
};

/**
 * HGETALL for all items in `namespace:index`
 */

Redis.prototype.all = function all(namespace, callback) {
  throw new Error('Not implemented');
};