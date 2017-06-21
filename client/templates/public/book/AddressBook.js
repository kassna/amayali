Template.AddressBook.onCreated(function () {
    const createAccount = Session.get('createAccount');
    if (createAccount === undefined) {
      Session.set('createAccount', true);
    }
});

Template.AddressBook.events({
  'change [name="createAccount"]': event => {
    const val = $("[name='createAccount']:checked").val();
    if(val === 'yes') {
      Session.set('createAccount', true);
    } else {
      Session.set('createAccount', false);
      // Verify if has a reference code, to remove it
      const promoCodeValid = Session.get('promoCodeValid');
      if (promoCodeValid) {
        const { reference } = promoCodeValid;
        if (reference) {
          Session.set('promoCodeValid', null);
          Bert.alert(TAPi18n.__('book.errors.removedReferencePromo', null), 'danger');
        }
      }
    }
  },
  'click #back3': () => {
    prevInstance(3);
  },
  'click #next3': event => {
    // Get all required fields
    const required = ['firstname', 'lastname', 'address.street1', 'address.street2', 'address.zip',
                      'phone', 'email'];
    const createAccount = Session.get('createAccount');

    // Add password to sent data
    if(createAccount) {
      // Add password as required
      required.push('password');
      required.push('confirmPassword');
      // Get values
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
