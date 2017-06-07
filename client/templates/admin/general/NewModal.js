Template.NewModal.onCreated(function() {
	// Trigger insert form submit
	$("body").on('click', "#target-submit", function() {
		$("#insertForm ").submit();
	});
});
