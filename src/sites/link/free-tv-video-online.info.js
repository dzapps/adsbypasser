_.register({
  rule: {
    host: /^www\.free-tv-video-online\.info$/,
    path: /^\/interstitial2\.html$/,
    query: /lnk=([^&]+)/,
  },
  async start (m) {
    const url = decodeURIComponent(m.query[1]);
    await $.openLink(url);
  },
});
