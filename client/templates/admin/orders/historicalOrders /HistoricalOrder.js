Template.HistoricalOrder.helpers({
	answeredSurvey: surveyId => {
		const survey = Surveys.findOne(surveyId);
		return survey && survey.answered;
	}
});


Template.HistoricalOrder.events({
	'click .view-more-btn': function() {
		Session.set('viewId', this._id);
		Session.set('viewMode', 1);
		Meteor.setTimeout(function() {
			$("#client-info").modal('show');
		}, 500);
	},
	'click .order-info-btn': function() {
		Session.set('viewId', this._id);
		Session.set('orderInfo', 1);
		Meteor.setTimeout(function() {
			$("#order-info").modal('show');
		}, 500);
	},
	'click .view-survey-btn': function() {
		// TODO: Open survey modal
	},
});
