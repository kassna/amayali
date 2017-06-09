class OrdersCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.createdAt = new Date();
    return super.insert(ourDoc, callback);
  }
}

Orders = new OrdersCollection('orders');

Orders.allow({
  insert: function(userId, doc) {
    // everybody can register orders
    return true;
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
  terapist: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    autoform: {
      omit: true
    },
  },
  firstname: {
    type: String,
    autoform: {
      omit: true
    },
  },
  lastname: {
    type: String,
    autoform: {
      omit: true
    },
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    autoform: {
      omit: true
    },
  },
  phone: {
    type: String
  },
  address: {
    type: AddressSchema,
  },
  survey: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    autoform: {
      omit: true
    },
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return Date.now();
      } else if (this.isUpsert) {
        return {$setOnInsert: Date.now()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    },
    denyUpdate: true,
    autoform: {
      omit: true
    },
  },
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
