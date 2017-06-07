class ClientsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.createdAt = new Date();
    return super.insert(ourDoc, callback);
  }

  // TODO: Remove function verify if client has orders
}

Clients = new ClientsCollection('clients');

// Address schema
AddressSchema = new SimpleSchema({
  street1: {
    type: String,
  },
  street2: {
    type: String,
  },
  zip: {
    type: String,
    regEx: SimpleSchema.RegEx.ZipCode,
  },
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
});

ClientsSchema = new SimpleSchema({
  firstname: {
    type: String,
    autoform: {
      afFieldInput: {
        type: 'hidden',
      },
      afFormGroup: {
        label: false,
      },
    },
  },
  lastname: {
    type: String,
    autoform: {
      afFieldInput: {
        type: 'hidden',
      },
      afFormGroup: {
        label: false,
      },
    },
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    autoform: {
      afFieldInput: {
        type: 'hidden',
      },
      afFormGroup: {
        label: false,
      },
    },
  },
  phone: {
    type: String
  },
  address: {
    type: AddressSchema,
  },
  promoCodeId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'hidden',
      },
      afFormGroup: {
        label: false,
      },
    },
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
    autoform: {
      afFieldInput: {
        type: 'hidden',
      },
      afFormGroup: {
        label: false,
      },
    },
  },
  completedProfile: {
    type: Boolean,
    defaultValue: false,
    autoform: {
      afFieldInput: {
        type: 'hidden',
      },
      afFormGroup: {
        label: false,
      },
    },
  },
});

Clients.after.insert((userId, doc) => {
  doc.promoCodeId = PromoCodes.insert({
    type: 'percentage',
    amount: 10,
    locationsId: [doc.location],
  });
});

// Add translations to labels
for(const prop in ClientsSchema._schema) {
  // Skip the key of the nested schema
  if(prop === 'address') continue;
  ClientsSchema._schema[prop].label = function () {
    return TAPi18n.__(`schemas.clients.${prop}`, null);
  }
}

Clients.attachSchema(ClientsSchema);
