Template.Admin.events({
	'click .toggle-status': function () {
		Meteor.call('toggleAdmin', this._id);
	},
});
