Template.AdminTherapists.onRendered(function() {
	let template = this;
	template.autorun(function() {
		template.subscribe('therapists', Session.get('currentCity'), function () {
			Tracker.afterFlush(function () {
				if(Therapists.find().count()) {
					$("[data-sort=table]").tablesorter({
						sortList: [[1,0]],
						headers: {
							0: { sorter: false },
							3: { sorter: false },
							4: { sorter: false },
							7: { sorter: false },
							8: { sorter: false },
							9: { sorter: false },
							10: { sorter: false },
							11: { sorter: false },
							12: { sorter: false },
							13: { sorter: false },
			      }
					});
				}
			});
		});
	});
});

Template.AdminTherapists.helpers({
	editItem: () => {
		return Therapists.findOne(Session.get('editId'));
	}
});
