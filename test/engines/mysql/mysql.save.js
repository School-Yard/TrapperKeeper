var Support = require('./mysql.support'),
    should = require('should');

describe('mysql .save()', function() {
  var MySQL,
      mockObject = {name: 'Screetch', title: 'student'};

  before(function(done) {
    MySQL = Support.Setup(done);
  });

  after(function(done) {
    Support.Teardown(done);
  });

  describe('should save', function() {
    var record;

    before(function(done) {
      MySQL.create(mockObject, function(err, result) {
        record = result;
        return done();
      });
    });

    it('a record', function(done) {
      record.title = 'faculty';
      MySQL.save(record.id, record, function(err, result) {
        should.not.exist(err);
        result.title.should.equal('faculty');
        return done();
      });
    });
  });

});