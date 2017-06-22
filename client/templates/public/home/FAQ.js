Template.FAQ.onRendered(() => {
  //Add active class for opened items
  $('.collapse').on('show.bs.collapse', function (e) {
      $(this).closest('.panel').find('.panel-heading').addClass('active');
  });

  $('.collapse').on('hide.bs.collapse', function (e) {
      $(this).closest('.panel').find('.panel-heading').removeClass('active');
  });

  //Add active class for pre opened items
  $('.collapse.in').each(function(){
      $(this).closest('.panel').find('.panel-heading').addClass('active');
  });
});
