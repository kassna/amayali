class TherapistsCollection extends Mongo.Collection {
    insert(doc, callback) {
        doc.createdAt = new Date();

        Meteor.call('sendNewTherapist', doc);

        return super.insert(doc, callback);
    }

    remove(selector, callback) {
        Meteor.call('removeTherapists', selector, err => {
            if (err) {
                Meteor.isClient && Bert.alert(TAPi18n.__('admin.general.failDelete', null), 'danger', 'growl-top-right');
                return false;
            }
            Meteor.isClient && Bert.alert(TAPi18n.__('admin.general.successDelete', null), 'success', 'growl-top-right');
            return super.remove(selector, callback);
        });
    }
}

Therapists = new TherapistsCollection('therapists');

Therapists.allow({
    insert: function () {
        // everybody can register
        return true;
    },
    update: function (userId) {
        // just admins can update
        return Roles.userIsInRole(userId, ['admin']);
    },
    remove: function (userId) {
        // just admins can delete
        return Roles.userIsInRole(userId, ['admin']);
    }
});

/**
 * Static **mot** (means of transportation) options
 * in contrary of manually typed **mot** by user.
 *
 * @type {string[]}
 */
const motStaticOptions = ['car', 'taxi', 'uber'];

TherapistsSchema = new SimpleSchema({
    name: {
        type: String
    },
    birthday: {
        type: Date,
        autoform: {
            afFieldInput: {
                type: 'date'
            }
        }
    },
    sex: {
        type: String,
        autoform: {
            type: 'select-radio-inline',
            options() {
                return _.map(['male', 'female'], option => {
                    return {
                        value: option,
                        label: TAPi18n.__(`schemas.therapists.sexSelect.options.${option}`, null)
                    };
                });
            }
        }
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        unique: true
    },
    locationId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoform: {
            type: 'select-radio-inline',
            options() {
                return Locations.find().map(location => ({
                    label: location.name,
                    value: location._id
                }));
            }
        }
    },
    zip: {
        type: String,
        regEx: SimpleSchema.RegEx.ZipCode
    },
    training: {
        type: String
    },
    school: {
        type: String
    },
    experienceYears: {
        type: Number,
        min: 0
    },
    spaExperience: {
        type: String,
        autoform: {
            type: 'select-radio-inline',
            options() {
                return _.map(['yes', 'no'], option => {
                    return {
                        value: option,
                        label: TAPi18n.__(`schemas.general.${option}`, null)
                    };
                });
            }
        }
    },
    experienceTypes: {
        type: [String],
        autoform: {
            type: 'select-checkbox-inline',
            options() {
                return _.map(['a', 'b', 'c', 'd', 'e', 'f'], option => {
                    return {
                        value: option,
                        label: TAPi18n.__(`schemas.therapists.experienceTypesSelect.options.${option}`, null)
                    };
                });
            }
        }
    },
    mot: { // Means of transportation
        type: String,
        autoform: {
            type: 'select-radio-inline',
            options() {
                return _.map(motStaticOptions.concat(['other']), option => {
                    return {
                        value: option,
                        label: TAPi18n.__(`schemas.therapists.motTypesSelect.options.${option}`, null)
                    };
                });
            }
        }
    },
    hasBed: {
        type: String,
        autoform: {
            type: 'select-radio-inline',
            options() {
                return _.map(['yes', 'no'], option => {
                    return {
                        value: option,
                        label: TAPi18n.__(`schemas.general.${option}`, null)
                    };
                });
            }
        }
    },
    hasChair: {
        type: String,
        autoform: {
            type: 'select-radio-inline',
            options() {
                return _.map(['yes', 'no'], option => {
                    return {
                        value: option,
                        label: TAPi18n.__(`schemas.general.${option}`, null)
                    };
                });
            }
        }
    },
    schedulePreference: {
        type: [String],
        autoform: {
            type: 'select-checkbox',
            options() {
                return _.map(['allDay', 'afterOffice', 'morning', 'evening', 'night', 'rotative', 'weekends', 'other'], option => {
                    return {
                        value: option,
                        label: TAPi18n.__(`schemas.therapists.schedulePreferenceSelect.options.${option}`, null)
                    };
                });
            }
        }
    },
    reference: {
        type: String,
        autoform: {
            type: 'select-radio-inline',
            options() {
                return _.map(['public', 'fb', 'web', 'therapist', 'staff', 'event', 'other'], option => {
                    return {
                        value: option,
                        label: TAPi18n.__(`schemas.therapists.referenceSelect.options.${option}`, null)
                    };
                });
            }
        }
    },
    status: {
        type: Boolean,
        defaultValue: false,
        autoform: {
            omit: true
        }
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
        autoValue: function () {
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
        }
    }
});

// Add translations to labels
for (const prop in TherapistsSchema._schema) {
    if (TherapistsSchema._schema.hasOwnProperty(prop)) {
        TherapistsSchema._schema[prop].label = function () {
            return TAPi18n.__(`schemas.therapists.${prop}`, null);
        };
    }
}

Therapists.attachSchema(TherapistsSchema);

export {motStaticOptions};
