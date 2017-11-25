import Clipboard from 'clipboard'

Template.HistoricalOrders.onCreated(function() {
	let self = this;
	self.autorun(() => {
		self.subscribe('therapistHistoricalOrders', Session.get('currentCity'));
		self.subscribe('completedOrdersSurveys', Session.get('currentCity'));
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
						1: { sorter: false },
						2: { sorter: false },
						3: { sorter: false },
						4: { sorter: false },
						7: { sorter: false },
						13: { sorter: false },
						14: { sorter: false },
		      }
				});
				const clipboard = new Clipboard('.copy-to-clipboard');
				clipboard.on('success', function (e) {
					Bert.alert(TAPi18n.__('admin.orders.copySuccess', null), 'success');
				});
			});
		});
	});
});
