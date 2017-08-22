Template.ContactUs.events({
  'click #send-contact-us': () => {
    $('#send-contact-us').prop('disabled', true);
    const name = Session.get('contact.name');
    const email = Session.get('contact.email');
    const phone = Session.get('contact.phone');
    const message = Session.get('contact.message');

    if (!name || !email || !message) {
      Bert.alert(TAPi18n.__('landing.contact.requiredFields', null), 'danger');
      $('#send-contact-us').prop('disabled', false);
      return false;
    }
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegEx.test(email)) {
      Bert.alert(TAPi18n.__('landing.contact.invalidEmail', null), 'danger');
      $('#send-contact-us').prop('disabled', false);
      return false;
    }

    Meteor.call('sendContactUs', name, email, phone, message, err => {
      if (err) {
        Bert.alert(TAPi18n.__('landing.contact.messageFail', null), 'danger');
      } else {
        Bert.alert(TAPi18n.__('landing.contact.messageSuccess', null), 'success');
      }
      $('#send-contact-us').prop('disabled', false);
    });
  }
});
