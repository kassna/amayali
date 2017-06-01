_ = lodash;

var hooksObject = {
	onSuccess: function(formType, result) {
		$("#new-modal").modal('hide');
		Bert.alert( 'Éxito! Se ha agregado a la base de datos', 'success', 'growl-top-right' );
	},
}
AutoForm.addHooks('insertForm', hooksObject);

// Sweet scroll function
scroll = function(target) {
	var topPos = $(target).offset().top - 87;
	$('html,body').animate({ scrollTop: topPos}, 600);
	return false;
}


//////////////////////////////////
///  HELPERS
//////////////////////////////////

Template.registerHelper('imagePath', (id) => {
	return "/cfs/files/images/" + id;
});

Template.registerHelper('roundedPrice', (price) => {
	return (price % 1 === 0) ? price : price.toFixed(2);
});

Template.registerHelper('humanDate', (date) => {
	return moment(date).format("LL");
});

Template.registerHelper('humanDateUnix', (date) => {
	return moment(date, "MM/DD/YYYY h:mm a").format("LLLL");
});

Template.registerHelper('fromNow', (date) => {
	return moment(date).fromNow();
});

Template.registerHelper('prettyStatus', (string) => {
	let status = {
		pending_payment: "Pendiente de pago",
		confirmed: "Confirmada",
		canceled: "Cancelada",
		completed: "Completada"
	};
	return status[string];
});

//////////////////////////////////
///  ALL ELEMENTS
/////////////////////////////////
