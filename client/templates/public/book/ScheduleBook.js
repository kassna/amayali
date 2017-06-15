Template.ScheduleBook.onRendered(() => {
  $(".select-date").flatpickr({
		enableTime: true,
		altInput: true,
		altFormat: "F j, Y h:i K",
    altInputClass: "",
		utc: true,
		minDate: moment().add(1, 'days').valueOf(),
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
