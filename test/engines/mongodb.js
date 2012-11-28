var trapper_keeper = require('../../lib/trapper_keeper'),
    assert = require('assert'),
    should = require('should');

var db, resource;

before(function(done) {
  db = trapper_keeper.Connect('mongodb', 'mongodb://127.0.0.1', 27017, { database: 'test', safe: true });
  resource = db.resource('test');

  db.on('ready', function() {
    db.connection.collection('test', function(err, collection) {
      collection.drop(function() {
        done();
      });
    });
  });
});

after(function(done) {
  db.connection.collection('test', function(err, collection) {
    collection.drop(function() {
      done();
    });
  });
});

describe('mongodb', function() {

  describe('.get()', function() {
    var res;

    before(function(done) {
      var record = { name: 'Screetch', title: 'student' };
      resource.create(record, function(err, result) {
        res = result;
        done();
      });
    });

    it('should return a record by id', function(done) {
      resource.get(res.id, function(err, result) {
        result.name.should.equal('Screetch');
        result.title.should.equal('student');
        done();
      });
    });
  });

  describe('.create()', function() {

    it('should insert a record', function(done) {
      var record = { name: 'Screetch', title: 'student' };
      resource.create(record, function(err, result) {
        result.name.should.equal('Screetch');
        done();
      });
    });
  });

  describe('.save()', function() {
    var document;

    before(function(done) {
      var record = { name: 'Screetch', title: 'student' };
      resource.create(record, function(err, result) {
        document = result;
        done();
      });
    });

    it('should save a record', function(done) {
      document.title = 'faculty';
      resource.save(document.id, document, function(err, result) {
        result.title.should.equal('faculty');
        done();
      });
    });
  });

  describe('.destroy()', function() {
    var document;

    before(function(done) {
      var record = { name: 'Screetch', title: 'student' };
      resource.create(record, function(err, result) {
        document = result;
        done();
      });
    });

    it('should destroy a record', function(done) {
      resource.destroy(document.id, function(err, result) {
        resource.get(document.id, function(err, res) {
          should.not.exist(res);
          done();
        });
      });
    });
  });

  describe('.update()', function() {
    var document;

    before(function(done) {
      var record = { name: 'Screetch', title: 'student' };
      resource.create(record, function(err, result) {
        document = result;
        done();
      });
    });

    it('should update a record', function(done) {
      document.title = 'faculty';
      resource.update(document.id, document, function(err, result) {
        result.title.should.equal('faculty');
        done();
      });
    });
  });

  describe('.find()', function() {
    var document;

    before(function(done) {
      var record = { name: 'Screetch', title: 'student' };
      resource.create(record, function(err, result) {
        document = result;
        done();
      });
    });

    it('should find all records with title student', function(done) {
      resource.find({title: 'student'}, function(err, result) {
        result.should.have.length(3);
        done();
      });
    });
  });

  describe('.all()', function() {
    var document;

    before(function(done) {
      var record = { name: 'Screetch', title: 'faculty' };
      resource.create(record, function(err, result) {
        document = result;
        done();
      });
    });

    it('should find all records', function(done) {
      resource.all(function(err, result) {
        result.should.be.an.instanceOf(Array);
        result.length.should.eql(6);
        done();
      });
    });
  });

});