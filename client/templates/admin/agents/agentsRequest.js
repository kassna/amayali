import {Template} from 'meteor/templating';
import {Agents} from '../../../../collections/agents';

Template.adminAgentsRequest.onRendered(function () {
    this.autorun(() => this.subscribe('inactiveAgents'));
});

Template.adminAgentsRequest.helpers({
    editItem: () => {
        return Agents.findOne(Session.get('editId'));
    },
    agentCollection: () => Agents
});
