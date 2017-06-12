Template.TherapistInfo.helpers({
  currentTherapist: () => Therapists.findOne(Session.get('viewId'))
});
