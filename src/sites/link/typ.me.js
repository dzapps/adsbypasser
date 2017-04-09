_.register({
  rule: {
    host: /^(www\.)?typ\.me$/,
  },
  async ready (m) {
    const a = $('#skipAdBtn');
    await $.openLink(a.href);
  },
});
