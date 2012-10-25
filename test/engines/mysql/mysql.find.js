var Support = require('./mysql.support'),
    should = require('should');

describe('mysql .find()', function() {
  var MySQL,
      mockObject = {name: 'Screetch', title: 'student'};

  before(function(done) {
    MySQL = Support.Setup(done);
  });

  after(function(done) {
    Support.Teardown(done);
  });

  describe('should find', function() {
    var record;

    before(function(done) {
      MySQL.create(mockObject, function(err, result) {
        record = result;
        return done(err);
      });
    });

    it('all records with title student', function(done) {
      MySQL.find({title: 'student'}, function(err, results) {
        should.not.exist(err);
        results.should.have.length(1);
        return done();
      });
    });
  });

});