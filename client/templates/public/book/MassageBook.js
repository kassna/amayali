Template.MassageBook.onRendered(() => {
  $('.selectpicker').selectpicker({
	  style: 'input__field input__field--madoka not-selected',
	  size: 4
	});
});

Template.MassageBook.helpers({
  types: () => _.map(['relax', 'decontracting', 'sport'], value => {
    return {
      value,
      label: () => TAPi18n.__(`schemas.orders.typeSelect.options.${value}`, null)
    }
  }),
  therapistsType: () => _.map(['any', 'female', 'male'], value => {
    return {
      value,
      label: () => TAPi18n.__(`schemas.orders.therapistsTypeSelect.options.${value}`, null)
    }
  })
});
