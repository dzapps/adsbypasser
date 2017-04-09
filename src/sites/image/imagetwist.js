(function () {

  _.register({
    rule: {
      host: /^imagenpic\.com$/,
      path: /^\/.*\/.+\.html$/,
    },
    ready: _.P(run, true),
  });

  _.register({
    rule: {
      host: /^imagecherry\.com$/,
    },
    ready: _.P(run, true),
  });

  _.register({
    rule: {
      host: /^imagetwist\.com$/,
    },
    ready: _.P(run, false),
  });

  async function run (rp) {
    // dirty hack, prevent scripts appending elements
    $.window.jQuery.prototype.append = undefined;
    const i = $('img.pic');
    await $.openImage(i.src, {
      replace: rp,
    });
  }

})();
