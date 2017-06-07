Template.Location.events({
	'click .edit-button': function (event, template) {
		Session.set('editId', this._id);
		Session.set('editMode', 1);
		Meteor.setTimeout(function() {
			$("#edit-modal").modal('show');
		}, 500);
	},
	'click .toggle-status': function () {
		Meteor.call('toggleStatusLocation', this._id);
	},
});
