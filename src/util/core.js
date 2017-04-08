export {
  AdsBypasserError,
  every,
  find,
  forEach,
  map,
  none,
  partial,
  template,
  isString,
  nop,
  wait,
  tryEvery,
};

import {
  usw,
} from 'util/platform';


class AdsBypasserError extends Error {

  constructor (message) {
    super(message)
  }

}


function forEach (collection, fn) {
  if (isArrayLike(collection)) {
    return Array.prototype.forEach.call(collection, fn);
  }
  return Object.keys(collection).forEach((k) => {
    return fn(collection[k], k, collection);
  });
}


function every (collection, fn) {
  if (isArrayLike(collection)) {
    return Array.prototype.every.call(collection, fn);
  }
  return Object.keys(collection).every((k) => {
    return fn(collection[k], k, collection);
  });
}


function map (collection, fn) {
  if (isArrayLike(collection)) {
    return Array.prototype.map.call(collection, fn);
  }
  let mapped = Object.assign({}, collection);
  Object.getOwnPropertyNames(mapped).forEach((k) => {
    mapped[k] = fn(collection[k], k, collection);
  });
  return mapped;
}


function find (collection, fn) {
  for (let [k, v] of enumerate(collection)) {
    let r = fn(v, k, collection);
    if (r !== none) {
      return [k, v, r];
    }
  }
  return [none, none, none];
}


function * enumerate (collection) {
  if (isArrayLike(collection)) {
    yield * Array.prototype.entries.call(collection);
    return;
  }
  const keys = Object.getOwnPropertyNames(collection);
  for (let k of keys) {
    yield [k, collection[k]];
  }
}


function isArrayLike (collection) {
  return Array.isArray(collection) || isNodeList(collection);
}


function isNodeList (collection) {
  if (usw.NodeList) {
    return collection instanceof usw.NodeList;
  }
  if (window.NodeList) {
    return collection instanceof window.NodeList;
  }
  return false;
}


function template (s) {
  if (typeof s === 'string') {
  } else if (s instanceof String) {
    s = s.toString();
  } else {
    throw new AdsBypasserError('template must be a string');
  }
  var T = {
    '{{': '{',
    '}}': '}',
  };
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var kwargs = args[args.length-1];

    return s.replace(/\{\{|\}\}|\{([^\}]+)\}/g, function (m, key) {
      if (T.hasOwnProperty(m)) {
        return T[m];
      }
      if (args.hasOwnProperty(key)) {
        return args[key];
      }
      if (kwargs.hasOwnProperty(key)) {
        return kwargs[key];
      }
      return m;
    });
  };
}


function partial (fn) {
  if (typeof fn !== 'function') {
    throw new AdsBypasserError('must give a function');
  }
  var slice = Array.prototype.slice;
  var args = slice.call(arguments, 1);
  return function () {
    return fn.apply(this, args.concat(slice.call(arguments)));
  };
}


function parseJSON (json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    _.warn(e, json);
  }
  return _.none;
}


function isString (value) {
  return (typeof value === 'string') || (value instanceof String);
}


function nop () {
}


const none = nop;


function wait (msDelay) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, msDelay);
  });
}


function tryEvery (msInterval, fn) {
  return new Promise(function (resolve, reject) {
    var handle = setInterval(function () {
      var result = fn();
      if (result !== _.none) {
        clearInterval(handle);
        resolve(result);
      }
    }, msInterval);
  });
}
