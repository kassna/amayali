////////////////////
/// Login hookers
////////////////////

Accounts.onLogin(function() {
});

Accounts.onLogout(function() {
    FlowRouter.go('login');
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

FlowRouter.route('/login', {
    name: 'login',
    action() {
        if(Meteor.userId()) {

        }
        else {
            BlazeLayout.render('MainLayout', { main: 'Login' });
        }
    }
});

////////////////////
/// Admin routes
////////////////////

FlowRouter.route('/admin', {
    name: 'admin',
    action() {
        FlowRouter.go('login');
    }
});
