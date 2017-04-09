_.register({
  rule: {
    host: /^img24\.org$/,
  },
  async ready () {
    const f = $.$('img.img-polaroid + form');
    if (f) {
      f.submit();
      return;
    }

    f = $('img.img-polaroid');
    await $.openImage(f.src, {
      referer: true,
    });
  },
});
