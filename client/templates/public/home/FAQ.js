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

Template.FAQ.helpers({
    clientQuestions: () => {
        return _.map([1,2,3,4,5], number => {
            return {
                number,
                question: TAPi18n.__(`landing.faq.users.${number}question`, null),
                answer: TAPi18n.__(`landing.faq.users.${number}answer`, null),
            };
        });
    },
    networkQuestions: () => {
        return _.map([1,2,3,4,5,6,7,8,9], number => {
            let toReturn = {
                number,
                question: TAPi18n.__(`landing.faq.network.${number}question`, null),
                answer: TAPi18n.__(`landing.faq.network.${number}answer`, null),
            }
            if (number === 2) {
                toReturn.additionalList = _.map([1,2,3,4,5,6], question => {
                    return {
                        item: TAPi18n.__(`landing.faq.network.2benefits.${question}`, null)
                    }
                });
            }
            return toReturn;
        });
    },
});
