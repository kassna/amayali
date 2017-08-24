let selectpicker = require('bootstrap-select');

Template.HeroTherapist.onCreated(function () {
  const self = this;
	self.autorun(function() {
		self.subscribe('activeLocations');
	});
});




Template.Hero.events({
  'click .submit-landing': () => {
    FlowRouter.go('book');
  }
});
