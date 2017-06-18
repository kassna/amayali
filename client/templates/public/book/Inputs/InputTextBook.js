Template.InputTextBook.onRendered(() => {
  const attr = Template.instance().data.attribute;
  console.log(attr, Session.get(attr));
  if (Session.get(attr)) {
    $(`[name="${attr}"]`).parent().addClass('input--filled');
  }
});

Template.InputTextBook.helpers({
  inputValue: function() { return Session.get(this.attribute); },
});

Template.InputTextBook.events({
  'focus .input__field': event => {
    $(event.target).parent().addClass('input--filled');
  },
  'blur .input__field': event => {
    let $input = $(event.target);
    if($input.val().trim() === '') {
      $input.parent().removeClass('input--filled');
    }
  },
  'change .input__field': function (event, template) {
    Session.set(this.attribute, $(event.target).val());
  },
});
