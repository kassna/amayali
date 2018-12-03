import {Agents} from '../collections/agents';
import {setLanguage} from './js/custom';

_ = lodash;

const accountsTranslationsES = {
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
    },
    clickAgree: 'Al registrarse aprueba la',
    privacyPolicy: 'Política de Privacidad',
    terms: 'Términos y Condiciones'
};

// For translation, all language objects should contain the same keys
const accountsTranslationsEN = {};

Meteor.startup(function () {
    setLanguage('es');

    T9n.map('es', accountsTranslationsES);
    T9n.map('en', accountsTranslationsEN);
});

//////////////////////////////////
///  HELPERS
//////////////////////////////////

////// ADMIN

Template.registerHelper('editId', () => Session.get('editId'));

//////

Template.registerHelper('log', toLog => {
    console.log(toLog);
});

Template.registerHelper('imagePath', id => '/cfs/files/images/' + id);

Template.registerHelper('roundedPrice', price => (price % 1 === 0) ? price : price.toFixed(2));

Template.registerHelper('humanDate', date => moment(date).format('LL'));

Template.registerHelper('humanDate24', date => moment(date, 'MM/DD/YYYY h:mm a').format('MM/DD/YYYY HH:mm'));

Template.registerHelper('humanDateHour', date => moment(date).format('lll'));

Template.registerHelper('dateYear', date => moment(date).format('YYYY'));

Template.registerHelper('dateHour', date => moment(date, 'MM/DD/YYYY h:mm a').format('llll'));

Template.registerHelper('dateHourComplete', date => moment(date, 'MM/DD/YYYY h:mm a').format('LLLL'));

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
Template.registerHelper('prettySex', option => TAPi18n.__(`schemas.therapists.sexSelect.options.${option}`, null));
Template.registerHelper('prettySexInitial', option => TAPi18n.__(`schemas.therapists.sexSelect.options.${option}`, null)[0]);
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

// Survey
Template.registerHelper('prettyAnswer', option => TAPi18n.__(`survey.enjoy.${option}`, null));
Template.registerHelper('prettyCommentType', option => TAPi18n.__(`survey.comment.${option}`, null));
Template.registerHelper('prettyAnswerTherapist1', option => TAPi18n.__(`therapistSurvey.clean.${option}`, null));
Template.registerHelper('prettyAnswerTherapist2', option => TAPi18n.__(`therapistSurvey.agression.${option}`, null));

// PromoCodes helpers
Template.registerHelper('prettyDiscount', (type, amount) => {
    if (type === 'amount') return `${amount}`;
    else if (type === 'percentage') return `${amount}%`;
    return '';
});

Template.registerHelper('currentDiscount', pendingPromos => pendingPromos * 140);

Template.registerHelper('locationsName', locationsId =>
    _.map(locationsId, id => Locations.findOne(id).name)
);

Template.registerHelper('locationName', locationId => Locations.findOne(locationId).name);

Template.registerHelper('therapistName', therapistId => Therapists.findOne(therapistId).name);

Template.registerHelper('locationAbbr', locationId => Locations.findOne(locationId).abbreviation);

Template.registerHelper('promoCodeCode', _id => PromoCodes.findOne(_id).code);

Template.registerHelper('userInRole', (id, role) => Roles.userIsInRole(id, role));

Template.registerHelper('reloadSelect', () => {
    if (Session.get('i18lLoaded')) {
        $('.selectpicker').each(function () {
            $(this).selectpicker('refresh');
        });
    }
});

Template.registerHelper('getTranslation', key => TAPi18n.__(key, null));

//////////////////////////////////
///  ALL ELEMENTS
/////////////////////////////////
Template.registerHelper('agents', () => Agents.find());

Template.registerHelper('locations', () => Locations.find());

Template.registerHelper('promoCodes', () => PromoCodes.find());

Template.registerHelper('users', () => Meteor.users.find());

Template.registerHelper('therapists', () => Therapists.find());

Template.registerHelper('clients', () => Clients.find());

Template.registerHelper('orders', () => Orders.find({}, {sort: {date: 1}}));

Template.registerHelper('surveys', () => Surveys.find());

Template.registerHelper('therapistSurveys', () => TherapistSurveys.find());

//////////////////////////////////
///  SINGLE ELEMENTS
/////////////////////////////////

Template.registerHelper('location', () => Locations.findOne());

Template.registerHelper('agentP', _id => Agents.findOne(_id));

Template.registerHelper('promoCode', () => PromoCodes.findOne());

Template.registerHelper('therapist', () => Therapists.findOne());

Template.registerHelper('client', () => Clients.findOne());

Template.registerHelper('order', () => Orders.findOne());

Template.registerHelper('survey', () => Surveys.findOne());

Template.registerHelper('therapistSurvey', () => TherapistSurveys.findOne());
