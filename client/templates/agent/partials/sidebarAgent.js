import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';

Template.SidebarAgent.onCreated(function () {
    this.autorun(() => this.subscribe('activeLocations'));
});

Template.SidebarAgent.events({
    'click .edit-data': () => {
        Session.set('editId', Meteor.userId());
        Session.set('editMode', 1);
        Meteor.setTimeout(function () {
            $('#edit-modal').modal('show');
        }, 500);
    }
});
