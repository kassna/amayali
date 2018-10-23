import {Template} from 'meteor/templating';
import {Agents} from '../../../../collections/agents';

Template.adminAgents.onCreated(function () {
    let self = this;
    self.autorun(function () {
        self.subscribe('orders', Session.get('currentCity'));
    });
});

Template.adminAgents.onRendered(function () {
    this.autorun(() => {
        this.subscribe('activeAgents', () => {
            Tracker.afterFlush(() => {
                if (Agents.find().count()) {
                    $('[data-sort=table]').tablesorter({
                        sortList: [[1, 0]],
                        headers: {
                            0: {sorter: false},
                            8: {sorter: false},
                            9: {sorter: false},
                            10: {sorter: false},
                            11: {sorter: false}
                        }
                    });
                }
            });
        });
    });
});

Template.adminAgents.helpers({
    editItem: () => {
        return Agents.findOne(Session.get('editId'));
    },
    agentCollection: () => Agents
});
