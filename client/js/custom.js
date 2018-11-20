const easeScroll = target => {
    let topPos = -60;
    topPos += $(target).offset().top;
    $('html,body').animate({scrollTop: topPos}, 1000, 'easeInOutQuart', () => {
        $('.navbar-toggle').trigger('click');
    });
    return false;
};

const scroll = (target) => {
    var topPos = $(target).offset().top - 87;
    $('html,body').animate({scrollTop: topPos}, 600);
    return false;
};

const scrollTop = () => {
    if ($('.stage-open').length) {
        $('body').css('overflow', 'visible');
        $('.navbar-toggle').trigger('click');
    }
    $('html,body').animate({scrollTop: 0}, 0, 'easeInOutQuart');
};

const rate_90 = baseRate => baseRate * 1.5 - (baseRate - 599) * 0.495 + 0.005 * (699 - baseRate);
const rate_120 = baseRate => baseRate + 600;

/**
 * Verifies whether the schedule is valid or not.
 *
 * @param value - Date or Date-String
 * @returns {boolean}
 */
const verifySchedule = (value) => {
    let notAllowed = [0, 1, 2, 3, 4, 5, 6, 7, 21, 22, 23];
    if (_.includes(notAllowed, moment(value).hour())) {
        Bert.alert(TAPi18n.__('book.errors.invalidHour', null), 'danger');
        return false;
    }
    return true;
};

/**
 * Initializes date picker.
 */
const datepickerSetup = () => {
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

/**
 * Changes the language of the whole site to **lang**.
 *
 * @param lang - The language code to be set
 */
const setLanguage = (lang) => {
    Session.set('i18lLoaded', false);
    T9n.setLanguage(lang);
    TAPi18n.setLanguage(lang)
        .done(function () {
            Session.set('i18lLoaded', true);
        });
};

const $body = $('body');

// Eased scroll links. Verify if they come from the same page or from external route
$body.on('click', '.scroll-to', function () {
    const href = $(this).attr('href');
    let target;
    if (href.charAt(0) === '#') {
        target = href;
    } else {
        target = `#${href.split('/')[2]}`;
    }
    easeScroll(target);
});

// Scroll top when clicking a button
$body.on('click', '.scroll-top', () => {
    scrollTop();
});

export {
    easeScroll,
    setLanguage,
    scrollTop,
    scroll,
    rate_90,
    rate_120,
    verifySchedule,
    datepickerSetup
};
