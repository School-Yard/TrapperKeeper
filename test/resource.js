var trapper_keeper = require('../lib/trapper_keeper'),
    assert = require('assert'),
    should = require('should');

describe("resource()", function() {
  var db, Resource;

  before(function() {
    db = trapper_keeper.connect('memory');
    Resource = db.resource('test');
  });

  it("should return a function", function() {
    db.resource.should.be.a('function');
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