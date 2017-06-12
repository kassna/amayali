Template.RequestAccess.helpers({
  redirectHome: () => { FlowRouter.go('admin'); }
});

Template.RequestAccess.events({
  'click .request-btn': event => {
    event.preventDefault();
    Meteor.call('requestAdmin', $('#admin-code').val(), (error, result) => {
      if(error) {
        $('.error').removeClass('hidden');
      }
    });
  }
});
