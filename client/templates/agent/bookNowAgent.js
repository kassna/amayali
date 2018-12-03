import {verifyRequired} from '../public/book/Book';
import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';
import {datepickerSetup, verifySchedule} from '../../js/custom';

const requiredInputs = ['product', 'type', 'therapistsType', 'date'];

const getOrderDetails = () => {
    let orderDetails = {
        agentId: Session.get('agentId'),
        product: Session.get('product'),
        type: Session.get('type'),
        therapistsType: Session.get('therapistsType'),
        date: Session.get('date'),
        total: Session.get('total')
    };
    return orderDetails;
};

const handleErrorPayment = () => {
    Bert.alert(TAPi18n.__('book.errors.payment', null), 'danger');
};

const postPayment = (withPaypal, res) => {
    let orderDetails = getOrderDetails();

    if (withPaypal) {
        // Add paypal id to order
        orderDetails.transactionId = res.id;
    }

    // Attempt to insert order and account
    Meteor.call('postPaymentAgent', orderDetails, (err) => {
        if (err) {
            handleErrorPayment(err);
            return false;
        } else {
            resetOrderSession();
            FlowRouter.go('agent-pending-orders');
        }
    });
};

// Make a call to the REST api to execute the payment
const executePaypal = actions => actions.payment.execute().then(res => postPayment(true, res));

const resetOrderSession = () => {
    const toReset = _.concat(requiredInputs);
    _.map(toReset, item => {
        Session.set(item, null);
    });
};

Template.BookNowAgent.onCreated(function () {
    if (!Session.get('total')) Session.set('total', 0);
    let self = this;
    self.autorun(function () {
        self.subscribe('agentPoints');
    });

    // Get paypal env
    Meteor.call('getPaypalEnv', (err, res) => {
        if (err) {
            FlowRouter.reload();
        } else {
            Session.set('paypal_env', res);
        }
    });
});

Template.BookNowAgentForm.onRendered(() => {
    datepickerSetup();
    Session.set('creditCardPayMode', false);
});

Template.BookNowAgent.helpers({
    total: () => {
        let subTotal = Session.get('subTotal');
        if (!subTotal) {
            Session.set('total', 0);
            return 0;
        }
        // Safe asign total
        const total = subTotal > 0 ? Math.round(subTotal) : 0;
        Session.set('total', total);
        return total;
    },
    setAgentId: agentId => {
        Session.set('agentId', agentId);
    }
});

Template.BookNowAgentForm.helpers({
    types: () => _.map(['relax', 'decontracting', 'sport'], _id => {
        return {
            _id,
            name: () => TAPi18n.__(`schemas.orders.typeSelect.options.${_id}`, null)
        };
    }),
    therapistsType: () => _.map(['same', 'any', 'female', 'male'], _id => {
        return {
            _id,
            name: () => TAPi18n.__(`schemas.orders.therapistsTypeSelect.options.${_id}`, null)
        };
    }),
    products: () => _.map(['60', '90', '120'], _id => {
        return {
            _id,
            name: () => TAPi18n.__(`schemas.orders.productSelect.options.${_id}`, null)
        };
    })
});

Template.BookNowAgent.events({
    'click .edit-data': () => {
        Session.set('editId', Meteor.userId());
        Session.set('editMode', 1);
        Meteor.setTimeout(function () {
            $('#edit-modal').modal('show');
        }, 1);
    }
});

Template.BookNowAgentForm.events({
    'click #product button': event => {
        const product = $(event.target).attr('data-id');
        // Get selected location base rate
        //const baseRate = Locations.findOne(Session.get('locationId')).base_rate;

        let price;
        switch (product) {
            case '60':
                // Set price to base rate
                price = 799;
                break;
            case '90':
                // Get price by formula
                price = 1099;
                break;
            case '120':
                // Get price by formula
                price = 1399;
                break;
            default:
        }
        Session.set('subTotal', price);
    },
    'change [name="date"]': event => verifySchedule(event.target.value)
});

Template.BookNowAgentPaypal.onRendered(() => {
    // Issue with agent credentials https://github.com/paypal/paypal-checkout/issues/356
    const env = Session.get('paypal_env');
    paypal.Button.render({
        env,
        client: {
            sandbox: 'Ab6JnNhuMzjNDVhueResuMYTirMOwVkmajYwGoD0mACP_0i1VczPp1NQ8vKFJYZYG2X8w27gFJwRySmQ',
            production: 'AZCADNCbS-X7YzWstteXXP-6e-Mbmtt9QiGSNDH69y7a1QpsObsuVAW5o9fqQ1n9eg4nvGBM7uu_VmkT'
        },
        style: {
            label: 'checkout', // checkout | credit | pay
            size: 'responsive',    // small | medium | responsive
            shape: 'rect',     // pill | rect
            color: 'blue'      // gold | blue | silver
        },
        commit: true,
        payment: (data, actions) => {
            const orderDetails = getOrderDetails();
            if (!verifyRequired(requiredInputs) || !verifySchedule($('[name=\'date\']').val())) {
                return false;
            }
            return actions.payment.create({
                transactions: [{
                    amount: {
                        total: Session.get('total'),
                        currency: 'MXN'
                    },
                    description: `${orderDetails.product} + ${orderDetails.type}`
                }]
            }, {
                input_fields: {
                    no_shipping: 1
                }
            });
        },
        onError: (err) => {
            // Show an error page here, when an error occurs
            console.log('errr', err);
            handleErrorPayment({error: 'payment'});
        },
        onCancel: (data) => {
            console.log('CANCEL', data);
            handleErrorPayment({error: 'payment'});
        },
        onAuthorize: (data, actions) => {
            return executePaypal(actions);
        }
    }, '#paypal-button-container');
});

Template.BookNowAgentPaypal.helpers({
    // If total is 0, payment should be skipped
    payWithPaypal: () => Session.get('total') > 0
});
