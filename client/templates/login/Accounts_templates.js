// We identified the templates that need to be overridden by looking at the available templates
// here: https://github.com/meteor-useraccounts/unstyled/tree/master/lib
Template['override-atPwdFormBtn'].replaces('atPwdFormBtn');
Template['override-atPwdForm'].replaces('atPwdForm');
Template['override-atTextInput'].replaces('atTextInput');
Template['override-atTitle'].replaces('atTitle');
Template['override-atError'].replaces('atError');

Template.atError.helpers({
  showErrors: (errors) => {
    let newErrors = [];
    for (error of errors) {
      if(_.isPlainObject(error)) {
        newErrors.push(`<b>${T9n.get(_.camelCase(error.field))}</b>: ${T9n.get(error.err)}`);
      } else {
        newErrors.push(T9n.get(error));
      }

    }
    return newErrors;
  }
});

Template.termsForm.events({
  'change #termsInput': event => {
    $('#termsInput').prop('checked', true);
    swal({
			title: TAPi18n.__('admin.general.confirm', null),
			text: TAPi18n.__('login.termsModal', null),
			type: "warning",
      showCancelButton: true,
      cancelButtonText: TAPi18n.__('login.cancel', null),
			confirmButtonColor: "#DD6B55",
      confirmButtonText: TAPi18n.__('login.accept', null),
      allowEscapeKey: false,
      allowOutsideClick: false,
		}, () => {
			FlowRouter.go('home');
		});
  }
});
