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

Accounts.emailTemplates.resetPassword.from = () => {
  return 'Amayali <alex@2112studio.com>';
};

AccountsTemplates.configure({
  postSignUpHook: (userId, info) => {
    Meteor.call('createClientFromSignUp', userId, info);
  },
});

Mailer.init({
    templates: Templates,     // Global Templates namespace, see lib/templates.js.
    helpers: TemplateHelpers, // Global template helper namespace.
    layout: {
        name: 'emailLayout',
        path: 'emailTemplates/layout.html',   // Relative to 'private' dir.
        scss: 'emailTemplates/sass/layout.scss'
    }
});

SyncedCron.add({
  name: 'Send reminders',
  schedule: parser => parser.recur().first().minute(),
  job: () => {
    // Get current date in ISO format
	let now = new Date();
	now = Date.parse(now);

    Orders.find({ status: 'confirmed' }).map(order => {
        const { _id, date } = order;
	    // If date has passed, the order is completed
	    if (moment(date, "MM/DD/YYYY h:mm a").valueOf() < now) {
	        Orders.update({ _id }, { $set: { status: 'completed' } });
	    }
        // Send survey email
        Meteor.call('sendSurvey', _id);
	});
  }
});

Meteor.startup(() => {
	// Get current date in ISO format
	let now = new Date();
	now = Date.parse(now);

	// Find all orders with status confirmed
	Orders.find({ status: 'confirmed' }).map(order => {
        const { _id, date } = order;
	    // If date has passed, the order is completed
	    if (moment(date, "MM/DD/YYYY h:mm a").valueOf() < now) {
	        Orders.update({ _id }, { $set: { status: 'completed' } });
	    }
        // Send survey email
        Meteor.call('sendSurvey', _id);
	});

});
