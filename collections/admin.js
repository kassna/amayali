Admins = new Mongo.Collection('admins');

Admins.allow({
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc) {
    // just admins can update
    return false;
  },
  remove: function (userId, doc) {
    return false;
  }
});

AdminsSchema = new SimpleSchema({
  code: {
    type: String,
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
  },
});

Admins.attachSchema(AdminsSchema);
