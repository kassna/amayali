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
    nextInstance(['type', 'therapistsType', 'product'], 2);
  },
  'click #back2': () => {
    prevInstance(2);
  },
  'click #product button': event => {
    const product = $(event.target).attr('data-id');
    let price;
    switch (product) {
      case '60':
        price = 799;
        break;
      case '90':
        price = 1099;
        break;
      case '120':
        price = 1399;
        break;
      default:
    }
    Session.set('subTotal', price);
  }
});
