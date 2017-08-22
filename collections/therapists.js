class TherapistsCollection extends Mongo.Collection {
  remove(selector, callback) {
    Meteor.call('removeTherapists', selector, err => {
      if (err) {
        Bert.alert( TAPi18n.__('admin.general.failDelete', null), 'danger', 'growl-top-right' );
        return false;
      }
      Bert.alert( TAPi18n.__('admin.general.successDelete', null), 'success', 'growl-top-right' );
      return super.remove(selector, callback);
    });
  }
}

Therapists = new TherapistsCollection('therapists');

Therapists.allow({
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

TherapistsSchema = new SimpleSchema({
  name: {
    type: String
  },
  training: {
    type: String,
  },
  sex: {
    type: String,
    autoform: {
      type: 'select-radio-inline',
      options () {
        return _.map(['male', 'female'], option => {
          return {
            value: option,
            label: TAPi18n.__(`schemas.therapists.sexSelect.options.${option}`, null),
          }
        });
      }
    },
  },
  experienceYears: {
    type: Number,
    min: 0
  },
  phone: {
    type: String,
  },
  experienceTypes: {
    type: [String],
    autoform: {
      type: 'select-checkbox-inline',
      options () {
        return _.map(['a' ,'b' ,'c' ,'d' ,'e' ,'f' ,'g' ,'h' ,'i' ,'j' ,'k' ,'l' ,'m' ,'n' ,'o' ,'p'], option => {
          return {
            value: option,
            label: TAPi18n.__(`schemas.therapists.experienceTypesSelect.options.${option}`, null),
          }
        });
      }
    },
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    unique: true,
  },
  hasBed: {
    type: String,
    autoform: {
      type: 'select-radio-inline',
      options () {
        return _.map(['yes', 'no'], option => {
          return {
            value: option,
            label: TAPi18n.__(`schemas.general.${option}`, null),
          }
        });
      }
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
  },
  hasChair: {
    type: String,
    autoform: {
      type: 'select-radio-inline',
      options () {
        return _.map(['yes', 'no'], option => {
          return {
            value: option,
            label: TAPi18n.__(`schemas.general.${option}`, null),
          }
        });
      }
    },
  },
  zip: {
    type: String,
    regEx: SimpleSchema.RegEx.ZipCode,
  },
  herbs: {
    type: String,
  },
  zone: {
    type: String
  },
  hasCar: {
    type: String,
    autoform: {
      type: 'select-radio-inline',
      options () {
        return _.map(['yes', 'no'], option => {
          return {
            value: option,
            label: TAPi18n.__(`schemas.general.${option}`, null),
          }
        });
      }
    },
  },
  schedulePreference: {
    type: [String],
    autoform: {
      type: 'select-checkbox',
      options () {
        return _.map(['morning', 'evening', 'night', 'all'], option => {
          return {
            value: option,
            label: TAPi18n.__(`schemas.therapists.schedulePreferenceSelect.options.${option}`, null),
          }
        });
      }
    },
  },
  contactTime: {
    type: String,
  },
  smartphone: {
    type: String,
    autoform: {
      type: 'select-radio-inline',
      options () {
        return _.map(['yes', 'no'], option => {
          return {
            value: option,
            label: TAPi18n.__(`schemas.general.${option}`, null),
          }
        });
      }
    },
  },
  reference: {
    type: String,
    autoform: {
      type: 'select-radio-inline',
      options () {
        return _.map(['fb', 'web', 'therapist', 'staff', 'other'], option => {
          return {
            value: option,
            label: TAPi18n.__(`schemas.therapists.referenceSelect.options.${option}`, null),
          }
        });
      }
    },
  },
  birthday: {
    type: String,
  },
  languages: {
    type: String,
  },
  jobStatus: {
    type: String,
  },
  experience: {
    type: [String],
    autoform: {
      type: 'select-checkbox-inline',
      options () {
        return _.map(['hospital', 'rehab', 'hotel', 'gym', 'spa', 'private', 'onDemand', 'school', 'other'], option => {
          return {
            value: option,
            label: TAPi18n.__(`schemas.therapists.experienceSelect.options.${option}`, null),
          }
        });
      }
    },
  },
  status: {
    type: Boolean,
    defaultValue: false,
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
});

// Add translations to labels
for(const prop in TherapistsSchema._schema) {
  TherapistsSchema._schema[prop].label = function () {
    return TAPi18n.__(`schemas.therapists.${prop}`, null);
  }
}

Therapists.attachSchema(TherapistsSchema);
