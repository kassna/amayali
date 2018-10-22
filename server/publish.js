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
    const excludeArr = Clients.find().map(item => item.promoCodeId);

    if (location) {
      return PromoCodes.find({ _id: { $nin: excludeArr }, locationsId: location });
    } else {
      return PromoCodes.find({ _id: { $nin: excludeArr }});
    }

});

Meteor.publish('activePromoCodes', location => {
    const excludeArr = Clients.find().map(item => item.promoCodeId);

    if (location) {
      return PromoCodes.find({ status: true, _id: { $nin: excludeArr }, locationsId: location });
    } else {
      return PromoCodes.find({ status: true, _id: { $nin: excludeArr }});
    }
});

Meteor.publish('clientPromoCode', function () {
  const { promoCodeId } = Clients.findOne({ userId: this.userId });
  return PromoCodes.find(promoCodeId);
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

Meteor.publish('clientFromUser', function () {
  return Clients.find({ userId: this.userId });
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
    const includeArr = Orders.find().map(item => item.therapist);
    if (location) {
      return Therapists.find({ $and: [{ $or: [{ status: true }, { _id: { $in: includeArr }}]}, { locationId: location }]});
    } else {
      return Therapists.find({ $or: [{ status: true }, { _id: { $in: includeArr }}]});
    }
});

Meteor.publish('therapistPendingOrders', location => {
  const includeArr = Orders.find({ status: 'confirmed' }).map(item => item.therapist);
  if (location) {
    return Therapists.find({ _id: { $in: includeArr }, locationId: location });
  } else {
    return Therapists.find({ _id: { $in: includeArr }});
  }
});

Meteor.publish('therapistPendingOrdersClient', function () {
  const clientId = Clients.findOne({ userId: this.userId })._id;
  const includeArr = Orders.find({ status: 'confirmed', clientId }).map(item => item.therapist);

  return Therapists.find({ _id: { $in: includeArr }});
});

Meteor.publish('therapistHistoricalOrders', location => {
  const includeArr = Orders.find({ status: { $in: ['completed', 'canceled']}}).map(item => item.therapist);
  if (location) {
    return Therapists.find({ _id: { $in: includeArr }, locationId: location });
  } else {
    return Therapists.find({ _id: { $in: includeArr }});
  }
});

Meteor.publish('therapistHistoricalOrdersClient', function () {
  const clientId = Clients.findOne({ userId: this.userId })._id;
  const includeArr = Orders.find({ status: { $in: ['completed', 'canceled'] }, clientId }).map(item => item.therapist);

  return Therapists.find({ _id: { $in: includeArr }});
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

Meteor.publish('order', _id => Orders.find({ _id }));

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

Meteor.publish('historicalOrdersClient', function () {
    const clientId = Clients.findOne({ userId: this.userId })._id;
    return Orders.find({ status: { $in: ['completed', 'canceled']}, clientId });
});

Meteor.publish('noTherapistOrders', location => {
    if (location) {
      return Orders.find({ locationId: location, therapist: { $exists: false }, status: { $nin: ['canceled'] }});
    } else {
      return Orders.find({ therapist: { $exists: false }, status: { $nin: ['canceled'] }});
    }
});

Meteor.publish('clientOrders', location => {
    const includeArr = Clients.find().map(item => item._id);
    if (location) {
      return Orders.find({ locationId: location, clientId: { $in: includeArr }});
    } else {
      return Orders.find({ clientId: { $in: includeArr } });
    }
});

////////////////////////
///  Surveys
////////////////////////

Meteor.publish('completedOrdersSurveysClient', function () {
    const clientId = Clients.findOne({ userId: this.userId })._id;
    const includeArr = Orders.find({ status: 'completed', clientId }).map(item => item.survey);
    return Surveys.find({ _id: { $in: includeArr }});
});

Meteor.publish('completedOrdersSurveys', location => {
  const includeArr = Orders.find({ status: 'completed' }).map(item => item.survey);
  if (location) {
    Orders.find({ status: 'completed', locationId: location }).map(item => includeArr.push(item.survey));
  } else {
    Orders.find({ status: 'completed' }).map(item => includeArr.push(item.survey));
  }
  return Surveys.find({ _id: { $in: includeArr }});
});

Meteor.publish('survey', _id => Surveys.find({ _id }));

////////////////////////
///  Therapist Surveys
////////////////////////

Meteor.publish('completedOrdersTherapistSurveysClient', function () {
  const clientId = Clients.findOne({ userId: this.userId })._id;
  const includeArr = Orders.find({ status: 'completed', clientId }).map(item => item.therapistSurvey);
  return TherapistSurveys.find({ _id: { $in: includeArr } });
});

Meteor.publish('completedOrdersTherapistSurveys', location => {
  const includeArr = Orders.find({ status: 'completed' }).map(item => item.therapistSurvey);
  if (location) {
    Orders.find({ status: 'completed', locationId: location }).map(item => includeArr.push(item.therapistSurvey));
  } else {
    Orders.find({ status: 'completed' }).map(item => includeArr.push(item.therapistSurvey));
  }
  return TherapistSurveys.find({ _id: { $in: includeArr } });
});

Meteor.publish('therapistSurvey', _id => TherapistSurveys.find({ _id }));
