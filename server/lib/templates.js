export default {
    orderConfirmation: {
        path: 'emailTemplates/orderConfirmation.html',    // Relative to the 'private' dir.
        scss: 'emailTemplates/sass/orderConfirmation.scss',     // Mail specific SCSS.

        helpers: {
            orderStatus: (order) => {
                if (order === 'confirmed') return "Pagada";
                else return "Pendiente de pago";
            },
            pendingPayment: (order) => {
                return order === 'pending_payment';
            }
        },

        route: {
            path: '/prueba/:id',
            data: (params) => {
                let order = Orders.findOne(params.id);
                let cakes = [];
                let kit;
                let products = [];
                let decoration;
                // Create a reference id by location count and name
                let location = Locations.findOne(order.location);
                // Iterate over every cake
                _.map(order.selectedCakes, function(n) {
                    // Create string with name, provider name and quantity
                    let cake = Cakes.findOne(n.cake);
                    cake.providerName = CakeProviders.findOne(cake.provider).name;
                    cake.quantity = n.quantity;
                    cake.personalize = n.personalize;
                    cakes.push(cake);
                });

                // Verify if kit was selected
                if (order.selectedKit) {
                    kit = Kits.findOne(order.selectedKit);
                    kit.price = kit.unit_price * parseInt(order.people);
                    // Products were selected
                } else {
                    _.map(order.selectedProducts, function(n) {
                        // Verify if is product or product special
                        let product = Products.findOne(n.product) ?
                            Products.findOne(n.product) : ProductsSpecial.findOne(n.product);
                        product.quantity = n.quantity;
                        product.personalize = n.personalize;
                        product.price = product.unit_price * parseInt(order.people);
                        products.push(product);
                    });
                }
                // Verify if decoration was selected and was personalized
                if (order.selectedDecoration) {
                    decoration = Decorations.findOne(order.selectedDecoration);
                }
                if (order.decorationPersonalization) {
                    decoration.personalize = order.decorationPersonalization;
                }

                return {
                    location: location,
                    order: order,
                    cakes: cakes,
                    kit: kit,
                    products: products,
                    decoration: decoration
                }
            }
        }
    },
    contactUs: {
        path: 'emailTemplates/contactUs.html',    // Relative to the 'private' dir.
    }
};