/*
  Generate a random code of 3 capital letters and 3 numbers in random order
 */
randomCode = function randomCode() {
  let codeArray = _.times(3, () => String.fromCharCode(_.random(48, 57)));
  codeArray = _.concat(codeArray, _.times(3, () => String.fromCharCode(_.random(65, 90))));
  codeArray = _.shuffle(codeArray);
  return codeArray.join('');
};

class PromoCodesCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    if (!doc.code) {
      let promoCode;
      // Get a valid promo code, verifying with db
      do {
        promoCode = randomCode();
      } while (this.findOne({ code: promoCode }));
      ourDoc.code = promoCode;
    }
    return super.insert(ourDoc, callback);
  }

  remove(selector, callback) {
    Meteor.call('removePromoCodes', selector, err => {
      if (err) {
        Meteor.isClient && Bert.alert( TAPi18n.__('admin.general.failDelete', null), 'danger', 'growl-top-right' );
        return false;
      }
      Meteor.isClient && Bert.alert( TAPi18n.__('admin.general.successDelete', null), 'success', 'growl-top-right' );
      return super.remove(selector, callback);
    });
  }
}

PromoCodes = new PromoCodesCollection('promoCodes');

PromoCodes.allow({
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

PromoCodesSchema = new SimpleSchema({
  code: {
    type: String,
    unique: true,
  },
  type: {
    type: String,
    autoform: {
      type: 'select-radio-inline',
      options () {
        return [
          {value: "amount", label: TAPi18n.__(`schemas.promoCodes.typeSelect.options.amount`, null)},
          {value: "percentage", label: TAPi18n.__(`schemas.promoCodes.typeSelect.options.percentage`, null)}
        ]
      }
    },
  },
  usage: {
    type: String,
    defaultValue: 'regular',
    autoform: {
      type: 'select-radio-inline',
      options() {
        return [
          { value: "regular", label: TAPi18n.__(`schemas.promoCodes.usageSelect.options.regular`, null) },
          { value: "gift", label: TAPi18n.__(`schemas.promoCodes.usageSelect.options.gift`, null) },
          { value: "new", label: TAPi18n.__(`schemas.promoCodes.usageSelect.options.new`, null) }
        ]
      }
    },
  },
  amount: {
    type: Number,
    decimal: true,
  },
  locationsId: {
    type: [String],
    autoform: {
      type: 'select-checkbox',
      options() {
        return Locations.find().map(location => ({ label: location.name, value: location._id }));
      },
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
for(const prop in PromoCodesSchema._schema) {
  PromoCodesSchema._schema[prop].label = function () {
    return TAPi18n.__(`schemas.promoCodes.${prop}`, null);
  }
}

PromoCodes.attachSchema(PromoCodesSchema);
