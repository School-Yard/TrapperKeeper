Trapper Keeper
==============

A super lightweight and storage agnostic data abstraction layer.

[![Build Status](https://secure.travis-ci.org/School-Yard/TrapperKeeper.png?branch=master)](http://travis-ci.org/School-Yard/TrapperKeeper)

When you don't want to use Resourceful throw it in Trapper Keeper. A lot of the underlying code and engine structure
is based on Resouceful but all the hooks, events and relationships are stripped out.

## Example

``` js
var trapper_keeper = require('trapperkeeper');

// Create a connection to a data store
var db = trapper_keeper.connect('mongodb', 'mongodb://127.0.0.1', 27017, { database: 'awesome' });

// Create a namespaced resource
// Namespace will correspond with data store key, collection, table, etc.
var resource = db.resource('namespace');

db.connection.on('ready', function() {
  resource.get(id, callback);
  resource.create(attrs, callback);
});
```

### Engines

Trapper Keeper currently has engines for:

  - Memory
  - MongoDB

## Function Signatures

``` js
resource.get(id, callback);

resource.create(attrs, callback);

resource.save(id, attrs, callback);

resource.destroy(id, callback);

resource.update(id, attrs, callback);

resouce.find(conditions, callback);

resouce.all(callback);

/**
 * Only method that isn't a CRUD method on resource
 * Initializes an engine to use as a cache on the resource
 */
resource.cache(engine, options);
```

## Installation

### Installing trapper-keeper
``` bash
  $ [sudo] npm install trapperkeeper
```

## Tests
All tests are written with [mocha][0] and should be run with [npm][1]:

``` bash
  $ npm test
```

[0]: http://visionmedia.github.com/mocha/
[1]: http://npmjs.org