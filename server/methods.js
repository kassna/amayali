Meteor.methods({
	// Locations
	toggleStatusLocation: (id) => {
		let status = Locations.findOne(id).status;
		if (status) {
			Locations.update({_id: id}, {$set: {status: false}});
		}
		else {
			Locations.update({_id: id}, {$set: {status: true}});
		}
	},

	// PromoCodes
	toggleStatusPromoCode: (id) => {
		let status = PromoCodes.findOne(id).status;
		if (status) {
			PromoCodes.update({_id: id}, {$set: {status: false}});
		}
		else {
			PromoCodes.update({_id: id}, {$set: {status: true}});
		}
	},

	// Admins
	toggleAdmin: (id) => {
		if(Roles.userIsInRole(id, 'admin')) {
			Roles.removeUsersFromRoles(id, 'admin');
		} else {
			Roles.setUserRoles(id, 'admin');
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
