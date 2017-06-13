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
	}
});
