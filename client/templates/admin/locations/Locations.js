Template.Locations.onRendered(function() {
	let template = this;
	template.autorun(() => {
		template.subscribe('locations', () => {
			Tracker.afterFlush(() => {
				$("[data-sort=table]").tablesorter({
					sortList: [[0,0]],
					headers: {
						2: { sorter: false },
						3: { sorter: false },
						4: { sorter: false },
						5: { sorter: false },
		      }
				});
			});
		});
	});
});

Template.Locations.helpers({
	editItem: () => {
		return Locations.findOne(Session.get('editId'));
	}
});
