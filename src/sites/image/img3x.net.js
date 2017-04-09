_.register({
  rule: {
    host: /^img3x\.net$/,
  },
  async ready () {
    const f = $.$('form');
    if (f) {
      f.submit();
      return;
    }

    f = $('#show_image');
    await $.openImage(f.src);
  },
});
