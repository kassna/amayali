Template.Admin.events({
	'click .toggle-status': () => {
		Meteor.call('toggleAdmin', this._id);
	},
});
