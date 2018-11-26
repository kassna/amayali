import {ModalConfig} from './modalConfig';

Template.EditModal.onCreated(() => {
    // Trigger edit form submit
    $('body').on('click', '#target-edit', () => {
        $('#updateForm').submit();
        $('#editTherapistForm').submit();
    });
});

Template.EditModal.helpers({
    isTherapistForm: (type) => type === ModalConfig.therapistType
});

AutoForm.addHooks(['updateForm', 'editTherapistForm'], {
    onSuccess: () => {
        $('#edit-modal').modal('hide');
    }
});
