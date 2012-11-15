var MySQL,
    Support = module.exports,
    TK = require('../../../lib/trapper_keeper');


Support.Setup = function(callback) {
  var Table,
      options = {
        database: 'test',
        user: 'test',
        password: 'testing'
  };

  MySQL = TK.Connect('mysql', 'mysql://127.0.0.1', 3306, options);
  Table = MySQL.resource('test');

  MySQL.on('ready', function() {
    MySQL.Connection.query(
      'CREATE TABLE IF NOT EXISTS test (' +
        '`id` INT unsigned AUTO_INCREMENT PRIMARY KEY,' +
        '`title` VARCHAR(255),' +
        '`name` VARCHAR(255)) ENGINE=INNODB',
    callback);
  });

  // Return the resource object for use in the test cases
  return Table;
};

Support.Teardown = function(callback) {
  MySQL.Connection.query('DROP TABLE IF EXISTS test_two, test',
    callback);
};