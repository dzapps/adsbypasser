_.register({
  rule: {
    host: /^stash-coins\.com$/,
  },
  async start () {
    const url = window.location.toString();
    const i = url.lastIndexOf('http');
    url = url.substr(i);
    await $.openLink(url);
  },
});
