Template.ClientInfo.helpers({
  currentClient: () => Clients.findOne(Session.get('viewId'))
  let self = this;
	self.autorun(function() {
		self.subscribe('clientPromoCode');
	});
});
