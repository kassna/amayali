Template.SelectBook.onRendered(() => {
  let style = 'input__field input__field--madoka';
  let attr = Template.instance().data.attribute;
  if (!Session.get(attr)) {
    style += ' not-selected';
  }
  $('.selectpicker').selectpicker({
	  style,
	  size: 4
	});

  $('body').on('change', '.selectpicker', event => {
    const $select = $(event.target);
    if(!$select.val()) {
      $select.parents('.bootstrap-select').find('button').addClass('not-selected');
    } else {
      $select.parents('.bootstrap-select').find('button').removeClass('not-selected');
    }
    Session.set(attr, $select.val());
  });
});

Template.SelectBook.helpers({
  isSelected: id => Session.get(Template.instance().data.attribute) === id
});
