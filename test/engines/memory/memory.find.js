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

  describe('.find()', function() {
    describe('by attribute', function() {
      var Resource;
      before(function() {
        Resource = db.resource('test');
      });

      before(function(done) {
        var attrs = { name: 'Screetch', title: 'student' };
        Resource.create(attrs, function(err, result) {
          done();
        });
      });

      it('should return an array of objects', function(done) {
        Resource.find({ name: 'Screetch'}, function(err, result) {
          result.should.be.an.instanceOf(Array);
          result.length.should.equal(1);
          done();
        });
      });

      it('should return an empty array if no matches', function(done) {
        Resource.find({}, function(err, result) {
          result.should.be.an.instanceOf(Array);
          result.length.should.equal(0);
          done();
        });
      });
    });

    describe('when multiple namespaces', function() {
      var ns1, ns2;
      before(function(done) {
        ns1 = db.resource('ns1');
        ns2 = db.resource('ns2');

        var attrs = { name: 'Screetch', title: 'student' };

        ns1.create(attrs, function(err) {
          ns2.create(attrs, function(err) {
            done(err);
          });
        });
      });

      it('should only return records from the namespace', function(done) {
        ns1.find({ name: 'Screetch'}, function(err, result) {
          result.should.be.an.instanceOf(Array);
          result.length.should.equal(1);
          done();
        });
      });
    });
  });
});