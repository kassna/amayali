AutoForm.hooks({
    insertTherapistFormPublic: {
        onSuccess: () => FlowRouter.go('therapist-success')
    }
});
