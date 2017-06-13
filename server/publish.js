_ = lodash;

////////////////////////
///  Locations
////////////////////////
Meteor.publish('locations', () => Locations.find());

Meteor.publish('activeLocations', () => Locations.find({status: true}));

////////////////////////
///  PromoCodes
////////////////////////
Meteor.publish('promoCodes', location => {
    let excludeArr = [];
    Clients.find().map(item => excludeArr.push(item.promoCodeId));

    if (location) {
      return PromoCodes.find({ $and: [{ _id: { $nin: excludeArr }}, { locationsId: location }] });
    } else {
      return PromoCodes.find({ _id: { $nin: excludeArr }});
    }

});

Meteor.publish('activePromoCodes', location => {
    let excludeArr = [];
    Clients.find().map(item => excludeArr.push(item.promoCodeId));

    if (location) {
      return PromoCodes.find({ $and: [{ status: true }, { _id: { $nin: excludeArr }}, { locationsId: location }] });
    } else {
      return PromoCodes.find({ $and: [{ status: true }, { _id: { $nin: excludeArr }}]});
    }
});

////////////////////////
///  Admins
////////////////////////
Meteor.publish('admins', () => Meteor.users.find({ roles: { $in: ['admin', 'admin-inactive'] }}));
Meteor.publish('adminCode', () => Admins.find());

////////////////////////
///  Clients
////////////////////////
Meteor.publish('clients', location => {
    if (location) {
      return Clients.find({ locationId: location });
    } else {
      return Clients.find();
    }
});

////////////////////////
///  Therapists
////////////////////////
Meteor.publish('therapists', location => {
    if (location) {
      return Therapists.find({ locationId: location });
    } else {
      return Therapists.find();
    }
});

Meteor.publish('activeTherapists', location => {
    if (location) {
      return Therapists.find({ $and: [{ status: true }, { locationId: location }] });
    } else {
      return Therapists.find({ status: true });
    }
});

Meteor.publish('inactiveTherapists', location => {
    if (location) {
      return Therapists.find({ $and: [{ status: false }, { locationId: location }] });
    } else {
      return Therapists.find({ status: false });
    }
});

Meteor.publish('currentTherapists', location => {
    let includeArr = [];
    Orders.find().map(item => includeArr.push(item.therapist));
    if (location) {
      return Therapists.find({ $and: [{ $or: [{ status: true }, { _id: { $in: includeArr }}]}, { locationId: location }]});
    } else {
      return Therapists.find({ $or: [{ status: true }, { _id: { $in: includeArr }}]});
    }
});

////////////////////////
///  Orders
////////////////////////
Meteor.publish('orders', location => {
    if (location) {
      return Orders.find({ locationId: location });
    } else {
      return Orders.find();
    }
});
