import { Meteor } from 'meteor/meteor';
import Templates from './lib/templates';
import TemplateHelpers from './lib/templates-helpers';

Mailer.config({
    from: 'Kassna <' + process.env.SENDER_EMAIL + '>',
    replyTo: 'Kassna <' + process.env.SENDER_EMAIL + '>',
    plainTextOpts: {
        ignoreImage: true
    }
});

Accounts.emailTemplates.resetPassword = {
  from() {
    return 'Kassna <' + process.env.SENDER_EMAIL + '>';
  },
  subject() {
    return "[Kassna] Reestablecer contraseña";
  },
  text(user, url) {
    return `
      Hola:

      Hemos recibido una solicitud para reestablecer tu contraseña. Solo tienes que entrar al siguiente link ${url}.

      Si esta es una solicitud erronea, por favor ignorala.

      Kassna
    `;
  }
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
    console.log('Recurring');
    // Get current date in moment format
	const now = moment();
    const currHour = now.hour();
    console.log('hour', currHour);

    Orders.find({ status: 'confirmed' }).map(order => {
        const { _id, date, email } = order;
        const clientDate = moment(date, "MM/DD/YYYY h:mm a");
	    // Verify if order is in the same day
	    if (clientDate.isSame(now, 'day')) {
            // Get hour of order
            const clientHour = clientDate.hour();
            // Verify if is time for reminders
            if (clientHour - currHour === 1) {
                console.log('One hour sent');
                Meteor.call('sendReminder1', email);
            } else if (clientHour - currHour === 4) {
                console.log('Four hour sent');
                Meteor.call('sendReminder4', email);
            }
	    }
	});
  }
});

Meteor.startup(() => {
    SyncedCron.start();

    // Simulated now, with 1 hours delay to avoid any issue
    const now = moment().subtract(1, 'hours')

	// Find all orders with status confirmed
	Orders.find({ status: 'confirmed' }).map(order => {
        const { _id, date } = order;
	    // If date has passed, the order is completed
	    if (moment(date, "MM/DD/YYYY h:mm a").isBefore(now)) {
            // Log in server to have proof
            console.log('order date', moment(date, "MM/DD/YYYY h:mm a").format('lll'));
            console.log('time as of now', now.format('lll'));
            // Update order to completed
	        Orders.update({ _id }, { $set: { status: 'completed' } });
            // Send survey email
            Meteor.call('sendSurvey', _id);
	    }
    });

    Orders.find({ status: 'completed' }).map(order => {
        let { _id, therapistSurvey } = order
        if (therapistSurvey) return false;
        therapistSurvey = TherapistSurveys.insert({});
        Orders.update({ _id }, { $set: { therapistSurvey } });
    });
    
});
