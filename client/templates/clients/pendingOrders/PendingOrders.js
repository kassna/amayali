Template.PendingOrdersClient.onCreated(function() {
	let self = this;
	self.autorun(() => {
		self.subscribe('therapistPendingOrdersClient');
	});
});

Template.PendingOrdersClient.onRendered(function() {
	let template = this;
	template.autorun(function() {
		template.subscribe('pendingOrdersClient', () => {
			Tracker.afterFlush(() => {
				$("[data-sort=table]").tablesorter({
					sortList: [[1,0]],
					headers: {
						0: { sorter: false },
		      }
				});
			});
		});
	});
});
