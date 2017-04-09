_.register({
  rule: {
    host: [
      /^al\.ly$/,
      /^ally\.sh$/,
    ],
  },
  async ready () {
    $.remove('iframe, #CashSlideDiv, #ct_catfish');

    const a = $('#modal-shadow');
    a.style.display = 'block';
    a = $('#modal-alert');
    a.style.left = 0;
    a.style.top = 80;
    a.style.display = 'block';
  },
});
