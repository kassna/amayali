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
  Session.set('instance', 3);
	Session.set('maxIntance', 3);
});

Template.Book.onRendered(() => {
  $('body').on('focus', '.input__field', event => {
    $(event.target).parent().addClass('input--filled');
  });

  $('body').on('blur', '.input__field', event => {
    let $input = $(event.target);
    if($input.val().trim() === '') {
      $input.parent().removeClass('input--filled');
    }
  });

  $('body').on('change', '.selectpicker', event => {
    const $select = $(event.target);
    if(!$select.val()) {
      $select.parents('.bootstrap-select').find('button').addClass('not-selected');
    } else {
      $select.parents('.bootstrap-select').find('button').removeClass('not-selected');
    }
  });

  $('body').on('click', '.button-select button', event => {
    event.preventDefault();
    const $parent = $(event.target).parent();
    $parent.find('button').removeClass('active');
    $(event.target).addClass('active');
  });
});
