Template.EditModal.onCreated(() => {
  // Trigger edit form submit
	$("body").on('click', '#target-edit', () => {
		$("#" + Session.get('editId')).submit();
		$('#edit-modal').modal('hide');
	});
});
