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

  describe('.create()', function() {
    var Resource;
    before(function() {
      Resource = connection.resource('test');
    });

    it('should insert a record', function(done) {
      var attrs = { name: 'Screetch', title: 'student' };
      Resource.create(attrs, function(err, result) {
        // Get the record to ensure it was inserted
        Resource.get(result.id, function(err, res) {
          res.name.should.equal('Screetch');
          done();
        });
      });
    });
  });
});