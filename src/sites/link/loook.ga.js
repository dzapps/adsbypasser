_.register({
  rule: {
    host: /^(www\.)?loook\.ga$/,
    path: /^\/\d+$/
  },
  async ready (m) {
    const a = $('#download_link > a.btn');
    await $.openLink(a.href);
  },
});
