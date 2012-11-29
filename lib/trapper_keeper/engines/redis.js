var Engine = require('../engine'),
    util = require('util'),
    url = require('url'),
    redis = require('redis');

/**
 * redis engine
 * - `namespace:keys` keeps track of all keys
 * - `namespace:id` keeps track of the next id
 *
 * @params {Object} options
 */

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
 * Attempt to get the record with the given `id`
 */

Redis.prototype.get = function get(namespace, id, callback) {
  var obj,
      key = namespace + ':id:' + id;

  this.connection.get(key, function(err, data) {
    if(err) return callback(err);
    if(!data) return callback(null, null);

    obj = parseReply(data);
    return obj instanceof Error ?
                callback(obj) : callback(null, assignId(id, obj));
  });
};

/**
 * Increment the id key and set the attributes
 */

Redis.prototype.create = function create(namespace, attrs, callback) {
  var key,
      self = this,
      data = stringifyObject(attrs),
      idKey = namespace + ':meta:id',
      indexKey = namespace + ':meta:members';

  if(data instanceof Error) {
    return callback(data);
  }

  this.connection.get(idKey, function(err, id) {
    if(err) return callback(err);

    id = id || 1;
    key = namespace + ':id:' + (++id);

    self.connection.set(key, data, function(err) {
      if(err) return callback(err);

      self.connection.set(idKey, id, function(err) {
        if(err) return callback(err);

        self.connection.sadd(indexKey, key, function(err) {
          if(err) return callback(err);
          return callback(null, assignId(id, attrs));
        });
      });
    });
  });
};

/**
 * Save the record regardless of existence
 */

Redis.prototype.save = function save(namespace, id, attrs, callback) {
  var self = this,
      key = namespace + ':id:' + id,
      data = stringifyObject(attrs),
      indexKey = namespace + ':meta:members';

  if(data instanceof Error) {
    return callback(data);
  }

  this.connection.set(key, data, function(err) {
    if(err) return callback(err);

    self.connection.sadd(indexKey, key, function(err) {
      if(err) return callback(err);
      return callback(null, assignId(id, attrs));
    });
  });
};

/**
 * If the id exists, update it; if not, return an error
 */

Redis.prototype.update = function update(namespace, id, attrs, callback) {
  var self = this,
      key = namespace + ':id:' + id,
      data = stringifyObject(attrs);

  if(data instanceof Error) {
    return callback(data);
  }

  this.connection.exists(key, function(err, exists) {
    if(err) return callback(err);
    if(!exists) return callback(new Error('No record found with that id'));

    self.connection.set(key, data, function(err) {
      if(err) return callback(err);
      return callback(null, assignId(id, attrs));
    });
  });
};

/**
 * Delete from `namespace:meta:members` and delete key `namespace:id:id`
 */

Redis.prototype.destroy = function destroy(namespace, id, callback) {
  var self = this,
      key = namespace + ':id:' + id,
      indexKey = namespace + ':meta:members';

  this.connection.srem(indexKey, key, function(err) {
    if(err) return callback(err);

    self.connection.del(key, function(err, res) {
      if(err) return callback(err);
      if(!res) return callback(new Error('No record found with that id'), res);
      return callback(null, res);
    });
  });

};

/**
 * Search through all items in `namespace:meta:members`
 */

Redis.prototype.find = function find(namespace, conditions, callback) {
  var i, len,
      self = this,
      results = [],
      indexKey = namespace + ':meta:members';

  this.connection.smembers(indexKey, function(err, members) {
    if(err) return callback(err);
    if(!members || !members.length) return callback(null, results);

    i = 0;
    len = members.length;

    members.forEach(function(key) {
      getAndFilter(key, function() {
        if(err) {
          callback(err);
          callback = function() {};
        }
        i += 1;
        if(i === len) return callback(null, results);
      });
    });
  });

  function filter(item, callback) {
    var valid = Object.keys(conditions).every(function(key) {
      return item[key] && item[key] === conditions[key] ? true : false;
    });

    return callback(valid);
  }

  function getAndFilter(key, callback) {
    var data;

    self.connection.get(key, function(err, reply) {
      if(err) return callback(err);

      data = parseReply(reply);

      // Silently ignore errors
      if(data instanceof Error) return;

      filter(data, function(valid) {
        if(valid) results.push(data);
        return callback();
      });
    });
  }
};

/**
 * get for all items in `namespace:meta:members`
 */

Redis.prototype.all = function all(namespace, callback) {
  var i, len,
      results = [],
      self = this,
      indexKey = namespace + ':meta:members';

  this.connection.smembers(indexKey, function(err, members) {
    if(err) return callback(err);
    if(!members || !members.length) return callback(null, results);

    i = 0;
    len = members.length;

    members.forEach(function(key) {
      self.connection.get(key, function(err, data) {
        if(err) {
          callback(err);
          callback = function() {};
        }

        data = parseReply(data);
        if(data instanceof Error) return;

        i += 1;
        results.push(data);
        if(i === len) return callback(null, results);
      });
    });
  });
};

/**
 * redis engine helpers
 */

function assignId(id, attrs) {
  if(!attrs) {
    return null;
  }

  attrs.id = String(id);
  return attrs;
}

function parseReply(reply) {
  var data;

  try {
    data = JSON.parse(reply);
  }
  catch(e) {
    data = new Error('Error parsing redis reply');
  }

  return data;
}

function stringifyObject(obj) {
  var data;

  try {
    data = JSON.stringify(obj);
  }
  catch(e) {
    data = new Error('Error serializing data');
  }

  return data;
}