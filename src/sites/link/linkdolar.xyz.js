_.register({
  rule: {
    host: /^linkdolar\.xyz$/,
  },
  async ready () {
    $.remove('iframe');

    const s = $.searchFromScripts(/^\s*eval\((.+)\)\s*$/);
    if (!s) {
      _.warn('site changed');
      return;
    }
    s = eval('(' + s[1] + ')');
    s = s.match(/\$\.post\('([^']+)',(\{.+\}),function/);
    if (!s) {
      _.warn('site changed');
    }

    const url = s[1];
    const args = eval('(' + s[2] + ')');

    const target = await $.post(url, args);
    await $.openLink(target);
  },
});
