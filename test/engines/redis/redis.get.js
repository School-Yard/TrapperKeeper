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

  describe('.get()', function() {
    var Resource;
    before(function() {
      Resource = connection.resource('test');
    });

    describe('with valid record', function() {
      var result;

      before(function(done) {
        var attrs = { name: 'Screetch', title: 'student' };
        Resource.create(attrs, function(err, record) {
          result = record;
          done();
        });
      });

      it('should return a record by id', function(done) {
        Resource.get(result.id, function(err, record) {
          record.name.should.equal('Screetch');
          record.title.should.equal('student');
          done();
        });
      });
    });

    describe('with an invalid record', function() {
      it('should return an empty object', function(done) {
        Resource.get(100, function(err, record) {
          should.not.exist(record);
          done();
        });
      });
    });
  });
});