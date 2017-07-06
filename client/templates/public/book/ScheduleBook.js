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
        // On desktop, date will change with dateStr as it's already validated
        if ($(window).width() >= 768) {
          Session.set('date', moment(dateStr).format("MM/DD/YYYY h:mm a"));
        } else {
          // If there's a valid date, update session
          if (selectedDates.length) {
            Session.set('date', moment(dateStr).format("MM/DD/YYYY h:mm a"));
          } else {
            // Nullify date so user will need to update date
            Session.set('date', null);
          }
        }
      },
      onOpen: (selectedDates, dateStr, instance) => {
        // Add input class on desktop
        if ($(window).width() >= 768) {
          $(instance.element).addClass('input--filled');
        }
      },
      onClose: (selectedDates, dateStr, instance) => {
        // Remove input class on desktop
        if($(window).width() >= 768 && dateStr.trim() === '') {
          $(instance.element).removeClass('input--filled');
        }
      }
    });
  }

  // Keep track of user's window width
  let pastWidth = $(window).width();

  // Init datepicker on start
  initDatepicker();
  // Verify if window is mobile
  if (pastWidth < 768) {
    $('.select-date').addClass('input--filled');
  }

  // Event listener for resize
  $(window).resize(() => {
    const currWidth = $(window).width();
    // User resize to mobile. Update picker to avoid crashing
    if(pastWidth >= 768 && currWidth < 768) {
      initDatepicker();
      // Add filled class to input, as it's always on in mobile
      $('.select-date').addClass('input--filled');
    } else if (pastWidth < 768 && currWidth >= 768) { // User resize from mobile. Update picker to avoid crashing
      initDatepicker();
      // Add filled class to input, as it's default is not filled
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
