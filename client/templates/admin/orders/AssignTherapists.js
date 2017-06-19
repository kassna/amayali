Template.AssignTherapists.onCreated(function() {
	let self = this;
	self.autorun(() => {
		self.subscribe('noTherapistOrders', Session.get('currentCity'));
    self.subscribe('activeTherapists', Session.get('currentCity'));
	});
});

Template.AssignTherapists.events({
	'click .assign-btn': function () {
		const order = Session.get('selectedOrder');
		const therapist = Session.get('selectedTherapist');
		if (!order || !therapist) {
			Bert.alert( TAPi18n.__('admin.orders.failAssign', null), 'danger', 'growl-top-right' );
			return false;
		}

		swal({
			title: TAPi18n.__('admin.general.confirm', null),
			text: TAPi18n.__('admin.orders.confirmAssignQ', null),
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: TAPi18n.__('admin.orders.confirmAssign', null),
		}, () => {
			Meteor.call('assignOrderTherapist', order, therapist, err => {
				if (err) {
					Bert.alert( TAPi18n.__('admin.orders.failAssign', null), 'danger', 'growl-top-right' );
				} else {
					Session.set('selectedOrder', null);
					Session.set('selectedTherapist', null);
					Bert.alert( TAPi18n.__('admin.orders.successAssign', null), 'success', 'growl-top-right' );
				}
			});
		});
	}
});

Template.AssignTherapistsOrder.events({
	'click .order-item': function () {
		Session.set('selectedOrder', this._id);
	}
});

Template.AssignTherapistsTherapist.events({
	'click .therapist-item': function () {
		Session.set('selectedTherapist', this._id);
	},
	'click .info-icon': function() {
		Session.set('viewId', this._id);
		Session.set('viewMode', 1);
		Meteor.setTimeout(function() {
			$("#therapist-info").modal('show');
		}, 500);
	},
});
