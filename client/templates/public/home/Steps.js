Template.Steps.events({
  'mouseenter .how-works .item': event => {
    const item = $(event.target).attr('data-item');
    $(`.how-works .lead[data-item='${item}']`).addClass('active');
  },
  'mouseleave .how-works .item': event => {
    const item = $(event.target).attr('data-item');
    $(`.how-works .lead[data-item='${item}']`).removeClass('active');
  },
});
