Locations = new Mongo.Collection('locations');

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
