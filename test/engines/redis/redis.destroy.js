var TK = require('../../../lib/trapper_keeper'),
    should = require('should');

describe('redis', function() {
  var db;

  before(function(done) {
    db = TK.connect('redis');
    db.on('ready', function() {
      done();
    });
  });

  describe('.destroy()', function() {
    var Resource, doc;

    before(function(done) {
      Resource = db.resource('test');
      var attrs = { name: 'Screetch', title: 'student' };
      Resource.create(attrs, function(err, result) {
        doc = result;
        done();
      });
    });

    describe('when record exists', function() {
      it('should return a status', function(done) {
        Resource.destroy(doc.id, function(err, result) {
          result.should.equal(1);
          done();
        });
      });

      it('should remove the record', function(done) {
        Resource.get(doc.id, function(err, result) {
          should.not.exist(result);
          done();
        });
      });
    });

    describe('when record does not exists', function() {
      it('should return a status', function(done) {
        Resource.destroy(100, function(err, result) {
          should.exist(err);
          result.should.equal(0);
          done();
        });
      });

      it('should return an error', function(done) {
        Resource.destroy(100, function(err, result) {
          should.exist(err);
          err.message.should.equal('No record found with that id');
          done();
        });
      });
    });
  });
});