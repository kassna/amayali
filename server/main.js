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
	const now = moment().subtract(6, 'hours');
    const currHour = now.hour();
    console.log('curr time', now.valueOf());
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
            }
        }
        
        // If date has passed, the order is completed
        if (clientDate.isBefore(now)) {
            // Log in server to have proof
            console.log('order date', clientDate.format('lll'));
            console.log('time as of now', now.format('lll'));
            // Update order to completed
            Orders.update({ _id }, { $set: { status: 'completed' } });
            // Send survey email
            Meteor.call('sendSurvey', _id);
        }
    });
  }
});

Meteor.startup(() => {
    SyncedCron.start();
});
