var trapper_keeper = require('../lib/trapper_keeper'),
    assert = require('assert'),
    should = require('should');

describe('trapper_keeper', function() {

  describe("connect()", function() {
    var db;

    before(function() {
      db = trapper_keeper.Connect('mongodb', 'mongodb://127.0.0.1', 27017, { database: 'awesome' });
    });

    it("should create a connection object", function() {
      db.options.should.have.property('database');
      db.options.should.have.property('host');
      db.options.should.have.property('port');
      db.options.should.have.property('uri');
    });
  });

});