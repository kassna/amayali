Template.PromoCodes.onRendered(function() {
	let template = this;
	template.subscribe('promoCodes', function () {
		Tracker.afterFlush(function () {
			$("[data-sort=table]").tablesorter({
				sortList: [[0,0]],
				headers: {
					4: { sorter: false },
					5: { sorter: false },
					6: { sorter: false },
					7: { sorter: false },
					8: { sorter: false },
	      }
			});
		});
	});
});

Template.PromoCodes.helpers({
	editItem: () => {
		return PromoCodes.findOne(Session.get('editId'));
	}
});
