Template.ButtonSelectBook.helpers({
  isSelected: id => Session.get(Template.instance().data.attribute) === id
});

Template.ButtonSelectBook.events({
  'click .button-select button': (event, template) => {
    event.preventDefault();
    const $button = $(event.target);
    $button.parent().find('button').removeClass('active');
    $button.addClass('active');
    Session.set(template.data.attribute, $button.attr('data-id'));
  }
});
