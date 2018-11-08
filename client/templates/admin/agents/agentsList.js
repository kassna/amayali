import {Template} from 'meteor/templating';
import {Agents} from '../../../../collections/agents';
import {Session} from 'meteor/session';

Template.adminAgentsList.onCreated(function () {
    this.autorun(() => this.subscribe('orders', Session.get('currentCity')));
});

Template.adminAgentsList.helpers({
    editItem: () => Agents.findOne(Session.get('editId')),
    agentCollection: () => Agents
});
