// XXX should remove this site

// image
_.register({
  rule: {
    host: /^ichan\.org$/,
    path: /^\/image\.php$/,
    query: /path=(.+)$/,
  },
  async start (m) {
    await $.openImage('/' + m.query[1]);
  },
});

// board
_.register({
  rule: {
    host: /ichan\.org$/,
  },
  async ready () {
    _.forEach($.$$('a'), (a) => {
      if (a.href.indexOf('/url/http://') > -1) {
        a.href = a.href.replace(/http:\/\/.+\/url\/(?=http:\/\/)/, '');
      }
    });
  },
});
