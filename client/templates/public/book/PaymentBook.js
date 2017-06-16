Template.PaymentBook.onCreated(function () {
    this.createAccount = new ReactiveVar(false);
});

Template.PaymentBook.onRendered(() => {

});

Template.PaymentBook.helpers({
  'createAccount': () => Template.instance().createAccount.get()
});

Template.PaymentBook.events({
  'change [name="createAccount"]': (event, template) => {
    const val = $("[name='createAccount']:checked").val();
    if(val === 'yes') {
      template.createAccount.set(true);
    } else {
      template.createAccount.set(false);
    }
  },
});
