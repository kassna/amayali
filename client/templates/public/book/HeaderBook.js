Template.HeaderBook.helpers({
  'total': () => {
    let subTotal = Session.get('subTotal');
    const promoCode = Session.get('promoCodeValid');
    // Return 0 when no subtotal is set
    if (!subTotal) {
      Session.set('total', 0);
      return 0;
    }
    // Subtract promocode
    if (promoCode) {
      if (promoCode.type === 'amount') {
        subTotal -= promoCode.amount;
      } else {
        subTotal *= ((100 - promoCode.amount) * 0.01);
      }
    }
    // Safe asign total
    const total = subTotal > 0 ? Math.round(subTotal) : 0;
    Session.set('total', total);
    return total;
  },
});

Template.HeaderBook.onRendered(() => {
  let scrollNavbar = () => {
    if ($(window).scrollTop() > 60){
      $('.navbar-brand img').attr("src","/img/logo_small.png");
    }
    else {
      $('.navbar-brand img').attr("src","/img/logo_small.png");
    }
  }
  scrollNavbar();

  $(document).scroll(() => {
    scrollNavbar();
  });
})
