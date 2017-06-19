Template.PendingOrder.events({
	'click .edit-button': function (event, template) {
		Session.set('editId', this._id);
		Session.set('editMode', 1);
		Meteor.setTimeout(function() {
			$("#edit-modal").modal('show');
		}, 500);
	},
	'click .view-more-btn': function() {
		Session.set('viewId', this._id);
		Session.set('viewMode', 1);
		Meteor.setTimeout(function() {
			$("#client-info").modal('show');
		}, 500);
	},
	'click .order-info-btn': function() {
		Session.set('viewId', this._id);
		Session.set('orderInfo', 1);
		Meteor.setTimeout(function() {
			$("#order-info").modal('show');
		}, 500);
	},
	'click .cancel-order': function() {
		const orderId = this._id;
		swal({
			title: TAPi18n.__('admin.general.confirm', null),
			text: TAPi18n.__('admin.general.cantUndone', null),
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: TAPi18n.__('admin.orders.confirmCancel', null),
		}, () => {
			Meteor.call('cancelOrder', orderId, (err) => {
				if(err) {
					Bert.alert( TAPi18n.__('admin.orders.failCancel', null), 'danger', 'growl-top-right' );
				} else {
					Bert.alert( TAPi18n.__('admin.orders.successCancel', null), 'success', 'growl-top-right' );
				}
			});
		});
	}
});
