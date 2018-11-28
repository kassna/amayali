import {motStaticOptions} from '../../../../collections/therapists';

/**
 * Initializes the therapist form and handles the logic of showing and hiding
 * text fields when checking certain radio buttons.
 *
 * @author Matthias Bräuer <a01679521@itesm.mx>
 */
class TherapistFormHelper {
    /**
     * Id of *motOther* (mot = Means of Transportation) text field
     *
     * @type {string}
     */
    motOtherId = '#motOther';

    /**
     * The therapist form template
     */
    view;

    /**
     * The value of **mot** of the current document that was freely entered by the user.
     */
    motOtherValue;

    /**
     * Sets all necessary events and hooks for *template*.
     *
     * @param template
     */
    init = (template) => {
        const self = this;

        template.onCreated(function () {
            this.autorun(() => {
                this.subscribe('locations');
            });
        });

        template.onRendered(function () {
            this.autorun(function () {
                self.view = Template.instance();

                Tracker.afterFlush(function () {
                    self.addMotInput();
                    self.setMotOtherValue();
                });
            });
        });

        template.events({
            'change input[name="mot"]': this.setMotOtherDisplayState
        });

        AutoForm.addHooks('editTherapistForm', {
            docToForm: (doc) => {
                if (motStaticOptions.every((entry) => entry !== doc.mot)) {
                    this.motOtherValue = doc.mot;

                    doc.mot = 'other';
                } else {
                    this.motOtherValue = undefined;
                }

                this.setMotOtherValue();

                return doc;
            }
        });

        AutoForm.hooks({
            insertTherapistFormPublic: {
                after: {
                    insert: function (error, result) {
                        if (!error) {
                            Meteor.call('sendNewTherapist', result);
                        }
                    }
                }
            }
        });

        AutoForm.addHooks(['insertTherapistForm', 'insertTherapistFormPublic', 'editTherapistForm'], {
            before: {
                update: (doc) => {
                    doc.$set = this.updateMot(doc.$set);

                    return doc;
                },
                insert: this.updateMot
            }
        });
    };

    /**
     * Sets **mot** of **doc** to the value of mot input
     * if the referring radio button is *other*.
     *
     * @param doc - The current update document
     * @returns {*}
     */
    updateMot = (doc) => {
        if (this.isOther(doc.mot)) {
            doc.mot = $(this.view.find(this.motOtherId)).val();
        }

        return doc;
    };

    /**
     * Checks if element is *other* or not.
     * @see isOther
     *
     * @param el - The html element
     * @returns {boolean}
     */
    isOtherChecked = (el) => this.isOther(el.value);

    /**
     * Checks if *value* is equal *'other'*.
     *
     * @param value - The value
     * @returns {boolean}
     */
    isOther = (value) => value === 'other';

    /**
     * Hides or shows *motOther* (mot = Means of Transportation)
     * depending on the checked radio button.
     *
     * @param ev - The triggered event object
     * @param view - The current template view
     */
    setMotOtherDisplayState = (ev, view) => {
        const motOther = $(view.find(this.motOtherId));

        this.isOtherChecked(view.find(ev.currentTarget)) ? motOther.show() : motOther.hide();
    };

    /**
     * Sets the value of input with id = **this.motOtherId** and shows or hides the input
     * depending if **this.motOtherValue** is set or not.
     */
    setMotOtherValue = () => {
        const motOther = $(this.view.find(this.motOtherId));

        motOther.val(this.motOtherValue);

        this.motOtherValue ? motOther.show() : motOther.hide();
    };

    /**
     * Prepends a input field to **mot** element.
     */
    addMotInput = () => {
        const motOther = $('<input>', {
            class: 'form-control',
            id: this.motOtherId.replace('#', ''),
            type: 'text'
        });

        $(this.view.find('[data-schema-key="mot"]')).prepend(motOther);
    };
}

new TherapistFormHelper().init(Template.TherapistsForm);
