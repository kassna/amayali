Template.Survey.onCreated(function () {
  let self = this;
  self.autorun(function () {
    self.subscribe('survey', FlowRouter.getParam('id'));
  });
});

Template.Survey.onRendered(() => {
  $('img.svg').each(function() {
    const $img = $(this);
    const imgID = $img.attr('id');
    const imgClass = $img.attr('class');
    const imgURL = $img.attr('src');
    const dataStar = $img.attr('data-star');

    $.get(imgURL, function (data) {
      // Get the SVG tag, ignore the rest
      var $svg = $(data).find('svg');

      // Add replaced image's ID to the new SVG
      if (typeof imgID !== 'undefined') {
        $svg = $svg.attr('id', imgID);
      }
      // Add replaced image's classes to the new SVG
      if (typeof imgClass !== 'undefined') {
        $svg = $svg.attr('class', imgClass + ' replaced-svg');
      }

      // Remove any invalid XML tags as per http://validator.w3.org
      $svg = $svg.removeAttr('xmlns:a');

      // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
      if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
        $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
      }

      $svg.attr({
        'width': '16%',
        'height': '100%',
        'data-star': dataStar,
      }).addClass('star');


      // Replace image with new SVG
      $img.replaceWith($svg);

    }, 'xml');
  });
});

Template.Survey.helpers({
  enjoy: () => _.map(['massage', 'service', 'punctuality', 'presentation', 'music', 'other', 'nothing'], _id => {
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
    const $current = $(event.target);
    const experience = parseInt($current.attr('data-star'));
    $('.star').removeClass('active');
    $current.addClass('active');
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
      if (err) {
        $(event.target).prop('disabled', false);
      }
    });
  }
});