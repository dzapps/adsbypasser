_.register({
  rule: 'http://adfoc.us/*',
  async ready () {
    const promise = new Promise((resolve, reject) => {
      const root = document.body;
      const observer = new MutationObserver((mutations) => {
        const o = $.$('#showSkip');
        if (o) {
          observer.disconnect();
          o = o.querySelector('a');
          resolve(o.href);
        }
      });
      observer.observe(root, {
        childList: true,
        subtree: true,
      });
    });
    const url = await promise;
    await $.openLink(url);
  },
});
