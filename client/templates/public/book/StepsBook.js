Template.StepsBook.helpers({
  instance: () => Session.get('intance'),
  maxIntance: () => Session.get('maxIntance'),
});

Template.StepsBook.events({
  'click .steps-book li:not(.disabled)': event => {
    let target = $(event.target).attr('data-step');
    if(!target) target = $(event.target).parents('li').attr('data-step');
    Session.set('instance', Number(target));
    scrollTop();
  }
});
