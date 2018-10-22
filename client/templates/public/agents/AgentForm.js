import {Template} from 'meteor/templating';
import {Agents} from '../../../../collections/agents';

Template.AgentForm.helpers({
    sendText: () => TAPi18n.__('general.send', null),
    agentCollection: () => Agents
});
