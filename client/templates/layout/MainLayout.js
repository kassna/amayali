Template.MainLayout.onCreated(function() {
	if (!Session.get('currentCity')) {
		Session.set('currentCity', '');
	}
});