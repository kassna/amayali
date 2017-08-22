Template.HeaderLanding.onRendered(() => {
  let scrollNavbar = () => {
    if ($(window).scrollTop() > 60){
      $('.navbar.toChange').addClass('small-nav');
    }
    else {
      $('.navbar.toChange').removeClass('small-nav');
    }
  }
  scrollNavbar();

  $(document).scroll(() => {
    scrollNavbar();
  });
})
