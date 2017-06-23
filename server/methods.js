Meteor.methods({
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

	// PromoCodes
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
		const promoCode = PromoCodes.findOne({ code });
		if (promoCode) {
			const { locationsId, type, amount, code } = promoCode
			// User codes have locationsId: [], so verify if code is from other user
			if(!locationsId.length) {
				return { code, type, amount, reference: true };
			} else if(_.indexOf(locationsId, locationId) >= 0) {
				// If it's a valid location, also apply
				return { code, type, amount, reference: false };
			}
		}
		// If location is invalid or code incorrect, return false
		return false;
	},

	addClientPromo: order => {
		const { promoCode } = order;
		if (promoCode) {
			const promoCodeId = PromoCodes.findOne({ code: promoCode })._id;
			const client = Clients.findOne({ promoCodeId });
			if (client) {
				Clients.update({ _id: client._id }, { $set: { pendingPromos: client.pendingPromos + 1 }});
			}
		}
	},

	// Client
	createClientFromSignUp: (userId, info) => {
		const { email } = info;
		const { firstname, lastname } = info.profile;
		Roles.setUserRoles(userId, 'client');
		const clientId = Clients.insert({ email, firstname, lastname, userId });
		Meteor.call('sendWelcome', clientId);
	},

	// Admins
	toggleAdmin: id => {
		if(Roles.userIsInRole(id, 'admin')) {
			Roles.removeUsersFromRoles(id, 'admin');
			Roles.setUserRoles(id, 'admin-inactive');
		} else {
			Roles.setUserRoles(id, 'admin');
			Roles.removeUsersFromRoles(id, 'admin-inactive');
		}
	},
	requestAdmin: inputCode => {
		const { code } = Admins.findOne();
		const userId = Meteor.userId();
		if(inputCode === code) {
			// Verify if client has no orders, and remove promoCodes
			Clients.partialRemove({ userId });
			Roles.removeUsersFromRoles(userId, 'client');
			Roles.setUserRoles(userId, 'admin');
		} else {
			throw new Meteor.Error("code-invalid");
		}
	},
	refreshAdminCode: () => {
		const { _id } = Admins.findOne();
		Admins.update({ _id: _id }, { $set: { code: randomCode() }});
	},

	// Therapists
	toggleStatusTherapist: id => {
		let status = Therapists.findOne(id).status;
		if (status) {
			Therapists.update({_id: id}, {$set: {status: false}});
		}
		else {
			Therapists.update({_id: id}, {$set: {status: true}});
		}
	},

	sendContactUs: (name, email, question) => {
	    Mailer.send({
	        to: process.env.ADMIN_EMAIL,
	        from: name + '<'+ email + '>',
	        subject: '[FiestON] Contacto página web',
	        template: 'contactUs',
	        data: {
	            name: name,
			email: email,
			question: question
	        }
	    });
	},

	// User
	verifyAvailableEmail: email => Accounts.findUserByEmail(email),

	// Orders
	createClientFromOrder: (accountDetails, order) => {
		try {
			const userId = Accounts.createUser(accountDetails);
			Roles.setUserRoles(userId, 'client');
			const { firstname, lastname, email, phone, locationId, address } = order;
			const client = { firstname, lastname, email, phone, locationId, address, userId, completedProfile: true };
			return clientId = Clients.insert(client);
		} catch (ex) {
			throw new Meteor.Error("email-invalid");
		}
	},

	paypalPostPay: (order, accountDetails) => {
		if(accountDetails) {
			order.clientId = Meteor.call('createClientFromOrder', accountDetails, order);
			Meteor.call('addClientPromo', order);
			Meteor.call('sendWelcome', order.clientId);
		}
		Meteor.call('sendNewOrder', order);
		return Orders.insert(order);
	},

	paypalPostPayClient: order => {
		const client = Clients.findOne(order.clientId);
		const { firstname, lastname, email, phone, address } = client;
		if (order.referencePromos) {
			Clients.update({ _id: client._id }, { $set: { pendingPromos: 0 }});
		}
		Meteor.call('sendNewOrder', order);
		return Orders.insert(_.merge(order, { firstname, lastname, email, phone, address }));
	},

	'assignOrderTherapist': (orderId, therapist) => {
		if(Orders.findOne(orderId).locationId != Therapists.findOne(therapist).locationId) {
			throw new Meteor.Error("different-location");
		}
		Orders.update({ _id: orderId }, { $set: { therapist }});
	},

	'cancelOrder': _id => Orders.update(_id, { $set: { status: 'canceled' } }),

	'updateOrderGrade': (_id, attribute, grade) => {
		if (attribute === 'therapistGrade') {
			Orders.update(_id, { $set: { therapistGrade: grade } })
		} else {
			Orders.update(_id, { $set: { clientGrade: grade } })
		}
	},

	// Mails
	'sendContactUs': (name, email, phone, message) => {
		Mailer.send({
      to: process.env.ADMIN_EMAIL,
      // from: name + '<'+ email + '>',
      subject: '[Amayali] Contacto página web',
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
		const { clientId } = order;
		// Send email to user
		Mailer.send({
			to: order.email,
			subject: `[Amayali] Confirmación de orden`,
			template: 'orderConfirmation',
			data: order
		});

		// Send email to admin
		order.location = Locations.findOne(order.locationId).name;

		Mailer.send({
			to: process.env.ADMIN_EMAIL,
			subject: `[Amayali] Nueva orden en ${order.location}`,
			template: 'newOrder',
			data: order
		});
	},

	'sendWelcome': clientId => {
		const client = Clients.findOne(clientId);
		Mailer.send({
			to: client.email,
			subject: `[Amayali] Bienvenido! ${client.firstname}`,
			template: 'welcomeUser',
			data: client
		});
	}

});
