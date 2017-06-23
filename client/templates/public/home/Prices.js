Template.Prices.events({
  'click .massage-type': event => {
    const type = $(event.target).attr('data-type');
    Session.set('type', type);
    FlowRouter.go('book');
  }
});
