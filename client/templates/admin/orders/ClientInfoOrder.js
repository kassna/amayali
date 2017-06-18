Template.ClientInfoOrder.helpers({
  currentOrder: () => Orders.findOne(Session.get('viewId'))
});
