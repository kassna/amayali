Template.OrderConfirmation.onCreated(function () {
  const self = this;
	self.autorun(function() {
    const id = FlowRouter.getParam('id');
		self.subscribe('order', id);
	});
});
