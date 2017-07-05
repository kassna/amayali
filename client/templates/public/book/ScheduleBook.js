Template.ScheduleBook.onRendered(() => {
  let date = Session.get('date') || "";
  // Set active inputs
  if(date) {
    // Set as default date
    date = new Date(date);
    $("[name='date']").parent().addClass('input--filled');
  }

  const initDatepicker = () => {
    $(".select-date").flatpickr({
      enableTime: true,
      altInput: true,
      altFormat: "F j, Y h:i K",
      altInputClass: "",
      defaultDate: date,
      minDate: moment().add(3, 'h').valueOf(),
      minuteIncrement: 15,
      disableMobile: false,
      wrap: true,
      onChange: (selectedDates, dateStr) => {
        Session.set('date', moment(dateStr).format("MM/DD/YYYY h:mm a"));
      },
      onOpen: (selectedDates, dateStr, instance) => {
          $(instance.element).addClass('input--filled');
      },
      onClose: (selectedDates, dateStr, instance) => {
        if(dateStr.trim() === '') {
          $(instance.element).removeClass('input--filled');
        }
      }
    });
  }

  // Keep track of user's window width
  let pastWidth = $(window).width();

  const updateDatepicker = () => {
    
  }

  // Init datepicker on start
  initDatepicker();
  // Verify if window is mobile
  if (pastWidth < 768) {
    $('.select-date').addClass('input--filled');
  }

  // Event listener for resize
  $(window).resize(() => {
    const currWidth = $(window).width();
    // User resize to mobile
    if(pastWidth >= 768 && currWidth < 768) {
      initDatepicker();
      $('.select-date').addClass('input--filled');
    } else if (pastWidth < 768 && currWidth >= 768) { // User resize from mobile
      initDatepicker();
      $('.select-date').removeClass('input--filled');
    }
    pastWidth = currWidth;
  });
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
