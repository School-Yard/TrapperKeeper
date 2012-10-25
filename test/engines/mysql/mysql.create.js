var Support = require('./mysql.support'),
    should = require('should');

describe('mysql .create()', function() {
  var MySQL,
      mockObject = {name: 'Screetch', title: 'student'};

  before(function(done) {
    MySQL = Support.Setup(done);
  });

  after(function(done) {
    Support.Teardown(done);
  });

  it('should insert object and return it with an id', function(done) {
    MySQL.create(mockObject, function(err, result) {
      result.should.be.a('object');
      result.should.have.property('title', mockObject.title);
      result.should.have.property('name', mockObject.name);
      return done(err);
    });
  });

});