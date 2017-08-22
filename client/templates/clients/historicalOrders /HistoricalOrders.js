Template.HistoricalOrdersClient.onCreated(function() {
	let self = this;
	self.autorun(() => {
		self.subscribe('therapistHistoricalOrdersClient');
		self.subscribe('completedOrdersSurveysClient');
	});
});

Template.HistoricalOrdersClient.onRendered(function() {
	let template = this;
	template.autorun(function() {
		template.subscribe('historicalOrdersClient', () => {
			Tracker.afterFlush(() => {
				$("[data-sort=table]").tablesorter({
					sortList: [[0,0]],
					headers: {
						1: { sorter: false },
						3: { sorter: false },
						4: { sorter: false },
						9: { sorter: false },
						10: { sorter: false },
		      }
				});
			});
		});
	});
});
