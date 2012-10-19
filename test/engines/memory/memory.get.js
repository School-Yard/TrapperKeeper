var trapper_keeper = require('../../../lib/trapper_keeper'),
    should = require('should');

describe('memory', function() {
  var db;

  before(function(done) {
    db = trapper_keeper.connect('memory');
    db.on('ready', function() {
      done();
    });
  });

  describe('.get()', function() {
    var Resource;
    before(function() {
      Resource = db.resource('test');
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