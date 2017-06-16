easeScroll = target => {
  let topPos = -60;
  topPos += $(target).offset().top;
	$('html,body').animate({ scrollTop: topPos}, 1000, 'easeInOutQuart', () => {
    $('.navbar-toggle').trigger('click');
  });
	return false;
}

// Eased scroll links. Verify if they come from the same page or from external route
$('body').on('click', '.scroll-to', function() {
  const href = $(this).attr('href');
  let target;
  if (href.charAt(0) === '#') {
    target = href
  } else {
    target = `#${href.split('/')[2]}`;
  }
  easeScroll(target);
});

// Scroll top when clicking a button
$('body').on('click', '.scroll-top', () => {
  scrollTop();
});
