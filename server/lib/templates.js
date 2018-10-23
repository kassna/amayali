const getOrderTime = orderId => {
  const date = moment(Orders.findOne(id).date, "MM/DD/YYYY h:mm a");
  return {
    day: date.format('dddd D'),
    month: date.format('MMMM'),
    hour: date.format('H:mm A'),
  };
}

export default {
    orderConfirmation: {
        path: 'emailTemplates/orderConfirmation.html',    // Relative to the 'private' dir.
        route: {
            path: '/prueba/:id',
            data: (params) => {
              return Orders.findOne(params.id);
            }
        }
    },
    newTherapist: {
        path: 'emailTemplates/newAplication.html', 
        route: {
            path: '/prueba1/:id',
            data: params => {
              let order = Orders.findOne(params.id);
              order.location = Locations.findOne(order.locationId).name;
              return order;
            }
        }
    },
    newOrder: {
        path: 'emailTemplates/newOrder.html',    // Relative to the 'private' dir.
        route: {
            path: '/prueba1/:id',
            data: params => {
              let order = Orders.findOne(params.id);
              order.location = Locations.findOne(order.locationId).name;
              return order;
            }
        }
    },
    welcomeUser: {
      path: 'emailTemplates/welcomeUser.html',
      route: {
        path: '/welcomeUser/:id',
        data: params => Clients.findOne(params.id),
      }
    },
    survey: {
      path: 'emailTemplates/survey.html',
      route: {
        path: '/survey/:id',
        data: params => Orders.findOne(params.id),
      }
    },
    contactUs: {
        path: 'emailTemplates/contactUs.html',    // Relative to the 'private' dir.
        route: {
          path: '/contact',
          data: () => {
            return {
              name: 'Alejandro Henkel',
              email: 'alehenkel17@gmail.com',
              phone: '7711992832',
              message: 'hola k ase'
            }
          }
        }
    },
    reminder: {
        path: 'emailTemplates/reminder.html',    // Relative to the 'private' dir.
        route: {
          path: '/reminder/:id',
          data: params => {
            const date = moment(Orders.findOne(params.id).date, "MM/DD/YYYY h:mm a");
            return {
              day: date.format('dddd D'),
              month: date.format('MMMM'),
              hour: date.format('H:mm A'),
            };
          }
        }
    },

    reminder1: {
        path: 'emailTemplates/reminder1.html',    // Relative to the 'private' dir.
        route: {
          path: '/reminder1/:id',
          data: params => {
            const date = moment(Orders.findOne(params.id).date, "MM/DD/YYYY h:mm a");
            return {
              day: date.format('dddd D'),
              month: date.format('MMMM'),
              hour: date.format('H:mm A'),
            };
          }
        }
    },
};
