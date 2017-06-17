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
		const orders = Orders.find({ clientId: userId }).count();
		if(!orders && inputCode === code) {
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
	verifyAvailableEmail: email => {
		return Accounts.findUserByEmail(email);
	},
	// ORDERS
	createClientFromOrder: (accountDetails, order) => {
		try {
			const userId = Accounts.createUser(accountDetails);
			Roles.setUserRoles(userId, 'client');
			const { firstname, lastname, email, phone, locationId, address } = order;
			const client = { firstname, lastname, email, phone, locationId, address, userId };
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
	attemptPurchase: (token, order, accountDetails) => {
		/*
			Add user
		 */
		let userId = null;
		if(accountDetails) {
			try {
		    userId = Accounts.createUser(accountDetails);
		  } catch (ex) {
				throw new Meteor.Error("email-invalid");
		  }
		}
		/*
			Attempt Braintree transaction
		 */
		// Set API keys
		const braintree = require('braintree');
		const gateway = braintree.connect({
	    environment:  braintree.Environment.Sandbox,
	    merchantId:   'v2vwcjx3ck3fmz2y',
	    publicKey:    'dm5g4dscwyfpq2q2',
	    privateKey:   'b0bab9c7bc4c3923d3e6c72ed1fd15c3'
		});

		// Attempt sale
		gateway.transaction.sale({
		  amount: order.total,
		  paymentMethodNonce: token,
			customer: {
		    id: userId,
				firstName: order.firstname,
				lastName: order.lastname,
				email: order.email,
				phone: order.phone
		  },
		  options: {
		    submitForSettlement: true,
				storeInVaultOnSuccess: true
		  }
		}).then(function (result) {
			// When success, add transaction Id to order and insert order
		  if (result.success) {
				console.log(result.transaction);
		    order.transactionId = result.transaction.id;
				Orders.insert(order);
		  } else {
		    console.error(result.message);
				// Card was declined, so send message
				throw new Meteor.Error("card-declined",
					result.message);
		  }
		}).catch(function (err) {
		  console.error(err);
			// Card was declined, so send message
			throw new Meteor.Error("card-declined",
				err);
		});
	}
});
