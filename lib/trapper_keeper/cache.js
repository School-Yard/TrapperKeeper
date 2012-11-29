var Cache,
    common = require('./common'),
    Engines = require('./engines');

/**
 * `Cache` class
 *
 * As close to transparent wrapper as possible
 * `Cache` interfaces with the wrapped connection object
 * when it is needed, otherwise it looks to the cache connection
 *
 * @param {String} cache
 * @param {Object} options
 */

Cache = module.exports = function Cache(cache, options) {
  cache = common.capitalize(cache);

  if(typeof Engines[cache] !== 'function') {
    throw new Error('Invalid cache engine');
  }

  if(typeof options.connection === 'undefined') {
    throw new Error('Invalid use of cache functionality');
  }

  this.cache = new Engines[cache](options);
  this.connection = options.connection;
  return this;
};

/**
 * `Cache.get()`
 *  - Same arguments as `Engine.get()`
 *
 * @param {String} namespace
 * @param {String} id
 * @param {Function} callback
 */

Cache.prototype.get = function(namespace, id, callback) {
  var self = this;

  this.cache.get(namespace, id, function(err, cached) {
    if(err) return callback(err);
    if(cached) return callback(null, cached);

    self.connection.get(namespace, id, function(err, result) {
      if(err) return callback(err);
      if(!result) return callback(null, result);

      self.cache.save(namespace, id, result, function(err, data) {
        if(err) return callback(err);
        return callback(null, result);
      });
    });
  });
};

/**
 * Create
 *
 * @param {String} namespace
 * @param {Object} attrs
 * @param {Function} callback
 */

Cache.prototype.create = function(namespace, attrs, callback) {
  var next,
      self = this;

  this.connection.create(namespace, attrs, function(err, data) {
    if(err) return callback(err);

    // Ensure attrs doesn't get bonked
    next = common.clone(data);
    self.cache.save(namespace, next.id, next, function(err, cache) {
      if(err) return callback(err);
      return callback(null, data);
    });
  });
};

/**
 * Update/Save
 *
 * @param {String} namespace
 * @param {String} id
 * @param {Object} attrs
 * @param {Function} callback
 */

Cache.prototype.save = function(namespace, id, attrs, callback) {
  var self = this,
      next = common.clone(attrs); // Ensure attrs doesn't get bonked

  /**
   * TODO: this could be a problem with engines such as mysql,
   * where an update is different than a create.
   * Eg. a record is not in cache yet
   */
  this.connection.save(namespace, id, attrs, function(err, data) {
    if(err) return callback(err);
    self.cache.save(namespace, id, next, function(err) {
      if(err) return callback(err);
      return callback(null, data);
    });
  });
};

/**
 * Cache.update() is essentially an alias to Cache.save()
 */

Cache.prototype.update = Cache.prototype.save;

/**
 * Delete to record from the cache, and then
 * the underlying connection
 *
 * @param {String} namespace
 * @param {String} id
 * @param {Function} callback
 */

Cache.prototype.destroy = function(namespace, id, callback) {
  var self = this;

  this.cache.destroy(namespace, id, function(err) {
    if(err) return callback(err);
    return self.connection.destroy(namespace, id, callback);
  });
};

/**
 * Non-cached functions
 */

Cache.prototype.find = function() {
  this.connection.find.apply(this.connection, arguments);
};

Cache.prototype.all = function() {
  this.connection.all.apply(this.connection, arguments);
};