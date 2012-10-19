var Resource = require('../lib/trapper_keeper/resource'),
    should = require('should');

describe("Resource()", function() {

  describe('Constructor', function() {

    it('should require a connection', function() {
      (function() {
        new Resource({});
      }).should.throw('A connection object must be specifiecd in the options parameter');
    });

    it('should require a namespace', function() {
      (function() {
        new Resource({ connection: {}, namespace: '' });
      }).should.throw('A namespace string must be specified in the options parameter');
    });

    it('should have all the CRUD methods', function() {
      var resource = new Resource({ connection: {}, namespace: 'test' });
      resource.get.should.be.a('function');
      resource.create.should.be.a('function');
      resource.save.should.be.a('function');
      resource.destroy.should.be.a('function');
      resource.update.should.be.a('function');
      resource.find.should.be.a('function');
      resource.all.should.be.a('function');
    });

  });
});