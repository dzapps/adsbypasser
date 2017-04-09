_.register({
  rule: {
    host: /^www\.forbes\.com$/,
  },
  async ready () {
    const o = $.window.ox_zones;
    if (o) {
      await $.openLink(o.page_url);
    }
  },
});
