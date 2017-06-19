Template.SidebarClient.onCreated(function() {
	let self = this;
	self.autorun(function() {
		self.subscribe('activeLocations');
	});
});

Template.SidebarClient.events({
	'click .edit-data': function (event, template) {
		Session.set('editId', Meteor.userId());
		Session.set('editMode', 1);
		Meteor.setTimeout(function() {
			$("#edit-modal").modal('show');
		}, 500);
	},
});
