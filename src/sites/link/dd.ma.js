_.register({
  rule: {
    host: /^(www\.)?dd\.ma$/,
  },
  async ready (m) {
    const i = $.$('#mainframe');
    if (i) {
      await $.openLink(i.src);
      return;
    }

    const a = $('#btn_open a');
    await $.openLink(a.href);
  },
});
