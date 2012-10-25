var Support = require('./mysql.support'),
    should = require('should');

describe('mysql .all()', function() {
  var MySQL,
      mockObject = {name: 'Screetch', title: 'student'};

  before(function(done) {
    MySQL = Support.Setup(done);
  });

  after(function(done) {
    Support.Teardown(done);
  });

  describe('without resources', function() {
    var records;

    before(function(done) {
      MySQL.all(function(err, results) {
        records = results;
        return done(err);
      });
    });

    it('should be an empty array', function() {
      records.should.be.instanceOf(Array);
      records.length.should.equal(0);
    });
  });

  describe('with resources', function() {
    var records;

    before(function(done) {
      MySQL.create(mockObject, function(err, result) {
        MySQL.all(function(err, results) {
          records = results;
          return done();
        });
      });
    });

    it('should have one record', function() {
      records.length.should.equal(1);
      records[0].should.have.property('title', mockObject.title);
      records[0].should.have.property('name', mockObject.name);
    });
  });

});