TherapistSurveys = new Mongo.Collection('therapistSurveys');

TherapistSurveys.allow({
  insert: function (userId, doc) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  update: function (userId, doc) {
    return true;
  },
  remove: function (userId, doc) {
    // just admins can delete
    return Roles.userIsInRole(userId, ['admin']);
  }
});

TherapistSurveysSchema = new SimpleSchema({
  question1: {
    type: Number,
    optional: true,
  },
  question2: {
    type: Number,
    optional: true,
  },
  question3: {
    type: String,
    optional: true,
  },
  question4: {
    type: String,
    optional: true,
  },
  question5: {
    type: String,
    optional: true,
  },
  question6: {
    type: String,
    optional: true,
  },
  answered: {
    type: Boolean,
    defaultValue: false,
    autoform: {
      omit: true
    },
  },
});

// Add translations to labels
for (const prop in TherapistSurveysSchema._schema) {
  TherapistSurveysSchema._schema[prop].label = function () {
    return TAPi18n.__(`schemas.therapistSurveys.${prop}`, null);
  }
}

TherapistSurveys.attachSchema(TherapistSurveysSchema);
