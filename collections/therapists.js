class TherapistsCollection extends Mongo.Collection {
  // TODO: Can't remove if has orders
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
  birthday: {
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
  languages: {
    type: String,
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
  zone: {
    type: String
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
  zip: {
    type: String,
    regEx: SimpleSchema.RegEx.ZipCode,
  },
  training: {
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
  experienceYears: {
    type: Number,
    min: 0
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
  herbs: {
    type: String,
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
  phone: {
    type: String,
  },
  contactTime: {
    type: String,
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    unique: true,
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
  status: {
    type: Boolean,
    defaultValue: true,
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
});

// Add translations to labels
for(const prop in TherapistsSchema._schema) {
  TherapistsSchema._schema[prop].label = function () {
    return TAPi18n.__(`schemas.therapists.${prop}`, null);
  }
}

Therapists.attachSchema(TherapistsSchema);
