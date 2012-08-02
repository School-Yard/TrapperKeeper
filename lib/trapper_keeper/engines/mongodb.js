var EventEmitter2 = require('eventemitter2').EventEmitter2,
    util = require('utile'),
    url = require('url'),
    mongo = require('mongodb'),
    ObjectID = require('mongodb').ObjectID;

var Mongodb = module.exports = function Mongodb(options) {

  if (options.uri) {
    var uri = url.parse(options.uri, true);
    options.host = uri.hostname;
    options.port = uri.port;

    if (uri.pathname) {
      options.database = uri.pathname.replace(/^\/|\/$/g, '');
    }
  }

  options.host     = options.host     || '127.0.0.1';
  options.port     = options.port     || 27017;
  options.database = options.database || 'test';
  options.safe     = (String(options.safe) === 'true');

  options.uri = url.format({
    protocol: 'mongodb',
    hostname: options.host,
    port: options.port,
    pathname: '/' + options.database
  });

  options.port = parseInt(options.port, 10);

  this.options = options;

  var self = this;

  EventEmitter2.call(this, {
    wildcard: true,
    delimiter: '::',
    maxListeners: 0
  });

  // Create a new connection to Mongo
  new mongo.Db(options.database, new mongo.Server(options.host, options.port, {})).open(function(err, db) {
    self.connection = db;
    self.emit('ready');
  });

  return this;
};

util.inherits(Mongodb, EventEmitter2);

// Normalize a mongo _id property into an id property
function normalize(obj) {
  if(!obj) return;

  if(obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }

  return obj;
}

Mongodb.prototype.get = function get(id, namespace, callback) {
  if(id && typeof id === 'string') {
    id = {'_id': ObjectID(id)};
  }

  this.connection.collection(namespace, function(err, collection) {
    collection.findOne(id, function(err, doc) {
      if(err) return callback(err);

      callback(null, normalize(doc) || {});
    });
  });
};

Mongodb.prototype.create = function create(attrs, namespace, callback) {
  var self = this;

  this.connection.collection(namespace, function(err, collection) {
    collection.insert(attrs, {safe: self.options.self}, function(err, doc) {
      if(err) return callback(err);

      callback(null, normalize(doc[0]) || {});
    });
  });
};

Mongodb.prototype.save = function save(id, attrs, namespace, callback) {
  var self = this;

  if(id && typeof id === 'string') {
    attrs._id = ObjectID(id.toString());
    delete attrs.id;
  }

  this.connection.collection(namespace, function(err, collection) {
    collection.save(attrs, {safe: self.options.safe}, function(err, result) {
      if(err) return callback(err);
      collection.findOne(attrs, function(err, doc) {
        if(err) return callback(err);
        callback(null, normalize(doc) || {});
      });
    });
  });
};

Mongodb.prototype.destroy = function destroy(id, namespace, callback) {
  var self = this;

  if(id && typeof id === 'string') {
    id = {'_id': ObjectID(id)};
  }

  this.connection.collection(namespace, function(err, collection) {
    collection.remove(id, {safe: self.options.safe}, callback);
  });
};

Mongodb.prototype.update = function update(id, attrs, namespace, callback) {
  var self = this;

  if(id && typeof id === 'string') {
    id = {'_id': ObjectID(id)};
  }

  this.connection.collection(namespace, function(err, collection) {
    collection.update(id, {$set: attrs}, {safe: self.options.safe}, function(err) {
      if(err) return callback(err);
      collection.findOne(id, function(err, doc) {
        if(err) return callback(err);
        callback(null, normalize(doc) || {});
      });
    });
  });
};

Mongodb.prototype.find = function find(conditions, namespace, callback) {
  this.connection.collection(namespace, function(err, collection) {
    collection.find(conditions).toArray(function(err, results) {
      if(err) return callback(err);
      var normalized = [];
      results.forEach(function(obj) {
        normalized.push(normalize(obj));
      });

      callback(null, normalized);
    });
  });
};

Mongodb.prototype.all = function all(namespace, callback) {
  this.connection.collection(namespace, function(err, collection) {
    collection.find().toArray(function(err, results) {
      if(err) return callback(err);
      var normalized = [];
      results.forEach(function(obj) {
        normalized.push(normalize(obj));
      });

      callback(null, normalized);
    });
  });
};