Template.PromoCodeClient.onCreated(function() {
	let self = this;
	self.autorun(function() {
		self.subscribe('clientPromoCode');
	});
});
