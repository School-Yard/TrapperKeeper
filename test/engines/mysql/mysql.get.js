var Support = require('./mysql.support'),
    should = require('should');

describe('mysql .get()', function() {
  var MySQL,
      mockObject = {name: 'Screetch', title: 'student'};

  before(function(done) {
    MySQL = Support.Setup(done);
  });

  after(function(done) {
    Support.Teardown(done);
  });

  describe('should return', function() {
    var record;

    before(function(done) {
      MySQL.create(mockObject, function(err, result) {
        record = result;
        return done(err);
      });
    });

    it('record by id', function(done) {
      MySQL.get(record.id, function(err, result) {
        result.name.should.equal(mockObject.name);
        result.title.should.equal(mockObject.title);
        return done();
      });
    });
  });

});