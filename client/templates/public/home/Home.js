import {easeScroll} from '../../../js/custom';

Template.Home.onRendered(function () {
    const {path = ''} = FlowRouter.current();
    if (path.match(/home/)) {
        easeScroll(`#${FlowRouter.getParam('scrollTo')}`);
    }
});
