import {Template} from 'meteor/templating';

Template.customSelect.helpers({
    isCurrent: (current, option) => current === option
});
