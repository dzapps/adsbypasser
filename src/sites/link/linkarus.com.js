_.register({
  rule: {
    host: /^www\.linkarus\.com$/,
    path: /^\/skip\//,
  },
  async ready () {
    $.remove('iframe');
    const m = $.searchFromScripts(/action="([^"]+)"/);
    m = m[1];
    await $.openLink(m);
  },
});

_.register({
  rule: {
    host: /^www\.linkarus\.com$/,
  },
  async ready () {
    $.remove('iframe');

    const m = $.searchFromScripts(/const counter = (\d+);/);
    m = parseInt(m[1], 10);
    m = m * 1000 + 500;

    await _.wait(m);
    const a = $('#skip-ad');
    await $.openLink(a.href);
  },
});
