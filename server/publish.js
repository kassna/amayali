_ = lodash;

////////////////////////
///  Locations
////////////////////////
Meteor.publish('locations', () => Locations.find());

Meteor.publish('activeLocations', () => Locations.find({status: true}));

////////////////////////
///  PromoCodes
////////////////////////
Meteor.publish('promoCodes', (location) => {
    let excludeArr = [];
    Clients.find().map(item => excludeArr.push(item.promoCodeId));

    if (location) {
      return PromoCodes.find({ $and: [{ _id: { $nin: excludeArr }}, { locationsId: location }] });
    } else {
      return PromoCodes.find({ _id: { $nin: excludeArr }});
    }

});

Meteor.publish('activePromoCodes', (location) => {
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
Meteor.publish('admins', () => Meteor.users.find({ roles: 'admin' }));
