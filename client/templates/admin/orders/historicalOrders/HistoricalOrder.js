Template.HistoricalOrder.helpers({
	answeredSurvey: (surveyId, inverse) => {
		const survey = Surveys.findOne(surveyId);
		return inverse
		  ? !survey || !survey.answered
			: survey && survey.answered;
	},
	answeredTherapistSurvey: (surveyId, inverse) => {
		const survey = TherapistSurveys.findOne(surveyId);
		return inverse
		? !survey || !survey.answered
		: survey && survey.answered;
	},
	therapistSurveyLink: surveyId => `${Meteor.absoluteUrl()}encuestaTerapeuta/${surveyId}`,
	surveyLink: surveyId => `${Meteor.absoluteUrl()}encuesta/${surveyId}`
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
		Session.set('viewId', this.survey);
		Session.set('surveyInfo', 1);
		Meteor.setTimeout(function() {
			$("#survey-info").modal('show');
		}, 500);
	},
	'click .view-therapist-survey-btn': function () {
		Session.set('viewId', this.therapistSurvey);
		Session.set('therapistSurveyInfo', 1);
		Meteor.setTimeout(function () {
			$("#therapist-survey-info").modal('show');
		}, 500);
	},
	'change input': function (event) {
		const $input = $(event.target);
		const attribute = $input.attr('name');
		let val = $input.val();

		if (val > 10) {
			val = 10;
			$input.val(val);
		}

		if (val < 0) {
			val = 0;
			$input.val(val);
		}

		Meteor.call('updateOrderGrade', this._id, attribute, val, err => {
			if (err) {
				$input.val('');
			}
		});
	}
});
