(function () {

  const ajaxPattern = /\$.post\('([^']*)'[^{]+(\{\s*opt:\s*'make_log'[^}]+\}\s*\}),/i;

  // bc.vc, shortcut
  _.register({
    rule: {
      host: [
        /^bc\.vc$/,
        /^linc\.ml$/,
      ],
      path: /^.+(https?:\/\/.+)$/,
    },
    async start (m) {
      await $.openLink(m.path[1] + document.location.search + document.location.hash);
    },
  });

  // bc.vc
  _.register({
    rule: {
      host: /^bc\.vc$/,
      path: /^\/.+/,
    },
    async ready () {
      $.remove('iframe');

      const result = searchScript(false);
      if (!result.direct) {
        knockServer2(result.script);
      } else {
        result = result.script.match(/top\.location\.href = '([^']+)'/);
        if (!result) {
          throw new _.AdsBypasserError('script changed');
        }
        result = result[1];
        await $.openLink(result);
      }
    },
  });

  // adcrun.ch
  _.register({
    rule: {
      host: /^adcrun\.ch$/,
      path: /^\/\w+$/,
    },
    async ready () {
      // Try to bypass the survey
      $.remove('.user_content');

      const rSurveyLink = /http\.open\("GET", "api_ajax\.php\?sid=\d*&ip=[^&]*&longurl=([^"]+)" \+ first_time, (?:true|false)\);/;
      const l = $.searchFromScripts(rSurveyLink);
      // Redirect to the target link if we found it
      if (l) {
        await $.openLink(l[1]);
        return;
      }

      // Otherwise it's most likely a simple bc.vc-like link
      // Malformed JSON
      await run(true);
    },
  });

  _.register({
    rule: {
      host: [
        /^1tk\.us$/,
        /^gx\.si$/,
        /^adwat\.ch$/,
        /^(fly2url|urlwiz|xafox)\.com$/,
        /^(zpoz|ultry)\.net$/,
        /^(wwy|myam)\.me$/,
        /^ssl\.gs$/,
        /^hit\.us$/,
        /^shortit\.in$/,
        /^(adbla|tl7)\.us$/,
        /^www\.adjet\.eu$/,
        /^srk\.gs$/,
        /^cun\.bz$/,
        /^miniurl\.tk$/,
        /^vizzy\.es$/,
        /^kazan\.vc$/,
        /^linkcash\.ml$/,
      ],
      path: /^\/.+/,
    },
    ready: run,
  });

  _.register({
    rule: {
      host: /^adtr\.im|ysear\.ch|xip\.ir$/,
      path: /^\/.+/,
    },
    async ready () {
      const a = $.$('div.fly_head a.close');
      const f = $.$('iframe.fly_frame');
      // the iframe may be an ad link
      // so also check the close button
      if (a && f) {
        await $.openLink(f.src);
      } else {
        await run();
      }
    },
  });

  _.register({
    rule: {
      host: /^ad5\.eu$/,
      path: /^\/[^.]+$/,
    },
    async ready () {
      $.remove('iframe');
      const s = searchScript(true);

      // Find the form
      const m = s.script.match(/(<form name="form1"method="post".*(?!<\\form>)<\/form>)/);

      if (!m) {
        return;
      }

      m = m[1];

      // Set the correct timezone
      const tz = -(new Date().getTimezoneOffset() / 60);
      m = m.replace("'+timezone+'", tz);

      // Wrap the form into a useless div
      const d = document.createElement('div');
      d.setAttribute('id', 'AdsBypasserFTW');
      d.setAttribute('style', 'display:none;');

      // Feed with the right form
      d.innerHTML = m;
      document.body.appendChild(d);

      // Redirect to next page
      $('#AdsBypasserFTW > form[name=form1]').submit();
    },
  });

  _.register({
    rule: {
      host: /^tr5\.in$/,
      path: /^\/.+/,
    },
    async ready () {
      // Malformed JSON
      await run(true);
    },
  });

  function decompress (script, unzip) {
    if (!unzip) {
      return script;
    }
    const matches = script.match(/eval(.*)/);
    if (!matches) {
      throw new _.AdsBypasserError('no script matches /eval(.*)/');
    }
    matches = matches[1];
    script = eval(matches);
    return script;
  }

  function searchScript (unzip) {
    const content = $.searchFromScripts('make_log');
    if (content) {
      return {
        direct: false,
        script: decompress(content, unzip),
      };
    }
    content = $.searchFromScripts('click_log');
    if (content) {
      return {
        direct: true,
        script: decompress(content, unzip),
      };
    }
    throw _.AdsBypasserError('script changed');
  }

  function knockServer (script, dirtyFix) {
    const matches = script.match(ajaxPattern);
    if (!matches) {
      throw new _.AdsBypasserError('(in knock server) no script matches $.post');
    }
    const make_url = matches[1];
    const make_opts = eval('(' + matches[2] + ')');

    // XXX refactor?
    const i = setInterval(function () {
      $.post(make_url, make_opts).then(function (text) {
        if (dirtyFix) {
          // dirty fix for tr5.in
          text = text.match(/\{.+\}/)[0];
        }
        const jj = _.parseJSON(text);
        if (jj.message) {
          clearInterval(i);
          return $.openLink(jj.message.url);
        }
      });
    }, 1000);
  }

  function knockServer2 (script) {
    // somehow I must use jQuery AJAX
    const post = $.window.$.post;
    // mock a fake AJAX function
    $.window.$.post = function (a, b, c) {
      if (typeof c !== 'function') {
        return;
      }
      setTimeout(function () {
        const data = {
          error: false,
          message: {
            url: '#',
          },
        };
        c(JSON.stringify(data));
      }, 1000);
    };

    const matches = script.match(ajaxPattern);
    if (!matches) {
      throw new _.AdsBypasserError('(in knock server 2) no script matches $.post');
    }
    const make_url = matches[1];
    // dummy constialbes for eval script
    let tZ, cW, cH, sW, sH;
    const make_opts = eval('(' + matches[2] + ')');

    function makeLog () {
      make_opts.opt = 'make_log';
      // XXX not awaited
      post(make_url, make_opts, (text) => {
        const data = _.parseJSON(text);
        _.info('make_log', data);
        if (!data.message) {
          checksLog();
          return;
        }

        $.openLink(data.message.url);
      });
    }

    function checkLog () {
      make_opts.opt = 'check_log';
      post(make_url, make_opts, (text) => {
        const data = _.parseJSON(text);
        _.info('check_log', data);
        if (!data.message) {
          checkLog();
          return;
        }

        makeLog();
      });
    }

    function checksLog () {
      make_opts.opt = 'checks_log';
      post(make_url, make_opts, () => {
        _.info('checks_log');
        checkLog();
      });
    }

    checksLog();
  }

  async function run (dirtyFix) {
    // prevent redirection by iframe
    $.remove('iframe');

    const result = searchScript(true);
    if (!result.direct) {
      knockServer(result.script,dirtyFix);
    } else {
      result = result.script.match(/top\.location\.href='([^']+)'/);
      if (!result) {
        throw new _.AdsBypasserError('script changed');
      }
      result = result[1];
      await $.openLink(result);
    }
  }

})();
