Trapper Keeper
==============

A super lightweight and storage agnostic data abstraction layer. 

When you don't want to use Resourceful throw it in Trapper Keeper.

## Example

``` js
var trapper_keeper = require('trapperkeeper');

// Create a connection to a data store
var db = trapper_keeper.connect('mongodb', 'mongodb://127.0.0.1', 27017, { database: 'awesome' });

// Create a namespaced resource
// Namespace will correspond with data store key, collection or table
var resource = db.resource('namespace');

db.connection.on('ready', function() {
  resource.get(id, callback);
  resource.create(attrs, callback);
});
```

## Function Signatures

``` js
resource.get(id, callback);

resource.create(attrs, callback);

resource.save(id, attrs, callback);

resource.destroy(id, callback);

resource.update(id, attrs, callback);

resouce.find(conditions, callback);

resouce.all(callback);
```