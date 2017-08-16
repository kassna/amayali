const getOrderDetails = () => {
  let orderDetails = {
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
      reference: Session.get('address.reference'),
    }
  };
  if(Session.get('promoCodeValid')) {
    orderDetails.promoCode = Session.get('promoCodeValid').code;
  }
  return orderDetails;
}

const resetOrderSession = () => {
  const toReset = ['locationId', 'product', 'type', 'therapistsType', 'date',
                  'total', 'firstname', 'lastname', 'email', 'phone', 'address.street1',
                  'address.street2', 'address.zip', 'address.reference', 'promoCode', 'promoCodeValid'];
  _.map(toReset, item => {
    Session.set(item, null);
  });
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

const handleErrorPayment = error => {
  if(error.error === 'email-invalid') Bert.alert(TAPi18n.__('book.errors.emailInvalid', null), 'danger');
  else Bert.alert(TAPi18n.__('book.errors.payment', null), 'danger');
}

// Make a call to the REST api to execute the payment
const executePaypal = actions => actions.payment.execute().then(res => {
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
      resetOrderSession();
      if (Meteor.userId()) {
        FlowRouter.go('admin');
      } else {
        FlowRouter.go('book-success', { id: orderId });
      }
    }
  });
})

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
    const code = Session.get('promoCode');
    Meteor.call('verifyPromoCode', code, Session.get('locationId'), (err, res) => {
      if (err || !res) {
        Bert.alert(TAPi18n.__('book.errors.wrongPromoCode', null), 'danger');
      } else {
        const createAccount = Session.get('createAccount');
        if (res.reference && !createAccount) {
          Bert.alert(TAPi18n.__('book.errors.removedReferencePromo', null), 'danger');
        } else {
          Bert.alert(TAPi18n.__('book.errors.successPromoCode', null), 'success');
          Session.set('promoCodeValid', res);
        }
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
  const env = Session.get('paypal_env');
  paypal.Button.render({
    env,
    client: {
        sandbox: 'Ab6JnNhuMzjNDVhueResuMYTirMOwVkmajYwGoD0mACP_0i1VczPp1NQ8vKFJYZYG2X8w27gFJwRySmQ',
        production: 'AZCADNCbS-X7YzWstteXXP-6e-Mbmtt9QiGSNDH69y7a1QpsObsuVAW5o9fqQ1n9eg4nvGBM7uu_VmkT'
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
      if (Session.get('createAccount')) {
        Meteor.call('verifyAvailableEmail', Session.get('email'), (err, res) => {
          if(err || res) {
            handleErrorPayment(err || { error: "email-invalid" });
            return false;
          }
          return executePaypal(actions);
        });
      } else {
        return executePaypal(actions);
      }
    }
  }, '#paypal-button-container');
});
