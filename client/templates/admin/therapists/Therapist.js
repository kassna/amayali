Template.Therapist.helpers({
	prettyType: type => TAPi18n.__(`admin.promoCodes.typeOptions.${type}`, null)
});

Template.Therapist.events({
	'click .edit-button': function () {
		Session.set('editId', this._id);
		Session.set('editMode', 1);
		Meteor.setTimeout(function() {
			$("#edit-modal").modal('show');
		}, 500);
	},
	'click .toggle-status': function () {
		Meteor.call('toggleStatusTherapist', this._id);
	},
	'click .view-more-btn': function() {
		Session.set('viewId', this._id);
		Session.set('viewMode', 1);
		Meteor.setTimeout(function() {
			$("#therapist-info").modal('show');
		}, 500);
	}
});
