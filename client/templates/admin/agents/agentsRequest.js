import {Template} from 'meteor/templating';
import {Agents} from '../../../../collections/agents';
import {Session} from 'meteor/session';

Template.adminAgentsRequest.onRendered(function () {
    this.autorun(() => {
        this.subscribe('inactiveAgents', Session.get('currentCity'), () => {
            Tracker.afterFlush(() => {
                if (Agents.find().count()) {
                    $('[data-sort=table]').tablesorter({
                        sortList: [[1, 0]],
                        headers: {
                            0: {sorter: false},
                            10: {sorter: false}
                        }
                    });
                }
            });
        });
    });
});
