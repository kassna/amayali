Template.Book.onRendered(() => {
  $('body').on('focus', '.input__field', event => {
    $(event.target).parent().addClass('input--filled');
  });

  $('body').on('blur', '.input__field', event => {
    let $input = $(event.target);
    if($input.val().trim() === '') {
      $input.parent().removeClass('input--filled');
    }
  });

  $('body').on('change', '.selectpicker', event => {
    const $select = $(event.target);
    if(!$select.val()) {
      $select.parents('.bootstrap-select').find('button').addClass('not-selected');
    } else {
      $select.parents('.bootstrap-select').find('button').removeClass('not-selected');
    }
  });
});
