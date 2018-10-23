Template.AgentInfo.helpers({
  currentAgent: () => Agents.findOne(Session.get('viewId'))
});
