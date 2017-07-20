Template.Survey.onCreated(function() {
	let self = this;
	self.autorun(function() {
		self.subscribe('survey', FlowRouter.getParam('id'));
	});
});


Template.Survey.helpers({
  enjoy: () => _.map(['massage', 'service', 'punctuality', 'presentation', 'music', 'other'], _id => {
    return {
      _id,
      name: () => TAPi18n.__(`survey.enjoy.${_id}`, null)
    }
  }),
  comment: () => _.map(['suggestion', 'congratulations', 'complain'], _id => {
    return {
      _id,
      name: () => TAPi18n.__(`survey.comment.${_id}`, null)
    }
  }),
});

Template.Survey.events({
  'click .star': event => {
    const experience = parseInt($(event.target).attr('data-star'));
    $('.star').removeClass('fa-star').addClass('fa-star-o');
    for(let i = 1; i <= experience; i++) {
      $(`.star[data-star="${i}"]`).removeClass('fa-star-o').addClass('fa-star');
    }
    Session.set('experience', experience);
  },
  'change #comment': event => {
    Session.set('comment', $(event.target).val());
  },
  'click #sendSurvey': event => {
    $(event.target).prop('disabled', true);
    event.preventDefault();
    const id = FlowRouter.getParam('id');
    const survey = {
      question1: Session.get('experience'),
      question2: Session.get('enjoy'),
      question3: Session.get('improve'),
      question4: Session.get('commentType'),
      comments: Session.get('comment'),
      answered: true,
    }
    Meteor.call('completeSurvey', id, survey, err => {
      if(err) {
        $(event.target).prop('disabled', false);
      }
    });
  }
});