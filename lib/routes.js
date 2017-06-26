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

FlowRouter.route('/reservacionExitosa/:id', {
    name: 'book-success',
    action() {
        BlazeLayout.render('LandingLayoutAlt', { main: 'OrderConfirmation' });
    }
});

FlowRouter.route('/faq', {
    name: 'faq',
    action() {
        BlazeLayout.render('LandingLayoutAlt', { main: 'FAQ' });
    }
});

FlowRouter.route('/privacidad', {
    name: 'privacy',
    action() {
        BlazeLayout.render('LandingLayoutAlt', { main: 'Privacy' });
    }
});

FlowRouter.route('/terminosycondiciones', {
    name: 'terms',
    action() {
        BlazeLayout.render('LandingLayoutAlt', { main: 'Terms' });
    }
});

////////////////////
/// Admin routes
////////////////////

FlowRouter.route('/admin', {
    name: 'admin',
    action() {
        const userId = Meteor.userId();
        if(userId) {
            if (Roles.userIsInRole(userId, 'admin')) {
                FlowRouter.go('admin-pending-orders');
            } else if (Roles.userIsInRole(userId, 'client')) {
                FlowRouter.go('client-book-now');
            }
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

////////////////////
/// Client routes
////////////////////

FlowRouter.route('/cliente/ordenar', {
    name: 'client-book-now',
    action() {
        BlazeLayout.render('MainLayout', { main: 'BookNowClient' });
    }
});

FlowRouter.route('/cliente/ordenes/pendientes', {
    name: 'client-pending-orders',
    action() {
        BlazeLayout.render('MainLayout', { main: 'PendingOrdersClient' });
    }
});

FlowRouter.route('/cliente/ordenes/historial', {
    name: 'client-history-orders',
    action() {
        BlazeLayout.render('MainLayout', { main: 'HistoricalOrdersClient' });
    }
});

FlowRouter.route('/cliente/codigoPromocional', {
    name: 'client-promoCode',
    action() {
        BlazeLayout.render('MainLayout', { main: 'PromoCodeClient' });
    }
});

FlowRouter.route('/encuesta/:id', {
    name: 'survey',
    action() {
        BlazeLayout.render('MainLayout', { main: 'PromoCodeClient' });
    }
});
