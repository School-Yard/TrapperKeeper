var trapper_keeper = require('../../../lib/trapper_keeper'),
    should = require('should');

describe('memory', function() {
  var db;

  before(function(done) {
    db = trapper_keeper.Connect('memory');
    db.on('ready', function() {
      done();
    });
  });

  describe('.create()', function() {
    var Resource;
    before(function() {
      Resource = db.resource('test');
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