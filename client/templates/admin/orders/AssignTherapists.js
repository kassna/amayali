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

Template.AssignTherapistsOrder.onCreated(function() {
	const self = this;
	this.rating = new ReactiveVar(0);
	this.clientId = new ReactiveVar(null);
	self.autorun(() => {
		Meteor.call('getClientRating', this.clientId.get(), (err, res) => {
      if (res > 0) {
				self.rating.set(res);
			} else {
				self.rating.set('N/A');
			}
    });
	});
});

Template.AssignTherapistsOrder.helpers({
	getClientId: function () {
		Template.instance().clientId.set(this.clientId);
	},
	rating: () => Template.instance().rating.get(),
	ratingColor: () => {
		const rating = Template.instance().rating.get();
		if (rating === 'N/A') {
			return false;
		}
		else if (rating > 7) {
			return 'c-green';
		} else if (rating > 5) {
			return 'c-yellow'
		} else {
			return 'c-error';
		}
	}
});

Template.AssignTherapistsOrder.events({
	'click .order-item': function () {
		Session.set('selectedOrder', this._id);
	}
});

Template.AssignTherapistsTherapist.onCreated(function() {
	const self = this;
	this.rating = new ReactiveVar(0);
	this.therapist = new ReactiveVar(null);
	self.autorun(() => {
		Meteor.call('getTherapistRating', this.therapist.get(), (err, res) => {
      if (res > 0) {
				self.rating.set(res);
			} else {
				self.rating.set('N/A');
			}
    });
	});
});

Template.AssignTherapistsTherapist.helpers({
	getTherapist: function () {
		Template.instance().therapist.set(this._id);
	},
	rating: () => Template.instance().rating.get(),
	ratingColor: () => {
		const rating = Template.instance().rating.get();
		if (rating === 'N/A') {
			return false;
		}
		else if (rating > 7) {
			return 'c-green';
		} else if (rating > 5) {
			return 'c-yellow'
		} else {
			return 'c-error';
		}
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
