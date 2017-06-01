Template.Header.onCreated(function() {
	let self = this;
	self.subscribe('locations');
});

Template.Header.helpers({
	isCurrentCity: function (city) {
		return Session.get('currentCity') === city;
	}
});

Template.Header.events({
	'change #city-selection ': function () {
		Session.setPersistent("currentCity", $("#city-selection").val());
	},
	'click .scroll-top': function () {
		$('html,body').animate({ scrollTop: 0}, 0, 'easeInOutQuart');
		$(".nav-toggler").trigger('click');
	},
	'click #logout': () => {
		AccountsTemplates.logout();
	}
});