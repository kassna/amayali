Template.ScheduleBook.onRendered(() => {
  $(".select-date").flatpickr({
		enableTime: true,
		altInput: true,
		altFormat: "F j, Y h:i K",
    altInputClass: "",
		utc: true,
		minDate: moment().subtract(2, 'h').valueOf(),
		minuteIncrement: 15,
		time_24hr: true,
		disableMobile: true,
		wrap: true,
    onOpen: function(selectedDates, dateStr, instance){
        $(instance.element).addClass('input--filled');
    },
    onClose: function(selectedDates, dateStr, instance){
       if(dateStr.trim() === '') {
         $(instance.element).removeClass('input--filled');
       }
    }
	});

  $('.selectpicker').selectpicker({
	  style: 'input__field input__field--madoka not-selected',
	  size: 4
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

  }
});
