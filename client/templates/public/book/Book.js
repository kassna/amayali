verifyFields = $form => {
  let allValid = true;
  $form.find('input, select').each(function() {
    if(!$(this).val()) {
      allValid = false;
      return false;
    }
  });

  if($form.find('.button-select').length) {
    $form.find('.button-select').each(function() {
      if(!$(this).find('.active').attr('data-id')) {
        allValid = false;
        return false;
      }
    });
  }

  if(!allValid) Bert.alert(TAPi18n.__('book.errors.requiredInputs', null), 'danger');
  return allValid;
}

Template.Book.onCreated(function () {
  let self = this;
	self.autorun(function() {
		self.subscribe('activeLocations');
	});
  Session.set('instance', 1);
	Session.set('maxIntance', 1);
});
