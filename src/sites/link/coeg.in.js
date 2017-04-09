(function () {

  _.register({
    rule: {
      host: [
        /^link\.animagz\.org$/,
        /^coeg\.in$/,
        /^disingkat\.in$/,
        /^gunting\.in$/,
      ],
      path: /^\/\w+$/,
    },
    async ready (m) {
      const mapper = hostMapper(m.host[0]);
      const b64 = mapper().match(/\?r=(\w+={0,2}?)/);

      await $.openLink(atob(b64[1]));
    },
  });

  _.register({
    rule: {
      host: /^sipkur\.(net|us)$/,
      path: [
        /^\/\w+$/,
        /^\/menujulink\//,
      ],
    },
    async ready () {
      const d = $('#testapk > div');
      d = d.onclick.toString();
      d = d.match(/window\.open\('([^']+)'/);

      await $.openLink(d[1]);
    },
  });

  function hostMapper (host) {
    switch (host) {
    case 'disingkat.in':
      return () => {
        const a = $('a.btn-block.redirect');
        return a.href;
      };
    case 'link.animagz.org':
      return () => {
        const a = $('a.redirect');
        a = a.onclick.toString();
        a = a.match(/window\.open \('([^']+)'\)/);
        return a[1];
      };
    case 'coeg.in':
      return () => {
        const a = $('.download-link a');
        return a.href;
      };
    case 'gunting.in':
      return () => {
        const a = $('div.col-sm-6:nth-child(1) > center:nth-child(1) > a:nth-child(1)');
        return a.href;
      };
    default:
      return null;
    }
  }

})();
