Template.ScheduleBook.onRendered(() => {
  datepickerSetup();
});

Template.ScheduleBook.events({
  'click #next1': event => {
    event.preventDefault();
    // Not valid hours
		let notAllowed = [0, 1, 2, 3, 4, 5, 6, 7, 22, 23];
		if(_.includes(notAllowed, moment($("[name='date']").val()).hour())){
      Bert.alert(TAPi18n.__('book.errors.invalidHour', null), 'danger');
			return false;
		}
    nextInstance(['date', 'locationId'], 1);
  }
});
