_ = lodash;

AutoForm.hooks({
	insertForm: {
		onSuccess: function(formType, result) {
			$('#new-modal').modal('hide');
			Bert.alert( TAPi18n.__('admin.general.successInsert', null), 'success', 'growl-top-right' );
		},
	},
	insertTherapistForm: {
		onSuccess: function(formType, result) {
			FlowRouter.go('therapist-success');
		},
	}
})

// Sweet scroll function
scroll = function(target) {
	var topPos = $(target).offset().top - 87;
	$('html,body').animate({ scrollTop: topPos}, 600);
	return false;
}

let accountsTranslationsES = {
	firstname: 'Nombres',
	lastname: 'Apellidos',
	'Required Field': 'Campo Requerido',
	'Minimum required length: 3': 'Mínimo 3 caractéres',
	'Minimum required length: 6': 'Mínimo 6 caractéres',
	'Invalid email': 'Email inválido',
	error: {
		accounts: {
			'Acceso denegado': 'Acceso denegado. Intenta de nuevo'
		}
	}
}

// For translation, all language objects should contain the same keys
let accountsTranslationsEN = {

}

Meteor.startup(function () {
  TAPi18n.setLanguage('es');
	T9n.setLanguage('es');
	T9n.map('es', accountsTranslationsES);
	T9n.map('en', accountsTranslationsEN);
});

//////////////////////////////////
///  HELPERS
//////////////////////////////////

////// ADMIN

Template.registerHelper('editId', () => Session.get('editId'));

//////

Template.registerHelper('log', toLog => { console.log(toLog); });

Template.registerHelper('imagePath', id => '/cfs/files/images/' + id);

Template.registerHelper('roundedPrice', price => (price % 1 === 0) ? price : price.toFixed(2));

Template.registerHelper('humanDate', date => moment(date).format('LL'));

Template.registerHelper('fromNow', date => moment(date).fromNow());

Template.registerHelper('prettyStatus', string => {
	let status = {
		pending_payment: 'Pendiente de pago',
		confirmed: 'Confirmada',
		canceled: 'Cancelada',
		completed: 'Completada'
	};
	return status[string];
});

// Therapists helpers
Template.registerHelper('prettySex', option => TAPi18n.__(`schemas.therapists.sexSelect.options.${option}`, null)[0])
Template.registerHelper('prettySchedules', options =>
	_.map(options, option => TAPi18n.__(`schemas.therapists.schedulePreferenceSelect.options.${option}`, null))
);

Template.registerHelper('prettyDiscount', (type, amount) => {
	if(type === 'amount') return `${amount}`;
	else if(type === 'percentage') return `${amount}%`;
	return '';
});

Template.registerHelper('locationsName', locationsId =>
	_.map(locationsId, id => Locations.findOne(id).name)
);

Template.registerHelper('locationName', locationId => Locations.findOne(locationId).name);

Template.registerHelper('userInRole', (id, role) => Roles.userIsInRole(id, role));

//////////////////////////////////
///  ALL ELEMENTS
/////////////////////////////////

Template.registerHelper('locations', () => Locations.find());

Template.registerHelper('promoCodes', () => PromoCodes.find());

Template.registerHelper('users', () => Meteor.users.find());

Template.registerHelper('therapists', () => Therapists.find());

//////////////////////////////////
///  SINGLE ELEMENTS
/////////////////////////////////

Template.registerHelper('location', () => Locations.findOne());

Template.registerHelper('promoCode', () => PromoCodes.findOne());

Template.registerHelper('therapist', () => Therapists.findOne());
