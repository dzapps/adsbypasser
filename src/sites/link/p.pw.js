_.register({
  rule: {
    host: /^p\.pw$/,
  },
  async ready () {
    $.remove('iframe');
    const m = $.searchFromScripts(/window\.location = "(.*)";/);
    m = m[1];
    await $.openLink(m);
  },
});
