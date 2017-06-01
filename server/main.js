import { Meteor } from 'meteor/meteor';
import Templates from './lib/templates';
import TemplateHelpers from './lib/templates-helpers';

Mailer.config({
    from: 'Amayali <' + process.env.SENDER_EMAIL + '>',
    replyTo: 'Amayali <' + process.env.SENDER_EMAIL + '>',
    plainTextOpts: {
        ignoreImage: true
    }
});

Meteor.startup(() => {
	// script to verify time of orders

	// // Get current date in ISO format
	// let now = new Date();
	// now = Date.parse(now);
  //
	// // Find all orders with status confirmed
	// Orders.find({ status: 'confirmed' }).map(function(order) {
	//     // If date has passed, the order is completed
	//     if (moment(order.date, "MM/DD/YYYY h:mm a").valueOf() < now) {
	//         Orders.update({ _id: order._id }, { $set: { status: 'completed' } });
	//     }
	// });
  //
	// // Find all orders with status pending
	// Orders.find({ status: 'pending_payment' }).map(function(order) {
	//     // If date has passed, the order is canceled
	//     if (moment(order.date, "MM/DD/YYYY h:mm a").valueOf() < now) {
	//         Orders.update({ _id: order._id }, { $set: { status: 'canceled' } });
	//     }
	// });


    Mailer.init({
        templates: Templates,     // Global Templates namespace, see lib/templates.js.
        helpers: TemplateHelpers, // Global template helper namespace.
        layout: {
            name: 'emailLayout',
            path: 'emailTemplates/layout.html',   // Relative to 'private' dir.
            scss: 'emailTemplates/sass/layout.scss'
        }
    });

    // Meteor.call('sendMail');

});
