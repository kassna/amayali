class TerapistsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.createdAt = new Date();
    return super.insert(ourDoc, callback);
  }
  // TODO: Can't remove if has orders
}

Terapists = new TerapistsCollection('terapists');

Terapists.allow({
  insert: function(userId, doc) {
    // everybody can register
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

TerapistsSchema = new SimpleSchema({
  name: {
    type: String
  },
  sex: {
    type: String
  },
  status: {
    type: Boolean,
    defaultValue: true,
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
});

// Add translations to labels
for(const prop in TerapistsSchema._schema) {
  TerapistsSchema._schema[prop].label = function () {
    return TAPi18n.__(`schemas.terapists.${prop}`, null);
  }
}

Terapists.attachSchema(TerapistsSchema);
