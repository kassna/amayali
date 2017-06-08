$('body').on('click', '.scroll-to', function() {
  let topPos = -60;
  let href = $(this).attr('href');
  let target = $(this).attr('data-target');
  if (href.charAt(0) === '#') { target = href;  }
  topPos += $(target).offset().top;
	$('html,body').animate({ scrollTop: topPos}, 1000, 'easeInOutQuart');
	return false;
});
