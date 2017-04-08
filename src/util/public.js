export {
  _,
  $,
};


import {
  get,
  post,
} from 'util/ajax';
import {
  getCookie,
  setCookie,
  resetCookies,
} from 'util/cookie';
import {
  template,
  partial,
  find,
  forEach
} from 'util/core';
import {
  register,
} from 'util/dispatcher';
import {
  querySelector,
  querySelectorAll,
  querySelectorOrNull,
  remove,
  searchFromScripts,
} from 'util/dom';
import {
  openImage,
} from 'util/image';
import {
  openLink,
} from 'util/link';
import {
  info,
  warn,
} from 'util/logger';
import {
  nuke,
  removeAllTimer,
  generateRandomIP,
} from 'util/misc';
import {
  uswProxy,
} from 'util/platform';


const _ = {
  register,
  info,
  warn,
  generateRandomIP,
  template,
  partial,
  find,
  forEach,
};


function $ (selector, context) {
  return querySelector(selector, context);
}
$.$ = querySelectorOrNull;
$.$$ = querySelectorAll;
$.get = get;
$.post = post;
$.setCookie = setCookie;
$.getCookie = getCookie;
$.resetCookies = resetCookies;
$.remove = remove;
$.searchFromScripts = searchFromScripts;
$.openImage = openImage;
$.openLink = openLink;
$.removeAllTimer = removeAllTimer;
$.nuke = nuke;
$.window = uswProxy;
