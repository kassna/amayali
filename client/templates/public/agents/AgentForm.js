import {Template} from 'meteor/templating';
import {Agents, AgentsSchema} from '../../../../collections/agents';

Template.AgentForm.helpers({
    sendText: () => TAPi18n.__('general.send', null),
    agentCollection: () => Agents,
    agentSchema: () => AgentsSchema
});

AutoForm.hooks({
    insertAgentFormPublic: {
        after: {
            insert: (error, result) => {
                if (!error) {
                    Meteor.call('sendNewAgent', result);
                }
            }
        },
        onSuccess: () => FlowRouter.go('agent-success')
    }
});

