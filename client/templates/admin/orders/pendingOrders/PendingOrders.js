Template.PendingOrders.onCreated(function() {
	let self = this;
	self.autorun(() => {
		self.subscribe('therapistPendingOrders', Session.get('currentCity'));
	});
});

Template.PendingOrders.onRendered(function() {
	let template = this;
	template.autorun(function() {
		template.subscribe('pendingOrders', Session.get('currentCity'), () => {
			Tracker.afterFlush(() => {
				$("[data-sort=table]").tablesorter({
					sortList: [[0,0]],
					headers: {
						3: { sorter: false },
						4: { sorter: false },
						9: { sorter: false },
						10: { sorter: false },
						11: { sorter: false },
						12: { sorter: false },
		      }
				});
			});
		});
	});
});

Template.PendingOrders.helpers({
	editItem: () => {
		return Orders.findOne(Session.get('editId'));
	}
});
