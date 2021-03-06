class OrdersCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.createdAt = new Date();

    const client = Clients.findOne(ourDoc.clientId);
    // If order has client, get info from account
    if (client) {
      const { firstname, lastname, email, phone, address } = client;
      _.merge(ourDoc, { firstname, lastname, email, phone, address });
      Meteor.isClient && $('#new-modal').modal('hide');
      Meteor.isClient && Bert.alert(TAPi18n.__('admin.general.successInsert', null), 'success', 'growl-top-right');
    }
    // Send new order emails
    Meteor.call('sendNewOrder', ourDoc);
    return super.insert(ourDoc, callback);
  }

  remove(selector, callback) {
    this.find(selector).map(item => {
      Surveys.remove(item.survey);
    });
    Meteor.isClient && Bert.alert( TAPi18n.__('admin.general.successDelete', null), 'success', 'growl-top-right' );
    return super.remove(selector, callback);
  }
}

Orders = new OrdersCollection('orders');

Orders.allow({
  insert: function(userId, doc) {
    // just admins can create
    return Roles.userIsInRole(userId, ['admin']);
  },
  update: function(userId, doc) {
    // just admins can update
    return Roles.userIsInRole(userId, ['admin']);
  },
  remove: function (userId, doc) {
    // just admins can delete
    return Roles.userIsInRole(userId, ['admin']);
  }
});

OrdersSchema = new SimpleSchema({
  locationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoform: {
      type: 'select-radio-inline',
      options() {
        return Locations.find().map(location => ({ label: location.name, value: location._id }));
      },
    },
  },
  product: {
    type: String,
    allowedValues: ['60', '90', '120'],
    autoform: {
      type: 'select-radio-inline',
      options () {
        return _.map(['60', '90', '120'], (option) => {
          return {
            value: option,
            label: TAPi18n.__(`schemas.orders.productSelect.options.${option}`, null),
          }
        });
      }
    },
  },
  type: {
    type: String,
    allowedValues: ['relax', 'decontracting', 'sport'],
    autoform: {
      type: 'select-radio-inline',
      options () {
        return _.map(['relax', 'decontracting', 'sport'], (option) => {
          return {
            value: option,
            label: TAPi18n.__(`schemas.orders.typeSelect.options.${option}`, null),
          }
        });
      }
    },
  },
  therapistsType: {
    type: String,
    allowedValues: ['any', 'female', 'male', 'same'],
    autoform: {
      type: 'select-radio-inline',
      options () {
        return _.map(['any', 'female', 'male', 'same'], (option) => {
          return {
            value: option,
            label: TAPi18n.__(`schemas.orders.therapistsTypeSelect.options.${option}`, null),
          }
        });
      }
    },
  },
  date: {
    type: String,
    autoform: {
      afFieldInput: {
        type: "datetimepicker",
      }
    }
  },
  total: {
    type: Number,
    decimal: true,
  },
  promoCode: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    },
  },
  therapist: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    autoform: {
      firstOption: '(Selecciona)',
      options() {
        return Therapists.find().map(therapist => ({ label: therapist.name, value: therapist._id }));
      },
    },
  },
  clientId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    autoform: {
      firstOption: '(Selecciona)',
      options() {
        return Clients.find().map(({ _id, firstname, lastname }) => ({ label: `${firstname} ${lastname}`, value: _id }));
      },
    },
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  phone: {
    type: String,
  },
  address: {
    type: AddressSchema,
  },
  transactionId: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    },
  },
  survey: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    autoform: {
      omit: true
    },
  },
  therapistSurvey: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    autoform: {
      omit: true
    },
  },
  referencePromos: {
    type: Number,
    defaultValue: 0,
    autoform: {
      omit: true
    },
  },
  therapistGrade: {
    type: Number,
    min: 0,
    max: 10,
    optional: true,
    autoform: {
      omit: true
    },
  },
  clientGrade: {
    type: Number,
    min: 0,
    max: 10,
    optional: true,
    autoform: {
      omit: true
    },
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    },
    denyUpdate: true,
    autoform: {
      omit: true
    },
  },
  status: {
    type: String,
    defaultValue: 'confirmed',
    allowedValues:
      ['confirmed', 'canceled', 'completed'],
    autoform: {
      omit: true
    },
  },
  canceledBy: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    },
  },
});

// Create client and therapist survey for this order
Orders.before.insert((userId, doc) => {
  doc.survey = Surveys.insert({});
  doc.therapistSurvey = TherapistSurveys.insert({});
});

// Add translations to labels
for(const prop in OrdersSchema._schema) {
  // Skip the key of the nested schema
  if(prop === 'address') continue;
  OrdersSchema._schema[prop].label = function () {
    return TAPi18n.__(`schemas.orders.${prop}`, null);
  }
}

Orders.attachSchema(OrdersSchema);
