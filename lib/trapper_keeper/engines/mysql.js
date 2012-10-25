var Engine = require('../engine'),
    util = require('util'),
    url = require('url'),
    mysql = require('mysql');


/**
 * Constructor for the mysql engine
 *
 * Example options object:
 *  {
 *    host: 'xyz',
 *    port: 1234,
 *    user: 'root',
 *    password: '',
 *    database: 'example',
 *  }
 *
 * @param {object} options
 */
var MySQL = module.exports = function MySQL(options) {
  var uri,
      self = this;

  if((!options.host && !options.uri) || !options.user || !options.database) {
    throw new Error('Required options missing from MySQL engine.');
  }

  // Call parent class constructor
  Engine.call(this, options);

  if(options.uri) {
    uri = url.parse(options.uri, true);
    options.host = uri.hostname;
    options.port = uri.port || options.port;

    if(uri.pathname) {
      options.database = uri.pathname.replace(/^\/|\/$/g, '');
    }
  }

  options.host = options.host || '127.0.0.1';
  options.user = options.user || 'root';
  options.password = options.password || '';
  options.safe = typeof options.safe === 'boolean' ? options.safe : true;
  createConnection();

  function createConnection() {
    // Create the mysql connection
    self.connection = mysql.createConnection(options);
    self.connection.connect(function(err) {
      if(err) throw err;
      return self.emit('ready');
    });

    /**
     * Attempt to reconnect in the event of a fatal error
     */
    self.connection.on('error', function(err) {
      if(!err.fatal) return;
      return createConnection();
    });
  }

  return this;
};

util.inherits(MySQL, Engine);


MySQL.prototype.get = function get(id, namespace, callback) {
  this.connection.query('SELECT * FROM ' + namespace + ' WHERE ?', {id: id}, function(err, results) {
    if(err) return callback(err);
    return callback(null, results[0] || null);
  });
};

MySQL.prototype.create = function create(attrs, namespace, callback) {
  var self = this;

  this.connection.query('INSERT INTO ' + namespace + ' SET ?', attrs, function(err, result) {
    if(err) return callback(err);
    return self.get(result.insertId, namespace, callback);
  });
};

MySQL.prototype.save = function save(id, attrs, namespace, callback) {
  var self = this;

  this.connection.query('UPDATE ' + namespace + ' SET ? WHERE ?', [attrs, {id: id}], function(err) {
    if(err) return callback(err);
    return self.get(id, namespace, callback);
  });
};

MySQL.prototype.destroy = function destroy(id, namespace, callback) {
  this.connection.query('DELETE FROM ' + namespace + ' WHERE ?', {id: id}, function(err, result) {
    if(err) return callback(err);
    return callback(null, result.affectedRows > 0 ? 1 : 0);
  });
};

MySQL.prototype.update = function update(id, attrs, namespace, callback) {
  var self = this;

  this.connection.query('UPDATE ' + namespace + ' SET ? WHERE ?', [attrs, {id: id}], function(err) {
    if(err) return callback(err);
    return self.get(id, namespace, callback);
  });
};

MySQL.prototype.find = function find(conditions, namespace, callback) {
  this.connection.query('SELECT * FROM ' + namespace + ' WHERE ?', conditions, function(err, results) {
    if(err) return callback(err);
    return callback(null, results);
  });
};

MySQL.prototype.all = function all(namespace, callback) {
  this.connection.query('SELECT * FROM ' + namespace, function(err, results) {
    if(err) return callback(err);
    return callback(null, results);
  });
};