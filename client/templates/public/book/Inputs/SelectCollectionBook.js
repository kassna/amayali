Template.SelectCollectionBook.onRendered(() => {
  let style = 'input__field input__field--madoka';
  if (!Session.get(Template.instance().data.attribute)) {
    style += ' not-selected';
  }
  $('.selectpicker').selectpicker({
	  style,
	  size: 4
	});
});

Template.SelectCollectionBook.helpers({
  isSelected: id => Session.get(Template.instance().data.attribute) === id
});
