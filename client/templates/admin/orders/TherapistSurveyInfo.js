Template.TherapistSurveyInfo.helpers({
  currentSurvey: () => TherapistSurveys.findOne(Session.get('viewId'))
});
