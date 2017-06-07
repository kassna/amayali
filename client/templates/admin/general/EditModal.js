Template.EditModal.onCreated(function() {
  // Trigger edit form submit
	$("body").on('click', '#target-edit', function() {
		$("#" + Session.get('editId')).submit();
		$("#edit-modal").modal('hide');
	});
});
