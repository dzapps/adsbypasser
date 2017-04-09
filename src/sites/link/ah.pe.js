(function () {

  _.register({
    rule: {
      host: /^ah\.pe$/,
    },
    async ready () {
      $.remove('iframe');

      const script = $.searchFromScripts('eval');
      script = decodeScript(script);
      script = decodeScript(script);
      script = decodeScript(script);

      const path = script.match(/'(g\/[^']+)'/);
      path = path[1];

      await _.wait(3000);
      const url = await $.get(path);
      await $.openLink(url);
    },
  });

  function decodeScript (encoded) {
    const a = encoded.match(/^\s*;eval\((.+)\);\s*$/);
    a = a[1];
    const b = a.match(/^(.+)\('([^']+)','([^']+)','([^']+)','([^']+)'\)$/);
    const c = eval('(' + b[1] + ')');
    return c(b[2], b[3], b[4], b[5]);
  }

})();
