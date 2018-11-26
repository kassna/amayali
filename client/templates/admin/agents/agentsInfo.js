import {Agents} from '../../../../collections/agents';

Template.AgentInfo.helpers({
  currentAgent: () => Agents.findOne(Session.get('viewId'))
});
