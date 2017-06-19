Template.HistoricalOrdersClient.onCreated(function() {
	let self = this;
	self.autorun(() => {
		self.subscribe('therapistHistoricalOrdersClient');
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
