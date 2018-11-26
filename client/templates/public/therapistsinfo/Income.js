import {rate_120, rate_90} from '../../../js/custom';

Template.Prices.events({
  'click .massage-type': event => {
    const type = $(event.target).attr('data-type');
    Session.set('type', type);
    FlowRouter.go('book');
  }
});

Template.PricesRow.helpers({
  rate60: () => {
    const locationId = Session.get('locationPrices');
    if (!locationId) return;
    return `$${Locations.findOne(locationId).base_rate} MXN`;
  },
  rate90: () => {
    const locationId = Session.get('locationPrices');
    if (!locationId) return;
    const rate = rate_90(Locations.findOne(locationId).base_rate);
    return `$${rate} MXN`;
  },
  rate120: () => {
    const locationId = Session.get('locationPrices');
    if (!locationId) return;
    const rate = rate_120(Locations.findOne(locationId).base_rate);
    return `$${rate} MXN`;
  },
});
