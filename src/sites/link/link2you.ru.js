_.register({
  rule: {
    host: /^link2you\.ru$/,
    path: /^\/\d+\/(.+)$/,
  },
  async start (m) {
    const url = m.path[1];
    if (!url.match(/^https?:\/\//)) {
      url = '//' + url;
    }
    await $.openLink(url);
  },
});
