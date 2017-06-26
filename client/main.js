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

scrollTop = () => {
	if ($('.stage-open').length) {
		$('.navbar-toggle').trigger('click');
	}
	$('html,body').animate({ scrollTop: 0}, 0, 'easeInOutQuart');
}

let accountsTranslationsES = {
	firstname: 'Nombre(s)',
	lastname: 'Apellido(s)',
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
	Session.set("i18lLoaded", false);
  TAPi18n.setLanguage('es')
		.done(function () {
			Session.set("i18lLoaded", true);
		});
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

Template.registerHelper('humanDateHour', date => moment(date).format('lll'));

Template.registerHelper('dateHour', date => moment(date, "MM/DD/YYYY h:mm a").format('llll'));

Template.registerHelper('dateHourComplete', date => moment(date, "MM/DD/YYYY h:mm a").format('LLLL'));

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
Template.registerHelper('prettySex', option => TAPi18n.__(`schemas.therapists.sexSelect.options.${option}`, null))
Template.registerHelper('prettySexInitial', option => TAPi18n.__(`schemas.therapists.sexSelect.options.${option}`, null)[0])
Template.registerHelper('prettySchedules', options =>
	_.map(options, option => TAPi18n.__(`schemas.therapists.schedulePreferenceSelect.options.${option}`, null))
);
Template.registerHelper('prettyExperience', options =>
	_.map(options, option => TAPi18n.__(`schemas.therapists.experienceSelect.options.${option}`, null))
);
Template.registerHelper('prettyExperienceTypes', options =>
	_.map(options, option => TAPi18n.__(`schemas.therapists.experienceTypesSelect.options.${option}`, null))
);
Template.registerHelper('prettyReference', option => TAPi18n.__(`schemas.therapists.referenceSelect.options.${option}`, null));

Template.registerHelper('prettyBoolean', option => TAPi18n.__(`schemas.general.${option}`, null));

// Orders
Template.registerHelper('prettyType', option => TAPi18n.__(`schemas.orders.typeSelect.options.${option}`, null));
Template.registerHelper('prettyTherapistType', option => TAPi18n.__(`schemas.orders.therapistsTypeSelect.options.${option}`, null));
Template.registerHelper('prettyProduct', option => TAPi18n.__(`schemas.orders.productSelect.options.${option}`, null));
Template.registerHelper('prettyStatus', option => TAPi18n.__(`admin.orders.${option}`, null));

// PromoCodes helpers
Template.registerHelper('prettyDiscount', (type, amount) => {
	if(type === 'amount') return `${amount}`;
	else if(type === 'percentage') return `${amount}%`;
	return '';
});

Template.registerHelper('currentDiscount', pendingPromos => pendingPromos * 10);

Template.registerHelper('locationsName', locationsId =>
	_.map(locationsId, id => Locations.findOne(id).name)
);

Template.registerHelper('locationName', locationId => Locations.findOne(locationId).name);

Template.registerHelper('therapistName', therapistId => Therapists.findOne(therapistId).name);

Template.registerHelper('locationAbbr', locationId => Locations.findOne(locationId).abbreviation);

Template.registerHelper('promoCodeCode', _id => PromoCodes.findOne(_id).code);

Template.registerHelper('userInRole', (id, role) => Roles.userIsInRole(id, role));

Template.registerHelper('reloadSelect', () => {
	if(Session.get('i18lLoaded')) {
		$(".selectpicker").selectpicker('refresh');
	}
});

Template.registerHelper('getTranslation', key => TAPi18n.__(key, null));

//////////////////////////////////
///  ALL ELEMENTS
/////////////////////////////////

Template.registerHelper('locations', () => Locations.find());

Template.registerHelper('promoCodes', () => PromoCodes.find());

Template.registerHelper('users', () => Meteor.users.find());

Template.registerHelper('therapists', () => Therapists.find());

Template.registerHelper('clients', () => Clients.find());

Template.registerHelper('orders', () => Orders.find({}, {sort: {date: 1}}));

//////////////////////////////////
///  SINGLE ELEMENTS
/////////////////////////////////

Template.registerHelper('location', () => Locations.findOne());

Template.registerHelper('promoCode', () => PromoCodes.findOne());

Template.registerHelper('therapist', () => Therapists.findOne());

Template.registerHelper('client', () => Clients.findOne());

Template.registerHelper('order', () => Orders.findOne());
