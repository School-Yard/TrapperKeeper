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
  var uri;

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
  createConnection.call(this);

  function createConnection() {
    var self = this;

    // Create the mysql connection
    this.connection = mysql.createConnection(options);
    this.connection.connect(function(err) {
      if(err) throw err;
      return self.emit('ready');
    });

    /**
     * Attempt to reconnect in the event of a fatal error
     */
    this.connection.on('error', function(err) {
      if(!err.fatal) return;
      return createConnection.call(self);
    });
  }

  return this;
};

util.inherits(MySQL, Engine);

MySQL.prototype.get = function get(namespace, id, callback) {
  this.connection.query('SELECT * FROM ' + namespace + ' WHERE ?', {id: id}, function(err, results) {
    if(err) return callback(err);
    return callback(null, results[0] || null);
  });
};

MySQL.prototype.create = function create(namespace, attrs, callback) {
  var self = this;

  this.connection.query('INSERT INTO ' + namespace + ' SET ?', attrs, function(err, result) {
    if(err) return callback(err);
    return self.get(namespace, result.insertId, callback);
  });
};

MySQL.prototype.save = function save(namespace, id, attrs, callback) {
  var self = this;

  this.connection.query('UPDATE ' + namespace + ' SET ? WHERE ?', [attrs, {id: id}], function(err) {
    if(err) return callback(err);
    return self.get(namespace, id, callback);
  });
};

MySQL.prototype.destroy = function destroy(namespace, id, callback) {
  this.connection.query('DELETE FROM ' + namespace + ' WHERE ?', {id: id}, function(err, result) {
    if(err) return callback(err);
    return callback(null, result.affectedRows > 0 ? 1 : 0);
  });
};

MySQL.prototype.update = function update(namespace, id, attrs, callback) {
  var self = this;

  this.connection.query('UPDATE ' + namespace + ' SET ? WHERE ?', [attrs, {id: id}], function(err) {
    if(err) return callback(err);
    return self.get(namespace, id, callback);
  });
};

/**
 * Options:
 *
 * Namespace = 'users'
 * {
 *   join: {
 *     'namespace': 'settings',
 *     'field': 'user_id'
 *     'type': 'inner'
 *   }
 * }
 *   Builds the statement:
 *    'SELECT * FROM users INNER JOIN settings ON users.id = settings.user_id'
 */
MySQL.prototype.find = function find(namespace, conditions, options, callback) {
  var query,
      constraints,
      queryTail;

  constraints = buildConstraints(namespace, conditions, this.connection.escape);
  query = 'SELECT * FROM ' + namespace;

  if(typeof callback === 'function') {

    // Was join passed in the options object?
    if(typeof options.join !== 'undefined') {
      var join = options.join,
          acceptedJoins = ['inner', 'left', 'right'];

      // Make sure the args meet the requirements
      if(typeof join.type === 'undefined' ||
         typeof join.namespace === 'undefined' ||
         !~acceptedJoins.indexOf(join.type)) {
        // If not return invalid options error
        return callback(new Error('Invalid options for join'));
      }

      query += ' ' + join.type.toUpperCase();
      query += ' JOIN ' + join.namespace + ' ON ';
      query += namespace + '.id=' + join.namespace + '.' + (join.field || (namespace + '_id'));
    }
  }
  else {
    // Set callback to options the function was called with (namespace, conditions, callback)
    callback = options;
  }

  this.connection.query(query + constraints, function(err, results) {
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

/**
 * MySQL engine helper functions
 */
function buildConstraints(namespace, conditions, escapeFn) {
  var results = [],
      keys = Object.keys(conditions),
      len = keys.length,
      constraints = ' WHERE ?';

  if(!len) return '';

  keys.forEach(function(key, idx) {
    // Check if the table names are included
    var token = ~key.indexOf('.') ? key : namespace + '.' + key;
    results.push(token + '=' + escapeFn(conditions[key]));
    if(idx !== len - 1) constraints += ' AND';
  });

  return ' WHERE ' + results.join(' AND ');
}