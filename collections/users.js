Meteor.users.allow({ remove: (userId) => Roles.userIsInRole(userId, ['admin']) });
