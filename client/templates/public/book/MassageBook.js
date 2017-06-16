Template.MassageBook.helpers({
  types: () => _.map(['relax', 'decontracting', 'sport'], _id => {
    return {
      _id,
      name: () => TAPi18n.__(`schemas.orders.typeSelect.options.${_id}`, null)
    }
  }),
  therapistsType: () => _.map(['any', 'female', 'male'], _id => {
    return {
      _id,
      name: () => TAPi18n.__(`schemas.orders.therapistsTypeSelect.options.${_id}`, null)
    }
  }),
  products: () => _.map(['60', '90', '120'], _id => {
    return {
      _id,
      name: () => TAPi18n.__(`schemas.orders.productSelect.options.${_id}`, null)
    }
  })
});

Template.MassageBook.events({
  'click #next2': event => {
    event.preventDefault();
    if(!verifyFields($('#book-form-2'))) {
      Session.set('maxIntance', 2);
      return false;
    }

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
