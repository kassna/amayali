Template.HeaderLanding.onRendered(() => {
  let scrollNavbar = () => {
    if ($(window).scrollTop() > 60){
      $('.navbar').addClass('small-nav');
    }
    else {
      $('.navbar').removeClass('small-nav');
    }
  }
  scrollNavbar();

  $(document).scroll(() => {
    scrollNavbar();
  });
})
