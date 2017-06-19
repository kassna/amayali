Template.HistoricalOrders.onCreated(function() {
	let self = this;
	self.autorun(() => {
		self.subscribe('therapistHistoricalOrders', Session.get('currentCity'));
	});
});

Template.HistoricalOrders.onRendered(function() {
	let template = this;
	template.autorun(function() {
		template.subscribe('historicalOrders', Session.get('currentCity'), () => {
			Tracker.afterFlush(() => {
				$("[data-sort=table]").tablesorter({
					sortList: [[0,0]],
					headers: {
						2: { sorter: false },
						3: { sorter: false },
						8: { sorter: false },
						9: { sorter: false },
		      }
				});
			});
		});
	});
});
