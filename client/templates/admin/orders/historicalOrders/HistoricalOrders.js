import Clipboard from 'clipboard';

Template.HistoricalOrders.onCreated(function () {
    this.autorun(() => {
        this.subscribe('therapistHistoricalOrders', Session.get('currentCity'));
        this.subscribe('completedOrdersSurveys', Session.get('currentCity'));
        this.subscribe('completedOrdersTherapistSurveys', Session.get('currentCity'));
    });
});

Template.HistoricalOrders.onRendered(function () {
    this.autorun(() => {
        this.subscribe('historicalOrders', Session.get('currentCity'), Session.get('orderYear'),
            Session.get('orderMonth'), () => {
                Tracker.afterFlush(() => {
                    $('[data-sort=table]').tablesorter({
                        sortList: [[0, 0]],
                        headers: {
                            1: {sorter: false},
                            2: {sorter: false},
                            3: {sorter: false},
                            4: {sorter: false},
                            5: {sorter: false},
                            6: {sorter: false},
                            9: {sorter: 'isoDate', dateFormat: 'DD/MM/YYYY hh:mm'},
                            15: {sorter: false},
                            16: {sorter: false}
                        }
                    });
                    const clipboard = new Clipboard('.copy-to-clipboard');
                    clipboard.on('success', function () {
                        Bert.alert(TAPi18n.__('admin.orders.copySuccess', null), 'success');
                    });
                });
            });
    });
});

Template.HistoricalOrders.helpers({
    orderYearSelectOptions: () => {
        const year = new Date().getUTCFullYear();

        return Array.from({length: 10}, (v, k) => ({label: year - k, value: `${year - k}`}));
    },
    orderMonthSelectOptions: () => Array.from({length: 12}, (v, k) => ({
            label: TAPi18n.__(`general.date.months.${k + 1}`),
            value: `${k + 1}`
        })
    ),
    currentYear: () => Session.get('orderYear'),
    currentMonth: () => Session.get('orderMonth')
});

Template.HistoricalOrders.events({
    'change #order-year-selection ': (event) =>
        Session.setPersistent('orderYear', $(event.target).val()),
    'change #order-month-selection ': (event) =>
        Session.setPersistent('orderMonth', $(event.target).val())
});
