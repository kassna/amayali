Template.PendingOrder.onCreated(function() {
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

Template.PendingOrder.helpers({
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
