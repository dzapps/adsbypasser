_.register({
  rule: {
    host: /^(www\.)?ouo\.(io|press)$/,
    path: /^\/go\/\w+$/,
  },
  async ready (m) {
    $('form').submit();
  },
});
