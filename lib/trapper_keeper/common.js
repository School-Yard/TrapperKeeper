var inflect = require("i")();

var common = exports;

common.clone = function (object, filter) {
  return Object.keys(object).reduce(filter ? function (obj, k) {
    if (filter(k)) obj[k] = object[k];
    return obj;
  } : function (obj, k) {
    obj[k] = object[k];
    return obj;
  }, {});
};

common.capitalize = inflect.camelize;

common.lowerize = inflect.underscore;

common.extend = function(obj) {
  Array.prototype.slice.call(arguments, 1).forEach(function(source) {
    for (var prop in source) {
      obj[prop] = source[prop];
    }
  });
  return obj;
};