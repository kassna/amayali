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
  }),
  products: () => _.map(['60', '90', '120'], value => {
    return {
      value,
      label: () => TAPi18n.__(`schemas.orders.productSelect.options.${value}`, null)
    }
  })
});

Template.MassageBook.events({
  'click #next2': event => {
    event.preventDefault();
    if(!verifyFields($('#book-form-2'))) return false;

    // Get answers
    Session.set('type', $('#type').find('.active').attr('data-id'));
    Session.set('product', $('#product').find('.active').attr('data-id'));
    // Increase steps
    Session.set('instance', 3);
    // Increase max instance in case it was the first time advancing
    if(Session.get('maxIntance') === 2) Session.set('maxIntance', 3);
    scrollTop();
  },
  'click #back2': () => {
    Session.set('instance', 1);
    scrollTop();
  }
});
