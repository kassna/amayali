_ = lodash;

////////////////////////
///  Locations
////////////////////////
Meteor.publish('locations', function () {
    return Locations.find();
});

Meteor.publish('activeLocations', function () {
    return Locations.find({status: true});
});

////////////////////////
///  PromoCodes
////////////////////////
Meteor.publish('promoCodes', function () {
    let excludeArr = [];
    Clients.find().map(item => excludeArr.push(item.promoCodeId));
    return PromoCodes.find({ _id: { $nin: excludeArr }});
});

Meteor.publish('activePromoCodes', function () {
    let excludeArr = [];
    Clients.find().map(item => excludeArr.push(item.promoCodeId));
    return PromoCodes.find({ $and: [{ status: true }, { _id: { $nin: excludeArr }}]});
});
