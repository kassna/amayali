Template.HeaderBook.helpers({
  'total': () => {
    let subTotal = Session.get('subTotal');
    const promoCode = Session.get('promoCodeValid');
    if (subTotal && promoCode) {
      if (promoCode.type === 'amount') {
        subTotal -= promoCode.amount;
      } else {
        subTotal *= ((100 - promoCode.amount) * 0.01);
      }
    }
    const total = Math.round(subTotal);
    Session.set('total', total);
    return total;
  },
});
