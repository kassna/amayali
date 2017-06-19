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
      return PromoCodes.find({ _id: { $nin: excludeArr }, locationsId: location });
    } else {
      return PromoCodes.find({ _id: { $nin: excludeArr }});
    }

});

Meteor.publish('activePromoCodes', location => {
    let excludeArr = [];
    Clients.find().map(item => excludeArr.push(item.promoCodeId));

    if (location) {
      return PromoCodes.find({ status: true, _id: { $nin: excludeArr }, locationsId: location });
    } else {
      return PromoCodes.find({ status: true, _id: { $nin: excludeArr }});
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
      return Therapists.find({ status: true, locationId: location });
    } else {
      return Therapists.find({ status: true });
    }
});

Meteor.publish('inactiveTherapists', location => {
    if (location) {
      return Therapists.find({ status: false, locationId: location });
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

Meteor.publish('therapistPendingOrders', location => {
  let includeArr = [];
  Orders.find({ status: 'confirmed' }).map(item => includeArr.push(item.therapist));
  if (location) {
    return Therapists.find({ _id: { $in: includeArr }, locationId: location });
  } else {
    return Therapists.find({ _id: { $in: includeArr }});
  }
});

Meteor.publish('therapistPendingOrdersClient', function () {
  const clientId = Clients.findOne({ userId: this.userId })._id;
  let includeArr = [];
  Orders.find({ status: 'confirmed', clientId }).map(item => includeArr.push(item.therapist));

  return Therapists.find({ _id: { $in: includeArr }});
});

Meteor.publish('therapistHistoricalOrders', location => {
  let includeArr = [];
  Orders.find({ status: { $in: ['completed', 'canceled']}}).map(item => includeArr.push(item.therapist));
  if (location) {
    return Therapists.find({ _id: { $in: includeArr }, locationId: location });
  } else {
    return Therapists.find({ _id: { $in: includeArr }});
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

Meteor.publish('pendingOrders', location => {
    if (location) {
      return Orders.find({ locationId: location, status: 'confirmed' });
    } else {
      return Orders.find({ status: 'confirmed' });
    }
});

Meteor.publish('pendingOrdersClient', function () {
    const clientId = Clients.findOne({ userId: this.userId })._id;
    return Orders.find({ status: 'confirmed', clientId });
});

Meteor.publish('historicalOrders', location => {
    if (location) {
      return Orders.find({ locationId: location, status: { $in: ['completed', 'canceled']}});
    } else {
      return Orders.find({ status: { $in: ['completed', 'canceled']}});
    }
});

Meteor.publish('noTherapistOrders', location => {
    if (location) {
      return Orders.find({ locationId: location, therapist: { $exists: false }});
    } else {
      return Orders.find({ therapist: { $exists: false }});
    }
});

Meteor.publish('clientOrders', location => {
    let includeArr = [];
    Clients.find().map(item => includeArr.push(item._id));
    if (location) {
      return Orders.find({ locationId: location, clientId: { $in: includeArr }});
    } else {
      return Orders.find({ clientId: { $in: includeArr } });
    }
});
