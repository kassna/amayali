Template.OrderInfo.helpers({
  currentOrder: () => Orders.findOne(Session.get('viewId'))
});
