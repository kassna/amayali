Template.HistoricalOrderClient.helpers({
	unansweredSurvey: surveyId => {
		const survey = Surveys.findOne(surveyId);
		return survey && !survey.answered;
	}
});
