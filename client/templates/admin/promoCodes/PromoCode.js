Template.PromoCode.helpers({
	prettyType: type => TAPi18n.__(`admin.promoCodes.typeOptions.${type}`, null)
});

Template.PromoCode.events({
	'click .edit-button': function (event, template) {
		Session.set('editId', this._id);
		Session.set('editMode', 1);
		Meteor.setTimeout(function() {
			$("#edit-modal").modal('show');
		}, 500);
	},
	'click .toggle-status': function () {
		Meteor.call('toggleStatusPromoCode', this._id);
	},
});
