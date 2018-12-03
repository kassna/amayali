import {Template} from 'meteor/templating';

Template.PromoRewardAgent.onCreated(function() {
    this.autorun(() => this.subscribe('agents'))
});
