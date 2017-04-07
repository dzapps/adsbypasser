import { usw } from 'platform';


function getPromiseConstructor () {
  if (usw.Future) {
    // HACK: for Gecko 24, so far only Pale Moon
    // need dom.future.enabled = true
    return function (fn) {
      return usw.Future.call(this, function (fr) {
        fn(fr.resolve.bind(fr), fr.reject.bind(fr));
      });
    };
  }

  if (PromiseResolver) {
    // HACK: for Gecko 25, so far only Pale Moon
    // need dom.promise.enabled = true
    P = function (fn) {
      return new Promise(function (pr) {
        fn(pr.resolve.bind(pr), pr.reject.bind(pr));
      });
    };
  }

  return Promise;
}

export let Promise_ = getPromiseConstructor();
