let selectpicker = require('bootstrap-select');

Template.Hero.onRendered(function () {
	// Inialize parallax
	$('.parallax-section').parallax();
	/* Changed locale in flatpickr.js */
	$(".select-date").flatpickr({
		enableTime: true,
		altInput: true,
		altFormat: "F j, Y h:i K",
		utc: true,
		minDate: moment().add(1, 'days').valueOf(),
		minuteIncrement: 15,
		time_24hr: true,
		disableMobile: true,
		wrap: true
	});
	$('.selectpicker').selectpicker({
	  style: 'btn-info',
	  size: 4
	});
});
