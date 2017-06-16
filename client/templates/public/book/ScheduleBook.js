Template.ScheduleBook.onRendered(() => {
  let date = Session.get('date') || "";
  // Set active inputs
  if(date) {
    // Set as default date
    date = new Date(date);
    $("[name='date']").parent().addClass('input--filled');
  }

  $(".select-date").flatpickr({
		enableTime: true,
		altInput: true,
		altFormat: "F j, Y h:i K",
    altInputClass: "",
    defaultDate: date,
		minDate: moment().add(3, 'h').valueOf(),
		minuteIncrement: 15,
		disableMobile: true,
		wrap: true,
    onOpen: (selectedDates, dateStr, instance) => {
        $(instance.element).addClass('input--filled');
    },
    onClose: (selectedDates, dateStr, instance) => {
      console.log(dateStr);
       if(dateStr.trim() === '') {
         $(instance.element).removeClass('input--filled');
       }
    }
	});
});

Template.ScheduleBook.events({
  'click #next1': event => {
    event.preventDefault();
    if(!verifyFields($('#book-form-1'))) return false;

    // Not valid hours
		let notAllowed = [0, 1, 2, 3, 4, 5, 6, 7, 22, 23];
		if(_.includes(notAllowed, moment($("[name='date']").val()).hour())){
      Bert.alert(TAPi18n.__('book.errors.invalidHour', null), 'danger');
			return false;
		}
    // Get answers
    Session.set('date', moment($('[name="date"]').val()).format("MM/DD/YYYY h:mm a"));
    Session.set('locationId', $('[name="locationId"]').val());
    // Increase steps
    Session.set('instance', 2);
    // Increase max instance in case it was the first time advancing
    if(Session.get('maxIntance') === 1) Session.set('maxIntance', 2);
    scrollTop();
  }
});
