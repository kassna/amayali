Template.InputTextBook.onRendered(() => {
  const attr = Template.instance().data.attribute;
  if (Session.get(attr)) {
    $(`#${attr}`).parent().addClass('input--filled');
  }
});

Template.InputTextBook.helpers({
  inputValue: () => Session.get(Template.instance().data.attribute)
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
  'change .input__field': (event, template) => {
    Session.set(Template.instance().data.attribute, $(event.target).val());
  },
});
