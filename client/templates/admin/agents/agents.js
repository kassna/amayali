Template.AdminAgents.onCreated(function() {
	let self = this;
	self.autorun(function() {
		self.subscribe('orders', Session.get('currentCity'));
	});
});

Template.AdminAgents.onRendered(function() {
	let template = this;
	template.autorun(function() {
		template.subscribe('currentAgents', Session.get('currentCity'), () => {
			Tracker.afterFlush(() => {
				if(Agent.find().count()) {
					$("[data-sort=table]").tablesorter({
						sortList: [[1,0]],
						headers: {
							0: { sorter: false },
							4: { sorter: false },
							7: { sorter: false },
							8: { sorter: false },
							10: { sorter: false },
							11: { sorter: false },
							12: { sorter: false },
							13: { sorter: false },
							14: { sorter: false },
			      }
					});
				}
			});
		});
	});
});

Template.AdminAgents.helpers({
	editItem: () => {
		return Agent.findOne(Session.get('editId'));
	}
});
