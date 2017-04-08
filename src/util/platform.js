export {
  usw,
  uswProxy,
  GM,
};

// FIXME circular dependency
import {
  forEach,
} from 'util/core';


const usw = getUnsafeWindow();
const uswProxy = getUnsafeWindowProxy();
const GM = {
  openInTab: GM_openInTab,
  registerMenuCommand: GM_registerMenuCommand,
  getValue: GM_getValue,
  setValue: GM_setValue,
  xmlhttpRequest: GM_xmlhttpRequest,
  getResourceText: GM_getResourceText,
  addStyle: GM_addStyle,
  getResourceURL: GM_getResourceURL,
};


function getUnsafeWindow () {
  let w = null;
  try {
    w = unsafeWindow;
  } catch (e) {
  }
  return w ? w : window;
}

// magic property to get the original object
const MAGIC_KEY = '__adsbypasser_reverse_proxy__';


function getUnsafeWindowProxy () {
  // GreaseMonkey 1.15 won't pass this test
  var isFirefox = typeof InstallTrigger !== 'undefined';
  if (!isFirefox) {
    // other browsers does not need this
    return unsafeWindow;
  }

  var decorator = {
    set: function (target, key, value) {
      if (key === MAGIC_KEY) {
        return false;
      }
      // GreaseMonkey 2.1 has a bug
      // unsafeWindow.open will become read-only after modifying
      // so we have to explicitly assign property descriptor
      if (target === unsafeWindow && key === 'open') {
        var d = Object.getOwnPropertyDescriptor(target, key);
        // wrap the returned object back so that content script can see
        // through the object
        d.value = clone(function () {
          var rv = value();
          return cloneInto(rv, unsafeWindow);
        });
        Object.defineProperty(target, key, d);
      } else {
        target[key] = clone(value);
      }
      return true;
    },
    get: function (target, key) {
      if (key === MAGIC_KEY) {
        return target;
      }
      var value = target[key];
      var type = typeof value;
      if (value === null || (type !== 'function' && type !== 'object')) {
        // primitive values does not need this
        return value;
      }
      return new Proxy(value, decorator);
    },
    apply: function (target, self, args) {
      args = Array.prototype.slice.call(args);

      // special hack for Object.defineProperty
      if (target === unsafeWindow.Object.defineProperty) {
        args[0] = args[0][MAGIC_KEY];
      }
      // special hack for Function.apply
      if (target === unsafeWindow.Function.apply) {
        self = self[MAGIC_KEY];
        args[1] = Array.prototype.slice.call(args[1]);
      }
      // special hack for querySelector
      if (target === unsafeWindow.document.querySelector) {
        self = self[MAGIC_KEY];
      }
      // special hack for write
      if (target === unsafeWindow.document.write) {
        self = self[MAGIC_KEY];
      }

      var usargs = clone(args);

      return target.apply(self, usargs);
    },
    construct: function (target, args) {
      args = Array.prototype.slice.call(args);
      // insert this argument
      args.unshift(undefined);
      var usargs = clone(args);
      var bind = unsafeWindow.Function.prototype.bind;
      return new (bind.apply(target, usargs));
    },
  };
  return new Proxy(unsafeWindow, decorator);
}


// Firefox only
// cloneInto is too buggy
// TODO Date, Regexp, subclasses
function clone (safe) {
  if (safe === null || !(safe instanceof Object)) {
    return safe;
  }
  if (safe instanceof String) {
    return safe.toString();
  }
  if (safe instanceof Function) {
    return exportFunction(safe, unsafeWindow, {
      allowCrossOriginArguments: true,
    });
  }
  if (safe instanceof Array) {
    var unsafe = new unsafeWindow.Array();
    for (var i = 0; i < safe.length; ++i) {
      unsafe.push(clone(safe[i]));
    }
    return unsafe;
  }
  var unsafe = new unsafeWindow.Object();
  forEach(safe, (v, k) => {
    unsafe[k] = clone(v);
  });
  return unsafe;
}
