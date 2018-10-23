import {Template} from 'meteor/templating';
import {Agents} from '../../../../collections/agents';

Template.adminAgents.onRendered(function () {
    this.autorun(() => this.subscribe('activeAgents'));
});

Template.adminAgents.helpers({
    editItem: () => {
        return Agents.findOne(Session.get('editId'));
    },
    agentCollection: () => Agents
});
