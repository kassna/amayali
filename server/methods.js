Meteor.methods({
	// Locations
	toggleStatusLocation: function(id) {
		let status = Locations.findOne(id).status;
		if (status) {
			Locations.update({_id: id}, {$set: {status: false}});
		}
		else {
			Locations.update({_id: id}, {$set: {status: true}});
		}
	},

	sendContactUs: function (name, email, question) {
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
