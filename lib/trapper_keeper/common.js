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

// Taken from:
// http://dense13.com/blog/2009/05/03/converting-string-to-slug-javascript/
common.slugify = function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to   = "aaaaeeeeiiiioooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
};