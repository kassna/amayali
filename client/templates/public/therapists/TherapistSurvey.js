Template.TherapistSurvey.onCreated(function () {
  let self = this;
  self.autorun(function () {
    self.subscribe('therapistSurvey', FlowRouter.getParam('id'));
  });
});

Template.TherapistSurvey.onRendered(() => {
  $('img.svg').each(function () {
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

Template.TherapistSurvey.helpers({
  clean: () => _.map(['yes', 'no'], _id => {
    return {
      _id,
      name: () => TAPi18n.__(`therapistSurvey.clean.${_id}`, null)
    }
  }),
  agression: () => _.map(['yes', 'no'], _id => {
    return {
      _id,
      name: () => TAPi18n.__(`therapistSurvey.agression.${_id}`, null)
    }
  }),
});

Template.TherapistSurvey.events({
  'click .star-client': event => {
    const $current = $(event.target);
    const experience = parseInt($current.attr('data-star'));
    $('.star-client').removeClass('active');
    $current.addClass('active');
    Session.set('client', experience);
  },
  'click .star-kindness': event => {
    const $current = $(event.target);
    const experience = parseInt($current.attr('data-star'));
    $('.star-kindness').removeClass('active');
    $current.addClass('active');
    Session.set('kindness', experience);
  },
  'change #observations': event => {
    Session.set('observations', $(event.target).val());
  },
  'change #comments': event => {
    Session.set('comments', $(event.target).val());
  },
  'click #sendSurvey': event => {
    $(event.target).prop('disabled', true);
    event.preventDefault();
    const id = FlowRouter.getParam('id');
    const survey = {
      question1: Session.get('client'),
      question2: Session.get('kindness'),
      question3: Session.get('clean'),
      question4: Session.get('agression'),
      question5: Session.get('observations'),
      question6: Session.get('comments'),
      answered: true,
    }
    Meteor.call('completeTherapistSurvey', id, survey, err => {
      if (err) {
        $(event.target).prop('disabled', false);
      }
    });
  }
});