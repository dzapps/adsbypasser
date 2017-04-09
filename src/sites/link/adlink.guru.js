(function () {

  _.register({
    rule: {
      host: [
        /^adlink\.guru$/,
        /^cypt\.ga$/,
        /^filesbucks\.com$/,
        /^elink\.link$/,
        /^(payurl|urlst)\.me$/,
        /^url\.ht$/,
        /^urle\.co$/,
        /^cut-urls\.com$/,
        /^hashe\.in$/,
        /^www\.worldhack\.net$/,
        /^123link\.top$/,
        /^pir\.im$/,
        /^bol\.tl$/,
        /^tl\.tc$/,
        /^tmearn\.com$/,
      ],
    },
    async ready () {
      $.remove('iframe', '.BJPPopAdsOverlay');

      const page = await firstStage();
      const url = await secondStage(page);
      // nuke for bol.tl, somehow it will interfere click event
      $.nuke(url);
      await $.openLink(url);
    },
  });

  function firstStage () {
    return new Promise((resolve, reject) => {
      const f = $.$('#link-view');
      if (!f) {
        resolve(document);
        return;
      }

      const args = extractArgument(f);
      const url = f.getAttribute('action');
      const p = $.post(url, args).then((data) => {
        return $.toDOM(data);
      });
      resolve(p);
    });
  }

  async function secondStage (page) {
    const f = $('#go-link', page);
    const args = extractArgument(f);
    const url = f.getAttribute('action');
    let data = await $.post(url, args);
    data = _.parseJSON(data);
    if (data && data.url) {
      return data.url;
    }
    throw new _.AdsBypasserError('wrong data');
  }

  function extractArgument (form) {
    const args = {};
    forEach($.$$('input', form), (v) => {
      args[v.name] = v.value;
    });
    return args;
  }

})();
