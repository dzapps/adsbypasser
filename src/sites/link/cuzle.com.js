_.register({
  rule: {
    host: [
      /^www\.cuzle\.com$/,
      /^shorten\.id$/,
    ],
    path: /^\/$/,
    query: /^\?(.+)=$/,
  },
  async start (m) {
    const url = atob(m.query[1]);
    await $.openLink(url);
  },
});
