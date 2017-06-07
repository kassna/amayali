Template.Locations.onRendered(function() {
	let template = this;
	template.subscribe('locations', function () {
		Tracker.afterFlush(function () {
			$("[data-sort=table]").tablesorter({
				sortList: [[0,0]],
				headers: {
          1: { sorter: false },
					2: { sorter: false },
					3: { sorter: false },
					4: { sorter: false },
	      }
			});
		});
	});
});

Template.Locations.helpers({
	editItem: () => {
		return Locations.findOne(Session.get('editId'));
	}
});
