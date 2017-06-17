Template.PaymentBook.onCreated(function () {
    this.createAccount = new ReactiveVar(true);
});

Template.PaymentBook.helpers({
  'createAccount': () => Template.instance().createAccount.get(),
  'months': () => _.map(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'], _id => {
    return {
      _id,
      name: () => TAPi18n.__(`book.months.${_id}`, null)
    }
  }),
  'years': () => {
    const currYear = moment().year();
    const arr = [];
    for (var i = 0; i <= 12; i++) {
      arr.push({
        _id: String(currYear + i).substring(2),
        name: currYear + i
      });
    }
    return arr;
  }
});

Template.PaymentBook.events({
  'change [name="createAccount"]': (event, template) => {
    const val = $("[name='createAccount']:checked").val();
    if(val === 'yes') {
      template.createAccount.set(true);
    } else {
      template.createAccount.set(false);
    }
  },
  'click #back3': () => {
    prevInstance(3);
  },
  'click #next3': (event, template) => {
    event.preventDefault();
    $('#next3').prop('disabled', true);
    // Get all required fields
    const required = ['firstname', 'lastname', 'address.street1', 'address.street2', 'address.zip',
                      'phone', 'email', 'card-number', 'ccv', 'expirationMonth', 'expirationYear',
                      'zipBook'];
    let accountDetails = null;

    // If new account will be created, add password as required
    if(template.createAccount.get()) {
      required.push('password');
      required.push('confirmPassword');
    }
    // Verify required fields
    if(!verifyRequired(required)) {
      $('#next3').prop('disabled', false);
      return false;
    }

    // Add password to sent data
    if(template.createAccount.get()) {
      const password = Session.get('password');
      const confirmPassword = Session.get('confirmPassword');
      // Verify password match
      if(password !== confirmPassword) {
        $('#next3').prop('disabled', false);
        Bert.alert(TAPi18n.__('book.errors.passwordMatch', null), 'danger');
        return false;
      }
      accountDetails = { password }
    }

    // Create Braintree token
    const braintree = require('braintree-web');
    braintree.client.create({ authorization: 'sandbox_ytw8szp7_v2vwcjx3ck3fmz2y'}).then(client => {
      client.request({
        endpoint: 'payment_methods/credit_cards',
        method: 'post',
        data: {
          creditCard: {
            number: Session.get('card-number'),
            expirationMonth: Session.get('expirationMonth'),
            expirationYear: Session.get('expirationYear'),
            cvv: Session.get('ccv'),
            billingAddress: {
              postalCode: Session.get('zipBook'),
            }
          }
        }
      }).then(response => {
        // Get nonce from Braintree
        const { nonce } = response.creditCards[0];
        // Create order object
        const order = {
          locationId: Session.get('locationId'),
          product: Session.get('product'),
          type: Session.get('type'),
          therapistsType: Session.get('therapistsType'),
          date: Session.get('date'),
          total: Session.get('total'),
          firstname: Session.get('firstname'),
          lastname: Session.get('lastname'),
          email: Session.get('email'),
          phone: Session.get('phone'),
          address: {
            street1: Session.get('address.street1'),
            street2: Session.get('address.street2'),
            zip: Session.get('address.zip'),
          },
        };
        // If we need to create an account, add the corresponding info
        if(accountDetails) {
          accountDetails.email = order.email;
          accountDetails.profile = {
            firstname: order.firstname,
            lastname: order.lastname
          }
        }
        console.log('tocall', accountDetails, nonce);
        // Send data to server
        Meteor.call('attemptPurchase', nonce, order, accountDetails, (err, res) => {
          if(err) {
            if(err.error === 'email-invalid') Bert.alert(TAPi18n.__('book.errors.emailInvalid', null), 'danger');
          }
          console.log(res);
          $('#next3').prop('disabled', false);
        });
      }).catch(err => {
        console.log(err);
        $('#next3').prop('disabled', false);
      });
    }).catch(err => {
      console.log(err);
    });
  }
});
