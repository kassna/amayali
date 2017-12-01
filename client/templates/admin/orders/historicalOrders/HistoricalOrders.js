import Clipboard from 'clipboard'

Template.HistoricalOrders.onCreated(function() {
	let self = this;
	self.autorun(() => {
		self.subscribe('therapistHistoricalOrders', Session.get('currentCity'));
		self.subscribe('completedOrdersSurveys', Session.get('currentCity'));
		self.subscribe('completedOrdersTherapistSurveys', Session.get('currentCity'));
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
						5: { sorter: false },
						6: { sorter: false },
						9: { sorter: false },
						15: { sorter: false },
						16: { sorter: false },
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
