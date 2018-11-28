import {ModalConfig} from './modalConfig';

/**
 * Resets forms with id **insertTherapistForm** and **insertForm**.
 */
const resetForms = () => {
    const forms = [$('#insertTherapistForm'), $('#insertForm')];

    forms.forEach((form) => {
        if (form[0]) {
            form[0].reset();
        }
    });
};

Template.NewModal.onCreated(() => {
    const body = $('body');

    // Trigger insert form submit
    body.on('click', '#target-submit', () => {
        $('#insertForm').submit();
        $('#insertTherapistForm').submit();
    });

    body.on('click', '#target-cancel', () => {
        resetForms();
    });
});

Template.NewModal.helpers({
    isTherapistForm: (type) => type === ModalConfig.therapistType
});

AutoForm.addHooks(['insertForm', 'insertTherapistForm'], {
    onSuccess: () => {
        resetForms();

        $('#new-modal').modal('hide');
        Bert.alert(TAPi18n.__('admin.general.successInsert', null), 'success', 'growl-top-right');
    }
});
