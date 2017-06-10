Template.SidebarAdmin.onCreated(function() {
	let self = this;
	self.autorun(function() {
		self.subscribe('locations');
	});
});

Template.SidebarAdmin.helpers({
	isCurrentCity: function (city) {
		return Session.get('currentCity') === city;
	}
});

Template.SidebarAdmin.events({
	'change #city-selection ': function (event) {
		Session.setPersistent("currentCity", $(event.target).val());
	},
});
