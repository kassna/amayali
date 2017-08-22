Template.SurveyInfo.helpers({
  currentSurvey: () => Surveys.findOne(Session.get('viewId'))
});
