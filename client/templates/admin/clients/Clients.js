Template.Clients.onCreated(function() {
	let self = this;
	self.autorun(() => {
		self.subscribe('clientOrders', Session.get('currentCity'));
	});
});

Template.Clients.onRendered(function() {
	let template = this;
	template.autorun(() => {
		template.subscribe('clients', Session.get('currentCity'), () => {
			Tracker.afterFlush(() => {
				if(Clients.find().count()) {
					$("[data-sort=table]").tablesorter({
						sortList: [[1,0]],
						headers: {
		          0: { sorter: false },
							3: { sorter: false },
							6: { sorter: false },
							7: { sorter: false },
							8: { sorter: false },
			      }
					});
				}
			});
		});
	});
});

Template.Clients.helpers({
	editItem: () => {
		return Clients.findOne(Session.get('editId'));
	}
});
