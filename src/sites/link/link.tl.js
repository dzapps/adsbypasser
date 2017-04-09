_.register({
  rule: {
    host: /^link\.tl$/,
    path: /^\/fly\/go\.php$/,
  },
  async ready () {
    const a = $('.skip_btn2 a');
    await $.openLink(a.href);
  },
});

_.register({
  rule: {
    host: /^link\.tl$/,
    path: /^\/(.+)$/,
  },
  async start (m) {
    await $.openLink('/fly/go.php?to=' + m.path[1]);
  },
});
