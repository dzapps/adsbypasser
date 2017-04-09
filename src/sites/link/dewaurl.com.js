_.register({
  rule: {
    host: /^www\.dewaurl\.com$/,
  },
  async ready () {
    const f = $('.framedRedirectTopFrame');
    let html = await $.get(f.src);
    html = $.toDOM(html);
    const a = $('#continueButton > a', html);
    await $.openLink(a.href);
  },
});
