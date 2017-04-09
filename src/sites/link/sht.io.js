_.register({
  rule: {
    host: /^sht\.io$/,
    path: /^\/\d+\/(.+)$/,
  },
  async start (m) {
    const url = atob(m.path[1]);
    // the salt is like: XXX{sht-io}url{sht-io}{sht-io}standard
    url = url.match(/\{sht-io\}(.+)\{sht-io\}.*\{sht-io\}/);
    await $.openLink(url[1]);
  },
});
