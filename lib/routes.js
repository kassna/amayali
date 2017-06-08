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

FlowRouter.route('/terapeutas', {
    name: 'therapists-form',
    action() {
        BlazeLayout.render('LandingLayoutAlt', { main: 'TherapistsForm' });
    }
});

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

FlowRouter.route('/admin/promo', {
    name: 'promoCodes',
    action() {
        BlazeLayout.render('MainLayout', { main: 'PromoCodes' });
    }
});
