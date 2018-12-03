import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';
import {Agents} from '../../../../collections/agents';

Template.agentListElement.events({
    'click .edit-button': function () {
        Session.set('editId', this._id);
        Session.set('editMode', 1);
        Meteor.setTimeout(function () {
            $('#edit-modal').modal('show');
        }, 500);
    },
    'click .toggle-status': function () {
        Meteor.call('toggleStatusAgent', this._id);
    },
    'click .view-more-btn': function () {
        Session.set('viewId', this._id);
        Session.set('viewMode', 1);
        Meteor.setTimeout(function () {
            $('#agent-info').modal('show');
        }, 500);
    }
});
