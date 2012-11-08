var Support = require('./mysql.support'),
    should = require('should');

describe('mysql .find()', function() {
  var MySQL,
      mockObject = {name: 'Screetch', title: 'student'};

  before(function(done) {
    MySQL = Support.Setup(function(err) {
      if(err) return done(err);
      MySQL.connection.connection.query(
      'CREATE TABLE IF NOT EXISTS test_two (' +
        '`id` INT unsigned AUTO_INCREMENT PRIMARY KEY,' +
        '`parent` INT unsigned,' +
        '`details` VARCHAR(255),' +
        'FOREIGN KEY (parent) REFERENCES test(id)' +
        ')ENGINE=INNODB', done);
    });
  });

  after(function(done) {
    Support.Teardown(done);
  });

  describe('should find', function() {
    var record;

    before(function(done) {
      MySQL.create(mockObject, function(err, result) {
        record = result;
        return done(err);
      });
    });

    it('all records with correct title', function(done) {
      MySQL.find({title: 'student'}, function(err, results) {
        should.not.exist(err);
        results.should.have.length(1);
        return done();
      });
    });

    it('all records with corrent title and name', function(done) {
      MySQL.find({name: 'Screetch', title: 'student'}, function(err, results) {
        should.not.exist(err);
        results.should.have.length(1);
        return done();
      });
    });

    it('should join roles table', function(done) {
      MySQL.find({name: 'Screetch'}, {
        join: {
          namespace: 'test_two',
          field: 'parent',
          type: 'left'
        }
      }, function(err, results) {

        should.not.exist(err);
        should.exist(results);
        results.should.have.length(1);
        results[0].should.have.keys('id','parent','details','name','title');
        return done();
      });
    });
  });

});