Template.HeaderLanding.onRendered(() => {
  let scrollNavbar = () => {
    if ($(window).scrollTop() > 60){
      $('.navbar.toChange').addClass('small-nav');
      $('img').attr("src","/img/logosup.png");
    }
    else {
      $('.navbar.toChange').removeClass('small-nav');
      $('img').attr("src","/img/logosupbco.png");
    }
  }
  scrollNavbar();

  $(document).scroll(() => {
    scrollNavbar();
  });
})
