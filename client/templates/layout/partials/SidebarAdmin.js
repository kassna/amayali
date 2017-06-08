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
	'change #city-selection ': function () {
		Session.setPersistent("currentCity", $("#city-selection").val());
	},
});
