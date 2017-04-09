_.register({
  rule: {
    host: /^www\.img(babes|flare)\.com$/,
  },
  async ready () {
    const i = $.$('input[onclick]');
    if (i) {
      $.window.Decode();
      return;
    }

    const i = $('#this_image');
    await $.openImage(i.src);
  },
});
