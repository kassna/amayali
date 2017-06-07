Template.MainLayout.onCreated(function() {
	if (!Session.get('currentCity')) {
		Session.set('currentCity', '');
	}

	$('body').on('click', '.confirm-remove', (event) => {
		swal({
			title: TAPi18n.__('admin.general.confirm', null),
			text: TAPi18n.__('admin.general.cantUndone', null),
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: TAPi18n.__('admin.general.confirmDelete', null),
		}, () => {
			$(event.target).parent().find(".delete-btn").trigger("click");
			Bert.alert( TAPi18n.__('admin.general.successDelete', null), 'success', 'growl-top-right' );
		});
	});

	$('body').on('click', '#logout', () => {
		AccountsTemplates.logout();
	})

	$('body').on('click', '.scroll-top', () => {
		$('html,body').animate({ scrollTop: 0}, 0, 'easeInOutQuart');
		$(".nav-toggler").trigger('click');
	});
});
