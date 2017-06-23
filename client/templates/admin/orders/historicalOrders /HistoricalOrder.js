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
