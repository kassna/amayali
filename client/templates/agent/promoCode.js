Template.PromoCodeAgent.onCreated(function() {
	let self = this;
	self.autorun(function() {
		self.subscribe('agentPromoCode');
	});
});
