var TK = require('../../../lib/trapper_keeper'),
    should = require('should');

describe('redis', function() {
  var connection;

  before(function(done) {
    connection = TK.Connect('redis');
    connection.on('ready', function() {
      done();
    });
  });

  after(function(done) {
    connection.connection.flushall(function(err) {
      done(err);
    });
  });

  describe('.save()', function() {
    var Resource;
    before(function() {
      Resource = connection.resource('test');
    });

    it('should save a record', function(done) {
      var attrs = { id: 100, name: 'test' };
      Resource.save(100, attrs, function(err, result) {
        result.name.should.equal('test');
        done();
      });
    });

    it('should return an id in the attributes', function(done) {
      var attrs = { name: 'test' };
      Resource.save(101, attrs, function(err, result) {
        result.id.should.equal('101');
        result.name.should.equal('test');
        done();
      });
    });
  });
});