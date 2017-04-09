_.register({
  rule: {
    host: /^www.mirrorupload.net$/,
  },
  async ready () {
    // Find the form leading to the mirrors page
    const accessForm = $('form[name=form_upload]');

    // We need to append this field or this doesn't redirect correctly
    const accessInput = document.createElement('input');
    accessInput.type = 'hidden';
    accessInput.name = 'access';
    accessInput.value = Math.random();
    accessForm.appendChild(accessInput);

    accessForm.submit();
  },
});
