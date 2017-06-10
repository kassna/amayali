Template.Admins.onRendered(function() {
	let template = this;
	template.subscribe('admins', function () {
		Tracker.afterFlush(function () {
			$("[data-sort=table]").tablesorter({
				sortList: [[0,0]],
				headers: {
          1: { sorter: false },
					2: { sorter: false },
					3: { sorter: false },
	      }
			});
		});
	});
});
