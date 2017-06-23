class ClientsCollection extends Mongo.Collection {
  update(selector, modifier, options, callback) {
    const { $set, $unset } = modifier;
    if (!$unset) {
      $set.completedProfile = true;
      modifier.$set = $set;
    }
    return super.update(selector, modifier, options, callback);
  }

  // Remove clients that has no orders, and also removes user and promoCode
  remove(selector, callback) {
    Meteor.call('removeClients', selector, err => {
      if (err) {
        Bert.alert( TAPi18n.__('admin.general.failDelete', null), 'danger', 'growl-top-right' );
        return false;
      }
      this.find(selector).map(item => {
        Meteor.users.remove(item.userId);
        PromoCodes.remove(item.promoCodeId);
      });
      Bert.alert( TAPi18n.__('admin.general.successDelete', null), 'success', 'growl-top-right' );
      return super.remove(selector, callback);
    });


  }

  // Function to remove client without removing user. This is used to promote client to admin
  partialRemove(selector, callback) {
    const ids = this.find(selector).map(item => item._id);
    if(Orders.find({ clientId: { $in: ids } }).count()) {
      throw new Meteor.Error('client-has-orders', `Client can't be deleted because it has orders`);
    }

    this.find(selector).map(item => {
      PromoCodes.remove(item.promoCodeId);
    });

    return super.remove(selector, callback);
  }
}

Clients = new ClientsCollection('clients');

Clients.allow({
  insert: function(userId, doc) {
    // just admins can update
    return true;
  },
  update: function(userId, doc) {
    // just admins can update
    return Roles.userIsInRole(userId, ['admin']) || userId === doc.userId;
  },
  remove: function (userId, doc) {
    // just admins can delete
    return Roles.userIsInRole(userId, ['admin']);
  }
});

// Address schema
AddressSchema = new SimpleSchema({
  street1: {
    type: String,
    optional: true
  },
  street2: {
    type: String,
    optional: true
  },
  zip: {
    type: String,
    regEx: SimpleSchema.RegEx.ZipCode,
    optional: true,
    max: 5
  },
  reference: {
    type: String,
    optional: true,
  }
});

ClientsSchema = new SimpleSchema({
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
    unique: true,
    autoform: {
      omit: true
    },
  },
  phone: {
    type: String,
    optional: true
  },
  address: {
    type: AddressSchema,
    optional: true,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
    autoform: {
      omit: true
    },
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
    optional: true
  },
  promoCodeId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
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
  completedProfile: {
    type: Boolean,
    defaultValue: false,
    autoform: {
      omit: true
    },
  },
  pendingPromos: {
    type: Number,
    defaultValue: 0,
    autoform: {
      omit: true
    },
  },
  rating: {
    type: Number,
    defaultValue: 0,
    autoform: {
      omit: true
    }
  },
});

Clients.before.insert((userId, doc) => {
  doc.promoCodeId = PromoCodes.insert({
    type: 'percentage',
    amount: 10,
    locationsId: []
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
