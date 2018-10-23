Template.AdminAgentsRequest.onRendered(function() {

});

Template.AdminAgentsRequest.helpers({
	editItem: () => {
		return Agents.findOne(Session.get('editId'));
	}
});
