////////////////////
/// Login hookers
////////////////////

Accounts.onLogin(function() {
  FlowRouter.go('admin');
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

FlowRouter.route('/home/:scrollTo', {
    name: 'home-scroll',
    action() {
        BlazeLayout.render('LandingLayout', { main: 'Home' });
    }
});

FlowRouter.route('/terapeutas', {
    name: 'therapist-form',
    action() {
        BlazeLayout.render('LandingLayoutAlt', { main: 'TherapistsForm' });
    }
});

FlowRouter.route('/registroExitoso', {
    name: 'therapist-success',
    action() {
        BlazeLayout.render('LandingLayoutAlt', { main: 'TherapistsSuccess' });
    }
});

FlowRouter.route('/reserva', {
    name: 'book',
    action() {
        BlazeLayout.render('Book');
    }
});

////////////////////
/// Admin routes
////////////////////

FlowRouter.route('/admin', {
    name: 'admin',
    action() {
        if(Meteor.userId()) {
            FlowRouter.go('admin-pending-orders');
        }
        else {
            FlowRouter.go('signin');
        }
    }
});

FlowRouter.route('/admin/ciudades', {
    name: 'admin-locations',
    action() {
        BlazeLayout.render('MainLayout', { main: 'Locations' });
    }
});

FlowRouter.route('/admin/promo', {
    name: 'admin-promoCodes',
    action() {
        BlazeLayout.render('MainLayout', { main: 'PromoCodes' });
    }
});

FlowRouter.route('/admin/clientes', {
    name: 'admin-clients',
    action() {
        BlazeLayout.render('MainLayout', { main: 'Clients' });
    }
});

FlowRouter.route('/admin/admins', {
    name: 'admin-admins',
    action() {
        BlazeLayout.render('MainLayout', { main: 'Admins' });
    }
});

FlowRouter.route('/admin/acceso', {
    name: 'requestAccess',
    action() {
        BlazeLayout.render('MainLayout', { main: 'RequestAccess' });
    }
});

FlowRouter.route('/admin/terapeutas', {
    name: 'admin-therapists',
    action() {
        BlazeLayout.render('MainLayout', { main: 'AdminTherapists' });
    }
});

FlowRouter.route('/admin/solicitudes', {
    name: 'admin-therapists-requests',
    action() {
        BlazeLayout.render('MainLayout', { main: 'AdminTherapistsRequest' });
    }
});

FlowRouter.route('/admin/ordenes/pendientes', {
    name: 'admin-pending-orders',
    action() {
        BlazeLayout.render('MainLayout', { main: 'PendingOrders' });
    }
});

FlowRouter.route('/admin/ordenes/historial', {
    name: 'admin-history-orders',
    action() {
        BlazeLayout.render('MainLayout', { main: 'HistoricalOrders' });
    }
});

FlowRouter.route('/admin/ordenes/historial', {
    name: 'admin-history-orders',
    action() {
        BlazeLayout.render('MainLayout', { main: 'HistoricalOrders' });
    }
});

FlowRouter.route('/admin/ordenes/asignar', {
    name: 'admin-assign-therapists',
    action() {
        BlazeLayout.render('MainLayout', { main: 'AssignTherapists' });
    }
});
