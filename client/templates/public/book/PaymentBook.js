const getOrderDetails = () => {
  return {
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
    }
  };
}

const getPayment = () => {
  return {
    number: Session.get('card-number'),
    expirationMonth: Session.get('expirationMonth'),
    expirationYear: Session.get('expirationYear'),
    cvv: Session.get('ccv'),
    billingAddress: {
      postalCode: Session.get('zipBook'),
    }
  };
}

const getAccountDetails = () => {
  return {
    email: Session.get('email'),
    password: Session.get('password'),
    profile: {
      firstname: Session.get('firstname'),
      lastname: Session.get('lastname')
    }
  }
}

const submitPayment = () => {
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
    $('#next4').prop('disabled', false);
  });
}

const handleErrorPayment = error => {
  if(error.error === 'email-invalid') Bert.alert(TAPi18n.__('book.errors.emailInvalid', null), 'danger');
  else Bert.alert(TAPi18n.__('book.errors.payment', null), 'danger');
}

Template.PaymentBook.onCreated(function () {
    this.creditCard = new ReactiveVar(true);
});

Template.PaymentBook.helpers({
  'creditCard': () => Template.instance().creditCard.get(),
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
  'change [name="creditCard"]': (event, template) => {
    const val = $("[name='creditCard']:checked").val();
    if(val === 'yes') {
      template.creditCard.set(true);
    } else {
      template.creditCard.set(false);
    }
  },
  'click #verifyPromo': event => {
    const code = $("[name='promoCode']").val();
    Meteor.call('verifyPromoCode', code, Session.get('locationId'), (err, res) => {
      console.log(err, res);
      if (err || !res) {
        Bert.alert(TAPi18n.__('book.errors.wrongPromoCode', null), 'danger');
      } else {
        Bert.alert(TAPi18n.__('book.errors.successPromoCode', null), 'success');
        Session.set('promoCodeValid', res);
      }
    })
  },
  'click #back4': () => {
    prevInstance(4);
  },
  'click #next4': (event, template) => {
    event.preventDefault();
    $('#next4').prop('disabled', true);

  }
});

/*
  Paypal template
 */

Template.PaypalBook.onRendered(() => {
  // Issue with client credentials https://github.com/paypal/paypal-checkout/issues/356
  paypal.Button.render({
    env: 'sandbox',
    client: {
        sandbox: 'AVQe4DcFH4D27eWWia_9VpTnaB9CAEzG8okzy81BSI95-YMjrBnTRN0JYTMX0Lhj8yc3a9a26EkD9gFx',
    },
    style: {
      label: 'checkout', // checkout | credit | pay
      size:  'responsive',    // small | medium | responsive
      shape: 'rect',     // pill | rect
      color: 'blue'      // gold | blue | silver
    },
    commit: true,
    payment: (data, actions) => {
      const orderDetails = getOrderDetails();
      return actions.payment.create({
        transactions: [{
          amount: {
            total: Session.get('total'),
            currency: 'MXN'
          },
          description: `${orderDetails.product} + ${orderDetails.type}`,
        }]
      }, {
        input_fields: {
          no_shipping: 1
        }
      });
    },
    onError: (err) => {
      // Show an error page here, when an error occurs
      console.log('errr', err);
      handleErrorPayment({ error: "payment" });
    },
    onCancel: (data) => {
      console.log("CANCEL", data);
      handleErrorPayment({ error: "payment" });
    },
    onAuthorize: (data, actions) => {
      Meteor.call('verifyAvailableEmail', Session.get('email'), (err, res) => {
        if(err || res) {
          handleErrorPayment(err || { error: "email-invalid" });
          return false;
        }
        // Make a call to the REST api to execute the payment
        return actions.payment.execute().then(res => {
          let orderDetails = getOrderDetails();
          // Add paypal id to order
          orderDetails.transactionId = res.id;
          let accountDetails = null;

          // Get account details
          if(Session.get('createAccount')) {
            accountDetails = getAccountDetails();
          }

          // Attempt to insert order and account
          Meteor.call('paypalPostPay', orderDetails, accountDetails, (err, res) => {
            if (err) {
              handleErrorPayment(err);
              return false;
            } else {
              const orderId = res;
              // TODO: Add redirect to order review
              console.log('payment success', orderId);
            }
          });
        });
      });
    }
  }, '#paypal-button-container');
});
