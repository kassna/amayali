class LocationsCollection extends Mongo.Collection {
  remove(selector, callback) {
    Meteor.call('removeLocations', selector, err => {
      if (err) {
        Bert.alert( TAPi18n.__('admin.general.failDelete', null), 'danger', 'growl-top-right' );
        return false;
      }
      Bert.alert( TAPi18n.__('admin.general.successDelete', null), 'success', 'growl-top-right' );
      return super.remove(selector, callback);
    });
  }
}

Locations = new LocationsCollection('locations');

Locations.allow({
  insert: function(userId, doc) {
    // just admins can update
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

LocationsSchema = new SimpleSchema({
  name: {
    type: String,
    unique: true,
  },
  abbreviation: {
    type: String,
  },
  base_rate: {
    type: Number,
    min: 0
  },
  status: {
    type: Boolean,
    defaultValue: true,
    autoform: {
      omit: true
    },
  },
});

// Add translations to labels
for(const prop in LocationsSchema._schema) {
  LocationsSchema._schema[prop].label = function () {
    return TAPi18n.__(`schemas.locations.${prop}`, null);
  }
}

Locations.attachSchema(LocationsSchema);
