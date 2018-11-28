import {Agents} from '../collections/agents';

/**
 * Creates a new user with role *role*.
 *
 * @param accountInfo - {@see Accounts.createUser}
 * @param role - The role of the user
 * @returns {any} - {@see Accounts.createUser}
 */
const addUser = (accountInfo, role) => {
    const userId = Accounts.createUser(accountInfo);

    Roles.setUserRoles(userId, role);

    return userId;
};

Meteor.methods({
    toggleStatusAgent: (id) => {
        const agent = Agents.findOne(id);
        const status = agent.status;
        const user = Accounts.findUserByEmail(agent.agent.email);

        if (!user) {
            const password = Random.secret(12);

            const userId = addUser({
                email: agent.agent.email,
                password: password
            }, 'agent');

            Agents.update({_id: id}, {$set: {userId}});

            Meteor.call('sendWelcomeAgent', agent, password);
        }

        Agents.update({_id: id}, {$set: {status: !status}});
    },

    // Locations
    toggleStatusLocation: id => {
        let status = Locations.findOne(id).status;
        if (status) {
            Locations.update({_id: id}, {$set: {status: false}});
        }
        else {
            Locations.update({_id: id}, {$set: {status: true}});
        }
    },

    removeLocations: selector => {
        const ids = Locations.find(selector).map(item => item._id);
        if (Orders.find({locationId: {$in: ids}}).count()) {
            throw new Meteor.Error('has-dependency', `Item can't be deleted because it has dependency`);
        }
        if (Clients.find({locationId: {$in: ids}}).count()) {
            throw new Meteor.Error('has-dependency', `Item can't be deleted because it has dependency`);
        }
        if (PromoCodes.find({locationsId: {$in: ids}}).count()) {
            throw new Meteor.Error('has-orders', `Item can't be deleted because it has dependency`);
        }
        if (Therapists.find({locationId: {$in: ids}}).count()) {
            throw new Meteor.Error('has-orders', `Item can't be deleted because it has dependency`);
        }
    },

    // PromoCodes
    removePromoCodes: selector => {
        const ids = PromoCodes.find(selector).map(item => item._id);
        if (Clients.find({promoCodeId: {$in: ids}}).count()) {
            throw new Meteor.Error('has-dependency', `Item can't be deleted because it has dependency`);
        }
    },

    toggleStatusPromoCode: id => {
        let status = PromoCodes.findOne(id).status;
        if (status) {
            PromoCodes.update({_id: id}, {$set: {status: false}});
        }
        else {
            PromoCodes.update({_id: id}, {$set: {status: true}});
        }
    },

    verifyPromoCode: (code, locationId) => {
        const promoCode = PromoCodes.findOne({code});
        if (promoCode) {
            const {_id, locationsId, type, amount, code, usage} = promoCode;

            // Verify if code isn't it's own code or if code is only for new clients
            const userId = Meteor.userId();
            const client = Clients.findOne({userId});
            // Had to do this trick, because it was passing if with client as undefined
            let clientPromoCode = null;
            if (client) clientPromoCode = client.promoCodeId;
            if (userId && clientPromoCode) {
                if (clientPromoCode === _id) return false;
                if (usage === 'new' && Meteor.call('clientOrders')) return false;
            }

            // User codes have locationsId: [], so verify if code is from other user
            if (!locationsId.length) {
                return {code, type, amount, reference: true};
            } else if (_.indexOf(locationsId, locationId) >= 0) {
                // If it's a valid location, also apply
                return {code, type, amount, reference: false};
            }
        }
        // If location is invalid or code incorrect, return false
        return false;
    },

    checkoutPromoCode: order => {
        const {promoCode} = order;
        if (promoCode) {
            const {_id: promoCodeId, usage} = PromoCodes.findOne({code: promoCode});
            // Verify if it's a reference code, to add pendingPromo to code owner
            const client = Clients.findOne({promoCodeId});
            if (client) {
                Clients.update({_id: client._id}, {$set: {pendingPromos: client.pendingPromos + 1}});
                return;
            }
            // Verify if code is a gift, so it's removed
            if (usage === 'gift') {
                PromoCodes.remove({_id: promoCodeId});
            }
        }
    },

    // Client
    removeClients: selector => {
        const ids = Clients.find(selector).map(item => item._id);
        if (Orders.find({clientId: {$in: ids}}).count()) {
            throw new Meteor.Error('client-has-orders', `Client can't be deleted because it has orders`);
        }
    },

    createClientFromSignUp: (userId, info) => {
        const {email} = info;
        const {firstname, lastname} = info.profile;
        Roles.setUserRoles(userId, 'client');
        const clientId = Clients.insert({email, firstname, lastname, userId});
        Meteor.call('sendWelcome', clientId);
    },

    getTherapistRating: therapist => {
        if (!therapist) return -1;
        // Get therapist orders with grade
        const orders = Orders.find({therapist, therapistGrade: {$exists: true}});
        // Count orders
        const count = orders.count();
        if (!count) return -1;
        // Get sum of reviews
        const total = orders.map(item => item.therapistGrade).reduce((total, num) => total + num);
        // Return average
        return total / count;
    },

    getClientRating: clientId => {
        if (!clientId) return -1;
        // Get client orders with grade
        const orders = Orders.find({clientId, clientGrade: {$exists: true}});
        // Count orders
        const count = orders.count();
        if (!count) return -1;
        // Get sum of reviews
        const total = orders.map(item => item.clientGrade).reduce((total, num) => total + num);
        // Return average
        return total / count;
    },

    // Admins
    toggleAdmin: id => {
        if (Roles.userIsInRole(id, 'admin')) {
            Roles.removeUsersFromRoles(id, 'admin');
            Roles.setUserRoles(id, 'admin-inactive');
        } else {
            Roles.setUserRoles(id, 'admin');
            Roles.removeUsersFromRoles(id, 'admin-inactive');
        }
    },
    requestAdmin: inputCode => {
        const {code} = Admins.findOne();
        const userId = Meteor.userId();
        if (inputCode === code) {
            // Verify if client has no orders, and remove promoCodes
            Clients.partialRemove({userId});
            Roles.removeUsersFromRoles(userId, 'client');
            Roles.setUserRoles(userId, 'admin');
        } else {
            throw new Meteor.Error('code-invalid');
        }
    },
    refreshAdminCode: () => {
        const {_id} = Admins.findOne();
        Admins.update({_id: _id}, {$set: {code: randomCode()}});
    },

    // Therapists
    removeTherapists: selector => {
        const ids = Therapists.find(selector).map(item => item._id);
        if (Orders.find({therapist: {$in: ids}}).count()) {
            throw new Meteor.Error('has-dependency', `Item can't be deleted because it has dependency`);
        }
    },

    toggleStatusTherapist: id => {
        let status = Therapists.findOne(id).status;
        if (status) {
            Therapists.update({_id: id}, {$set: {status: false}});
        }
        else {
            Therapists.update({_id: id}, {$set: {status: true}});
        }
    },

    // User
    clientOrders: () => {
        const clientId = Clients.findOne({userId: Meteor.userId()})._id;
        return Orders.find({clientId}).count();
    },

    verifyAvailableEmail: email => Accounts.findUserByEmail(email),

    // Orders
    getPaypalEnv: () => process.env.PAYPAL_ENV,

    createClientFromOrder: (accountDetails, order) => {
        try {
            const userId = addUser(accountDetails, 'client');

            const {firstname, lastname, email, phone, locationId, address} = order;
            const client = {
                firstname,
                lastname,
                email,
                phone,
                locationId,
                address,
                userId,
                completedProfile: true
            };
            return Clients.insert(client);
        } catch (ex) {
            throw new Meteor.Error('email-invalid');
        }
    },

    postPayment: (order, accountDetails) => {
        if (accountDetails) {
            order.clientId = Meteor.call('createClientFromOrder', accountDetails, order);
            Meteor.call('sendWelcome', order.clientId);
        }
        Meteor.call('checkoutPromoCode', order);
        return Orders.insert(order);
    },

    postPaymentClient: order => {
        Meteor.call('checkoutPromoCode', order);
        if (order.referencePromos) {
            Clients.update({_id: client._id}, {$set: {pendingPromos: 0}});
        }
        return Orders.insert(order);
    },

    'assignOrderTherapist': (orderId, therapist) => {
        if (Orders.findOne(orderId).locationId !== Therapists.findOne(therapist).locationId) {
            throw new Meteor.Error('different-location');
        }
        Orders.update({_id: orderId}, {$set: {therapist}});
    },

    'cancelOrder': _id => {
        const {firstname, lastname} = Meteor.user().profile;
        Orders.update(_id, {$set: {status: 'canceled', canceledBy: `${firstname} ${lastname}`}});
    },

    'updateOrderGrade': (_id, attribute, grade) => {
        if (attribute === 'therapistGrade') {
            Orders.update(_id, {$set: {therapistGrade: grade}});
        } else {
            Orders.update(_id, {$set: {clientGrade: grade}});
        }
    },

    // Survey
    'completeSurvey': (_id, survey) => {
        Surveys.update({_id}, {$set: survey});
    },

    // Therapist Survey
    'completeTherapistSurvey': (_id, survey) => {
        TherapistSurveys.update({_id}, {$set: survey});
    },

    // Mails
    'sendContactUs': (name, email, phone, message) => {
        Mailer.send({
            to: process.env.ADMIN_EMAIL,
            // from: name + '<'+ email + '>',
            subject: '[Kassna] Contacto página web',
            template: 'contactUs',
            data: {
                name,
                email,
                phone,
                message
            }
        });
    },

    'sendNewOrder': order => {
        // Send email to user
        Mailer.send({
            to: order.email,
            subject: `[Kassna] Confirmación de orden`,
            template: 'orderConfirmation',
            data: order
        });

        // Send email to admin
        order.location = Locations.findOne(order.locationId).name;

        Mailer.send({
            to: process.env.ORDER_EMAIL,
            subject: `[Kassna] Nueva orden en ${order.location}`,
            template: 'newOrder',
            data: order
        });
    },

    'sendWelcome': clientId => {
        const client = Clients.findOne(clientId);
        Mailer.send({
            to: client.email,
            subject: `[Kassna] Bienvenido! ${client.firstname}`,
            template: 'welcomeUser',
            data: client
        });
    },

    'sendWelcomeAgent': (agent, password) => {
        const fullname = agent.agent.fullname;
        Mailer.send({
            to: agent.agent.email,
            subject: `s[Kassna] Bienvenido ${fullname}!`,
            template: 'welcomeAgent',
            data: {fullname, password}
        });
    },

    'sendSurvey': orderId => {
        const {firstname, survey, email} = Orders.findOne(orderId);
        Mailer.send({
            to: email,
            subject: `[Kassna] Orden completada!`,
            template: 'survey',
            data: {firstname, survey}
        });
    },

    'sendReminder1': email => {
        Mailer.send({
            to: email,
            subject: `[Kassna] Tu cita en una hora`,
            template: 'reminder'
        });
    },

    'sendReminder4': email => {
        Mailer.send({
            to: email,
            subject: `[Kassna] Tu cita en cuatro horas`,
            template: 'reminder1'
        });
    },

    'sendNewTherapist': id => {
        const therapist = Therapists.findOne({_id: id});

        // Send email to user
        Mailer.send({
            to: therapist.email,
            subject: `[Kassna] Confirmación de solicitud`,
            template: 'applicationWait',
            data: therapist
        });

        Mailer.send({
            to: process.env.ADMIN_EMAIL,
            subject: `[Kassna] Nueva solicitud de terapeuta`,
            template: 'newApplication',
            data: therapist
        });
    },

    'sendNewAgent': id => {
        const agent = Agents.findOne({_id: id});

        // Send email to user
        Mailer.send({
            to: agent.email,
            subject: `[Kassna] Confirmación de solicitud`,
            template: 'applicationWait',
            data: agent
        });

        Mailer.send({
            to: process.env.ADMIN_EMAIL,
            subject: `[Kassna] Nueva solicitud de terapeuta`,
            template: 'newApplication',
            data: agent
        });
    }
});
