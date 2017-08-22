Template.NewModal.onCreated(() => {
	// Trigger insert form submit
	$("body").on('click', "#target-submit", () => {
		$("#insertForm ").submit();
	});
});
