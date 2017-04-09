(function () {

  _.register({
    rule: {
      host: /^adf\.ly$/,
      path: /^\/redirecting\/(.+)$/,
    },
    async start (m) {
      const url = atob(m.path[1]);
      await $.openLink(url);
    },
  });

  _.register({
    rule: {
      path: /\/locked$/,
      query: /url=([^&]+)/,
    },
    async start (m) {
      $.resetCookies();
      const url = decodeURIComponent(m.query[1]);
      if (url.match(/^http/)) {
        // absolute path
        await $.openLink(url);
      } else {
        // related path
        await $.openLink('/' + url);
      }
    },
  });

  _.register({
    rule: [
      // rocket loader hack
      'http://u.shareme.in/*',
      'http://server.sbenny.com/*',

      // generic pattern
      function () {
        const h = $.$('html[id="main_html"]');
        const b = $.$('body[id="home"]');
        if (h && b) {
          return true;
        } else {
          return null;
        }
      },
    ],
    async start () {
      // Rocket Loader will modify DOM before `ready()` can do anything,
      // so we hack `document.write` to block CloudFlare's main script.
      // after this the inline script will fail, and leave DOM alone.
      $.window.document.write = _.nop;
      // break anti-adblock script
      $.window.btoa = _.nop;
    },
    async ready () {
      // check if this is ad page
      let h = $.$('#main_html'), b = $.$('#home');
      if (!h || !b || h.nodeName !== 'HTML' || b.nodeName !== 'BODY') {
        // this is not a ad page
        return;
      }

      $.remove('iframe');

      // disable cookie check
      $.window.cookieCheck = _.nop;

      h = getTokenFromRocketScript();
      if (!h) {
        h = $('#adfly_bar');
        $.window.close_bar();
        return;
      }
      let a = h.indexOf('!HiTommy');
      if (a >= 0) {
        h = h.substring(0, a);
      }
      a = '';
      b = '';
      for (let i = 0; i < h.length; ++i) {
        if (i % 2 === 0) {
          a = a + h.charAt(i);
        } else {
          b = h.charAt(i) + b;
        }
      }
      h = atob(a + b);
      h = h.substr(2);
      if (location.hash) {
        h += location.hash;
      }
      await $.openLink(h);
    },
  });

  function getTokenFromRocketScript () {
    const a = $.searchFromScripts(/const eu = '(?!false)(.*)'/);
    return a ? a[1] : null;
  }

})();
