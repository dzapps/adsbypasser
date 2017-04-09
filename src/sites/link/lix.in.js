_.register({
  rule: 'http://lix.in/-*',
  async ready () {
    const i = $.$('#ibdc');
    if (i) {
      // captcha, do nothing
      return;
    }
    i = $.$('form');
    if (i) {
      i.submit();
      return;
    }
    i = $('iframe');
    await $.openLink(i.src);
  },
});
