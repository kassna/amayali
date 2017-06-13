Template.Clients.onRendered(function() {
	let template = this;
	template.subscribe('clients', Session.get('currentCity'), function () {
		Tracker.afterFlush(function () {
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

Template.Clients.helpers({
	editItem: () => {
		return Clients.findOne(Session.get('editId'));
	}
});
