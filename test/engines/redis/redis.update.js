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

  describe('.update()', function() {
    var Resource, doc;

    before(function(done) {
      Resource = connection.resource('test');
      var attrs = { name: 'Screetch', title: 'student' };
      Resource.create(attrs, function(err, result) {
        doc = result;
        done();
      });
    });

    describe('when record exist', function() {
      it('should update a record', function(done) {
        doc.title = 'faculty';
        Resource.update(doc.id, doc, function(err, result) {
          result.title.should.equal('faculty');
          done();
        });
      });
    });

    describe('when record does not exist', function() {
      it('should return a status', function(done) {
        Resource.update(100, doc, function(err, result) {
          should.exist(err);
          err.message.should.equal('No record found with that id');
          done();
        });
      });

      it('should return an error', function(done) {
        Resource.update(100, doc, function(err, result) {
          should.exist(err);
          err.message.should.equal('No record found with that id');
          done();
        });
      });
    });
  });
});