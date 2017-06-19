Template.PromoCodeClient.onCreated(function() {
	let self = this;
	self.autorun(function() {
		self.subscribe('clientPromoCode');
	});
});

Template.PromoCodeClient.helpers({
	'currentDiscount': () => Clients.findOne().pendingPromos * 10,
})
