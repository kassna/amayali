let selectpicker = require('bootstrap-select');

Template.HeroSport.onCreated(function () {
  const self = this;
	self.autorun(function() {
		self.subscribe('activeLocations');
	});
});


Template.HeroSport.onRendered(function () {
	// Inialize parallax
	$('.parallax-section').parallax();
	/* Changed locale in flatpickr.js */
	$(".select-date").flatpickr({
		enableTime: true,
		altInput: true,
		altFormat: "F j, Y h:i K",
    altInputClass: "",
		minDate: moment().add(3, 'h').valueOf(),
		minuteIncrement: 15,
		disableMobile: true,
		wrap: true,
		onChange: (selectedDates, dateStr) => {
      Session.set('date', moment(dateStr).format("MM/DD/YYYY h:mm a"));
    },
	});
	$('.selectpicker').selectpicker({
	  style: 'btn-info',
	  size: 4
	});

	// Hack to fix select not showing all cities
	$(".selectpicker").selectpicker('refresh');
	setTimeout(function doSomething() {
	    $(".selectpicker").selectpicker('refresh');
	    if($(".dropdown-menu.inner").first().find('li').length <= 1) {
	    	setTimeout(doSomething, 500);
	    }
	}, 500);
});

Template.HeroSport.events({
  'click .submit-landing': () => {
    FlowRouter.go('book');
  }
});
