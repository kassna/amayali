Template.PendingOrdersAgent.onCreated(function() {
    let self = this;
    self.autorun(() => {
        self.subscribe('therapistPendingOrdersClient');
    });
});

Template.PendingOrdersAgent.onRendered(function() {
    let template = this;
    template.autorun(function() {
        template.subscribe('pendingOrdersAgent', () => {
            if(Orders.find().count()) {
                Tracker.afterFlush(() => {
                    $("[data-sort=table]").tablesorter({
                        sortList: [[1,0]],
                        headers: {
                            0: { sorter: false },
                        }
                    });
                });
            }
        });
    });
});
