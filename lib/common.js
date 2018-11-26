let emailField = AccountsTemplates.removeField('email');
let passwordField = AccountsTemplates.removeField('password');
AccountsTemplates.addField({
  _id: 'firstname',
  type: 'text',
  displayName: 'firstname',
  placeholder: 'firstname',
  required: true,
  minLength: 3
});
AccountsTemplates.addField({
  _id: 'lastname',
  type: 'text',
  displayName: 'lastname',
  placeholder: 'lastname',
  required: true,
  minLength: 3
});
AccountsTemplates.addField(emailField);
AccountsTemplates.addField(passwordField);
AccountsTemplates.addField({
  _id: 'terms',
  type: 'checkbox',
  template: 'termsForm',
});

AccountsTemplates.configure({
  showForgotPasswordLink: true,
  defaultLayout: 'LoginLayout',
  defaultTemplate: 'Auth_page',
  defaultContentRegion: 'main',
  defaultLayoutRegions: {},
});

AccountsTemplates.configureRoute('signIn', {
  name: 'signin',
  path: '/login'
});

AccountsTemplates.configureRoute('signUp', {
  name: 'join',
  path: '/registrate',
});

AccountsTemplates.configureRoute('forgotPwd');

AccountsTemplates.configureRoute('resetPwd', {
  name: 'resetPwd',
  path: '/recuperarContraseña',
});
