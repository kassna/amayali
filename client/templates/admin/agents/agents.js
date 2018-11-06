import {Template} from 'meteor/templating';
import {Agents} from '../../../../collections/agents';
import {Session} from 'meteor/session';

Template.adminAgents.onRendered(function () {
    this.autorun(() => {
        this.subscribe('activeAgents', Session.get('currentCity'), () => {
            Tracker.afterFlush(() => {
                if (Agents.find().count()) {
                    $('[data-sort=table]').tablesorter({
                        sortList: [[1, 0]],
                        headers: {
                            0: {sorter: false},
                            11: {sorter: false}
                        }
                    });
                }
            });
        });
    });
});
