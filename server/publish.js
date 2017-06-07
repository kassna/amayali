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
