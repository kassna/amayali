Template.HeaderBook.helpers({
  'total': () => {
    let subTotal = Session.get('total');
    const promoCode = Session.get('promoCodeValid');
    if (subTotal && promoCode) {
      if (promoCode.type === 'amount') {
        subTotal -= promoCode.amount;
      } else {
        subTotal *= ((100 - promoCode.amount) * 0.01);
      }
    }
    return Math.round(subTotal);
  },
});
