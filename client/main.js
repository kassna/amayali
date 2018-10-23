import {Agents} from '../collections/agents';

_ = lodash;

AutoForm.hooks({
    insertForm: {
        onSuccess: function () {
            $('#new-modal').modal('hide');
            Bert.alert(TAPi18n.__('admin.general.successInsert', null), 'success', 'growl-top-right');
        }
    },
    insertTherapistForm: {
        onSuccess: function () {
            FlowRouter.go('therapist-success');
        }
    }
});

// Sweet scroll function
scroll = function (target) {
    var topPos = $(target).offset().top - 87;
    $('html,body').animate({scrollTop: topPos}, 600);
    return false;
};

scrollTop = () => {
    if ($('.stage-open').length) {
        $('body').css('overflow', 'visible');
        $('.navbar-toggle').trigger('click');
    }
    $('html,body').animate({scrollTop: 0}, 0, 'easeInOutQuart');
};

// Get rates
rate_90 = baseRate => baseRate * 1.5 - (baseRate - 599) * 0.495 + 0.005 * (699 - baseRate);
rate_120 = baseRate => baseRate + 600;
rate_prenatal = baseRate => baseRate * 1.5 - (baseRate - 599) * 0.495 + 0.005 * (699 - baseRate);

// Verify valid hours
verifySchedule = (value) => {
    let notAllowed = [0, 1, 2, 3, 4, 5, 6, 7, 21, 22, 23];
    if (_.includes(notAllowed, moment(value).hour())) {
        Bert.alert(TAPi18n.__('book.errors.invalidHour', null), 'danger');
        return false;
    }
    return true;
};

// Initialize datepicker
datepickerSetup = () => {
    let date = Session.get('date') || '';
    // Set active inputs
    if (date) {
        // Set as default date
        date = new Date(date);
        $('[name=\'date\']').parent().addClass('input--filled');
    }

    const initDatepicker = () => {
        $('.select-date').flatpickr({
            enableTime: true,
            altInput: true,
            altFormat: 'F j, Y h:i K',
            altInputClass: '',
            defaultDate: date,
            minDate: moment().add(4, 'h').valueOf(),
            minuteIncrement: 15,
            disableMobile: false,
            wrap: true,
            onChange: (selectedDates, dateStr) => {
                // On desktop, date will change with dateStr as it's already validated
                if ($(window).width() >= 768) {
                    Session.set('date', moment(dateStr).format('MM/DD/YYYY h:mm a'));
                } else {
                    // If there's a valid date, update session
                    if (selectedDates.length) {
                        Session.set('date', moment(dateStr).format('MM/DD/YYYY h:mm a'));
                    } else {
                        // Nullify date so user will need to update date
                        Session.set('date', null);
                    }
                }
            },
            onOpen: (selectedDates, dateStr, instance) => {
                // Add input class on desktop
                if ($(window).width() >= 768) {
                    $(instance.element).addClass('input--filled');
                }
            },
            onClose: (selectedDates, dateStr, instance) => {
                // Remove input class on desktop
                if ($(window).width() >= 768 && dateStr.trim() === '') {
                    $(instance.element).removeClass('input--filled');
                }
            }
        });
    };

    // Keep track of user's window width
    let pastWidth = $(window).width();

    // Init datepicker on start
    initDatepicker();
    // Verify if window is mobile
    if (pastWidth < 768) {
        $('.select-date').addClass('input--filled');
    }

    // Event listener for resize
    $(window).resize(() => {
        const currWidth = $(window).width();
        // User resize to mobile. Update picker to avoid crashing
        if (pastWidth >= 768 && currWidth < 768) {
            initDatepicker();
            // Add filled class to input, as it's always on in mobile
            $('.select-date').addClass('input--filled');
        } else if (pastWidth < 768 && currWidth >= 768) { // User resize from mobile. Update picker to avoid crashing
            initDatepicker();
            // Add filled class to input, as it's default is not filled
            $('.select-date').removeClass('input--filled');
        }
        pastWidth = currWidth;
    });
};

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
    },
    clickAgree: 'Al registrarse aprueba la',
    privacyPolicy: 'Política de Privacidad',
    terms: 'Términos y Condiciones'
};

// For translation, all language objects should contain the same keys
let accountsTranslationsEN = {};

Meteor.startup(function () {
    Session.set('i18lLoaded', false);
    TAPi18n.setLanguage('es')
        .done(function () {
            Session.set('i18lLoaded', true);
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

Template.registerHelper('log', toLog => {
    console.log(toLog);
});

Template.registerHelper('imagePath', id => '/cfs/files/images/' + id);

Template.registerHelper('roundedPrice', price => (price % 1 === 0) ? price : price.toFixed(2));

Template.registerHelper('humanDate', date => moment(date).format('LL'));

Template.registerHelper('humanDateHour', date => moment(date).format('lll'));

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

Template.registerHelper('promoCode', () => PromoCodes.findOne());

Template.registerHelper('therapist', () => Therapists.findOne());

Template.registerHelper('client', () => Clients.findOne());

Template.registerHelper('order', () => Orders.findOne());

Template.registerHelper('survey', () => Surveys.findOne());

Template.registerHelper('therapistSurvey', () => TherapistSurveys.findOne());
