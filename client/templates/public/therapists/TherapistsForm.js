Template.TherapistsForm.onCreated(function () {
  let self = this;
	self.autorun(function() {
		self.subscribe('locations');
	});
});

Template.TherapistsForm.helpers({
  sendText: () => TAPi18n.__('general.send', null)
});
