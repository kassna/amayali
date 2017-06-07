////////////////////
/// Login hookers
////////////////////

Accounts.onLogin(function() {
  FlowRouter.go('locations');
});

Accounts.onLogout(function() {
    FlowRouter.go('signin');
});

////////////////////
/// Public routes
////////////////////

FlowRouter.route('/', {
    name: 'home',
    action() {
        BlazeLayout.render('LandingLayout', { main: 'Home' });
    }
});

// FlowRouter.route('/login', {
//     name: 'signin',
//     action() {
//         if(Meteor.userId()) {
//             FlowRouter.go('locations');
//         }
//         else {
//             BlazeLayout.render('MainLayout', { main: 'Login' });
//         }
//     }
// });

////////////////////
/// Admin routes
////////////////////

FlowRouter.route('/admin', {
    name: 'admin',
    action() {
        FlowRouter.go('signin');
    }
});

FlowRouter.route('/admin/ciudades', {
    name: 'locations',
    action() {
        BlazeLayout.render('MainLayout', { main: 'Locations' });
    }
});
