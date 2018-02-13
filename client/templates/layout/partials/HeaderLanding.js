Template.HeaderLanding.onRendered(() => {
  let scrollNavbar = () => {
    if ($(window).scrollTop() > 60){
      $('.navbar.toChange').addClass('small-nav');
      $('.navbar-brand img').attr("src","/img/logosup.png");
    }
    else {
      $('.navbar.toChange').removeClass('small-nav');
      $('.navbar-brand img').attr("src","/img/logosupbco.png");
    }
  }
  scrollNavbar();

  $(document).scroll(() => {
    scrollNavbar();
  });
})
