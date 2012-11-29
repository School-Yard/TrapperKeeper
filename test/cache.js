var TK = require('../lib/trapper_keeper'),
    Cache = require('../lib/trapper_keeper/cache'),
    Memory = require('../lib/trapper_keeper/engines/memory'),
    Redis = require('../lib/trapper_keeper/engines/redis'),
    should = require('should');

describe('Cache', function() {
  var resource;

  before(function(done) {
    var connection = TK.Connect('redis');

    connection.on('ready', function() {
      resource = connection.resource('test');
      resource.cache('memory');
      done();
    });
  });

  describe('can be defined with #cache()', function() {

    it('and resource.connection should be instance of Cache', function() {
      resource.connection.should.be.instanceof(Cache);
    });

    it('and cache should have properties #cache, #connection', function() {
      resource.connection.should.have.property('cache');
      resource.connection.cache.should.be.instanceof(Memory);
      resource.connection.should.have.property('connection');
      resource.connection.connection.should.be.instanceof(Redis);
    });
  });

  describe('#get()', function() {
    var record;

    before(function(done) {
      var obj = { name: 'John', age: 4 };
      resource.create(obj, function(err, results) {
        record = results;
        done(err);
      });
    });

    after(function(done) {
      resource.destroy(record.id, function(err) {
        done(err);
      });
    });

    it('should cache results', function(done) {
      resource.get(record.id, function(err, result) {
        should.not.exist(err);
        result.should.eql(record);

        resource.connection.cache.get(resource.namespace,
          record.id, function(err, cached) {
            should.not.exist(err);
            cached.should.eql(record);
            done();
        });
      });
    });
  });

  describe('#create()', function() {
    var record;

    before(function(done) {
      resource.create({ name: 'John', age: 4 }, function(err, results) {
        record = results;
        done(err);
      });
    });

    after(function(done) {
      resource.destroy(record.id, function(err) {
        done(err);
      });
    });

    it('should cache results', function(done) {
      resource.connection.cache.get(resource.namespace,
        record.id, function(err, result) {
          should.not.exist(err);
          result.should.eql(record);
          done();
      });
    });
  });


  describe('#update() #save()', function() {
    var record;

    before(function(done) {
      resource.create({ name: 'John', age: 4 }, function(err, result) {
        resource.update(result.id, { name: 'Tim' }, function(err, result) {
          record = result;
          done(err);
        });
      });
    });

    after(function(done) {
      resource.destroy(record.id, function(err) {
        done(err);
      });
    });

    it('should cache results', function(done) {
      resource.connection.cache.get(resource.namespace,
        record.id, function(err, result) {
          should.not.exist(err);
          result.should.eql(record);
          done();
      });
    });
  });

  describe('#destroy()', function() {
    var record;

    before(function(done) {
      var obj = { name: 'John', age: 4 };
      resource.create(obj, function(err, results) {
        record = results;

        resource.destroy(record.id, function(err) {
          done(err);
        });
      });
    });

    it('should destroy the cache copy', function(done) {
      resource.get(record.id, function(err, result) {
        should.not.exist(err);
        should.not.exist(result);

        resource.connection.cache.get(resource.namespace,
          record.id, function(err, cached) {
            should.not.exist(err);
            should.not.exist(cached);
            done();
        });
      });
    });
  });

});