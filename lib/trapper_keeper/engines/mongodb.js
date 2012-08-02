var EventEmitter2 = require('eventemitter2').EventEmitter2,
    util = require('utile'),
    url = require('url'),
    mongo = require('mongodb');

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

  // Create a new connection to Mongo
  new mongo.Db(options.database, new mongo.Server(options.host, options.port, {})).open(function(err, db) {
    self.connection = db;
  });
};

util.inherits(Mongodb, EventEmitter2);

Mongodb.prototype.get = function get(id, namespace, callback) {
  callback(null);
};

Mongodb.prototype.create = function create(attrs, namespace, callback) {
  callback(null);
};

Mongodb.prototype.save = function save(obj, namespace, callback) {
  callback(null);
};

Mongodb.prototype.destroy = function destroy(id, namespace, callback) {
  callback(null);
};

Mongodb.prototype.update = function update(id, obj, namespace, callback) {
  callback(null);
};

Mongodb.prototype.find = function find(conditions, namespace, callback) {
  callback(null);
};

Mongodb.prototype.all = function all(namespace, callback) {
  callback(null);
};