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
