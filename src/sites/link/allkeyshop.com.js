_.register({
  rule: {
    host: [
      /^(www\.)?allkeyshop\.com$/,
      /^cshort\.org$/,
    ],
  },
  async ready (m) {
    const matches = $.searchFromScripts(/window\.location\.href = "([^"]+)"/);
    matches = matches[1];
    $.nuke(matches);
    await $.openLink(matches);
  },
});
