const easeScroll = target => {
    let topPos = -60;
    topPos += $(target).offset().top;
    $('html,body').animate({scrollTop: topPos}, 1000, 'easeInOutQuart', () => {
        $('.navbar-toggle').trigger('click');
    });
    return false;
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

export {easeScroll, setLanguage};
