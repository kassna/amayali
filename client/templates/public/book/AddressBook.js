Template.AddressBook.onCreated(function () {
    this.createAccount = new ReactiveVar(true);
    Session.set('createAccount', true);
});

Template.AddressBook.helpers({
  'createAccount': () => Template.instance().createAccount.get(),
});

Template.AddressBook.events({
  'change [name="createAccount"]': (event, template) => {
    const val = $("[name='createAccount']:checked").val();
    if(val === 'yes') {
      template.createAccount.set(true);
      Session.set('createAccount', true);
    } else {
      template.createAccount.set(false);
      Session.set('createAccount', false);
    }
  },
  'click #back3': () => {
    prevInstance(3);
  },
  'click #next3': (event, template) => {
    // Get all required fields
    const required = ['firstname', 'lastname', 'address.street1', 'address.street2', 'address.zip',
                      'phone', 'email'];

    // If new account will be created, add password as required
    if(template.createAccount.get()) {
      required.push('password');
      required.push('confirmPassword');
    }

    // Add password to sent data
    if(template.createAccount.get()) {
      const password = Session.get('password');
      const confirmPassword = Session.get('confirmPassword');
      // Verify password match
      if(password !== confirmPassword) {
        Bert.alert(TAPi18n.__('book.errors.passwordMatch', null), 'danger');
        return false;
      }
      // Verify email available
      Meteor.call('verifyAvailableEmail', Session.get('email'), (err, res) => {
        if (err || res) {
          Bert.alert(TAPi18n.__('book.errors.emailInvalid', null), 'danger');
        } else {
          nextInstance(required, 3);
        }
      });
    } else {
      nextInstance(required, 3);
    }


  }
});
