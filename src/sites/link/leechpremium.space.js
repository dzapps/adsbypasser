_.register({
  rule: {
    host: /^leechpremium\.space$/,
    path: /^\/\w+$/,
  },
  async ready () {
    const a = $('#btn-main');
    const i = a.href.lastIndexOf('http');
    a = a.href.substr(i);
    await $.openLink(a);
  },
});
