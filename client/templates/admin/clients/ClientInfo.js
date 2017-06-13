Template.ClientInfo.helpers({
  currentClient: () => Clients.findOne(Session.get('viewId'))
});
