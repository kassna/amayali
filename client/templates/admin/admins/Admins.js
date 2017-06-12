Template.Admins.onCreated(function() {
	let self = this;
	self.autorun(function() {
		self.subscribe('adminCode');
	});
});

Template.Admins.onRendered(function() {
	let template = this;
	template.subscribe('admins', function () {
		Tracker.afterFlush(function () {
			$("[data-sort=table]").tablesorter({
				sortList: [[0,0]],
				headers: {
          1: { sorter: false },
					2: { sorter: false },
					3: { sorter: false },
	      }
			});
		});
	});
});

Template.Admins.helpers({
	adminLink: () => FlowRouter.url('requestAccess'),
	adminCode: () => Admins.findOne().code,
});

Template.Admins.events({
	'click .refresh-code': event => {
		event.preventDefault();
		Meteor.call('refreshAdminCode');
	}
});
