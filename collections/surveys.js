Surveys = new Mongo.Collection('surveys');

Surveys.allow({
  insert: function(userId, doc) {
    // just admins can update
    return false;
  },
  update: function(userId, doc) {
    // just admins can update
    return true;
  },
  remove: function (userId, doc) {
    // just admins can delete
    return Roles.userIsInRole(userId, ['admin']);
  }
});

SurveysSchema = new SimpleSchema({
  question1: {
    type: String,
    optional: true,
  },
  question2: {
    type: String,
    optional: true,
  },
  question3: {
    type: String,
    optional: true,
  },
  comments: {
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
for(const prop in SurveysSchema._schema) {
  SurveysSchema._schema[prop].label = function () {
    return TAPi18n.__(`schemas.surveys.${prop}`, null);
  }
}

Surveys.attachSchema(SurveysSchema);
