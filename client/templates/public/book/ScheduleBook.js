import {datepickerSetup, verifySchedule} from '../../../js/custom';

Template.ScheduleBook.onRendered(() => {
  datepickerSetup();
});

Template.ScheduleBook.events({
  'click #next1': event => {
    event.preventDefault();
    verifySchedule($("[name='date']").val()) && nextInstance(['date', 'locationId'], 1);
  }
});
