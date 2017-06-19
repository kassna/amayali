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
			const { locationsId, type, amount } = promoCode
			// User codes have locationsId: [], so verify this or if it's a valid location
			if(!locationsId.length || _.indexOf(locationsId, locationId) >= 0) {
				return { type, amount };
			} else {
				return false;
			}
		}
		return false;
	},

	// Client
	createClientFromSignUp: (userId, info) => {
		const { email } = info;
		const { firstname, lastname } = info.profile;
		Roles.setUserRoles(userId, 'client');
		Clients.insert({ email, firstname, lastname, userId });
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
		}
		return Orders.insert(order);
	},

	'assignOrderTherapist': (orderId, therapist) => {
		if(Orders.findOne(orderId).locationId != Therapists.findOne(therapist).locationId) {
			throw new Meteor.Error("different-location");
		}
		Orders.update({ _id: orderId }, { $set: { therapist }});
	},

	'cancelOrder': _id => Orders.update(_id, { $set: { status: 'canceled' } }),
});
