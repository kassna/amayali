Template.ClientInfo.helpers({
  currentClient: () => Clients.findOne(Session.get('viewId'))
});

Template.ClientInfo.onCreated(function () {
	let self = this;
	self.autorun(function() {
		self.subscribe('clientPromoCode');
	});
});