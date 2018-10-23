import {Template} from 'meteor/templating';
import {Agents} from '../../../../collections/agents';

Template.adminAgentsRequest.onRendered(function () {
    this.autorun(() => {
        this.subscribe('inactiveAgents', Session.get('currentCity'), () => {
            Tracker.afterFlush(() => {
                if (Agents.find().count()) {
                    $('[data-sort=table]').tablesorter({
                        sortList: [[1, 0]],
                        headers: {
                            0: {sorter: false},
                            7: {sorter: false},
                            8: {sorter: false},
                            9: {sorter: false},
                            10: {sorter: false}
                        }
                    });
                }
            });
        });
    });
});

Template.adminAgentsRequest.helpers({
    editItem: () => {
        return Agents.findOne(Session.get('editId'));
    },
    agentCollection: () => Agents
});
