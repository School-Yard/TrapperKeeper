var Support = require('./mysql.support'),
    should = require('should');

describe('mysql .destroy()', function() {
  var MySQL,
      mockObject = {name: 'Screetch', title: 'student'};

  before(function(done) {
    MySQL = Support.Setup(done);
  });

  after(function(done) {
    Support.Teardown(done);
  });

  describe('when record exists', function() {
    var record;

    before(function(done) {
      MySQL.create(mockObject, function(err, result) {
        record = result;
        return done(err);
      });
    });

    it('should remove the record', function(done) {
      MySQL.destroy(record.id, function(err, result) {
        result.should.equal(1);
        return done(err);
      });
    });
  });

});