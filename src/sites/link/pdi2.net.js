_.register({
  rule: {
    host: /^pdi2\.net$/,
  },
  async ready () {
    const s = $.searchFromScripts(/top\.location = '([^']+)'/);
    s = s[1];
    await $.openLink(s);
  },
});
