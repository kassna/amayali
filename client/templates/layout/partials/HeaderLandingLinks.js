import {setLanguage} from '../../../js/custom';

Template.HeaderLandingLinks.helpers({
    routeIsHome: () => {
        const {path} = FlowRouter.current();
        return path === '/' || path.match(/home/);
    },
    howWorksLink: () => {
        if (FlowRouter.current().path === '/') {
            return '#comoFunciona';
        } else {
            return FlowRouter.path('home-scroll', {scrollTo: 'comoFunciona'});
        }
    },
    pricesLink: () => {
        if (FlowRouter.current().path === '/') {
            return '#precios';
        } else {
            return FlowRouter.path('home-scroll', {scrollTo: 'precios'});
        }
    },
    isCurrentLanguage: (lang) => TAPi18n.getLanguage() === lang
});

Template.HeaderLandingLinks.events({
    'click #langES': () => setLanguage('es'),
    'click #langEN': () => setLanguage('en')
});
