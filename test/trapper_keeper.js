var trapper_keeper = require('../lib/trapper_keeper'),
    assert = require('assert'),
    should = require('should');

describe('trapper_keeper', function() {

  describe("connect()", function() {
    var db; 

    before(function() {
      db = trapper_keeper.connect('mongodb', 'mongodb://127.0.0.1', 27017, { database: 'awesome' });
    });

    it("should create a connection object", function() {
      db.connection.options.should.have.property('database');
      db.connection.options.should.have.property('host');
      db.connection.options.should.have.property('port');
      db.connection.options.should.have.property('uri');
    });
  });

  describe("resource()", function() {
    var db, Resource;

    before(function() {
      db = trapper_keeper.connect('mongodb', 'mongodb://127.0.0.1', 27017, { database: 'awesome' });
      Resource = trapper_keeper.resource('test');
    });

    it("should return a function", function() {
      trapper_keeper.resource.should.be.a('function');
    });

    it("should have all the methods", function() {
      Resource.get.should.be.a('function');
      Resource.create.should.be.a('function');
      Resource.save.should.be.a('function');
      Resource.destroy.should.be.a('function');
      Resource.update.should.be.a('function');
      Resource.find.should.be.a('function');
      Resource.all.should.be.a('function');
    });

  });

});