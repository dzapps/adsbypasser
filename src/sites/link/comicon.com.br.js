_.register({
  rule: {
    host: /^www\.comicon\.com\.br$/,
    path: /^\/redir\.php$/,
  },
  async ready () {
    const a = $('#link');
    await $.openLink(a.href);
  },
});
