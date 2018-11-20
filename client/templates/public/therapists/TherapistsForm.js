import {Template} from 'meteor/templating';

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
    template;

    /**
     * Sets all necessary events and hooks for *template*.
     *
     * @param template
     */
    init = (template) => {
        this.template = template;

        this.template.onCreated(function () {
            this.autorun(() => {
                this.subscribe('locations');
            });
        });

        this.template.onRendered(this.addMotInput);

        this.template.events({
            'change input[name="mot"]': this.setMotOtherDisplayState
        });

        AutoForm.addHooks('insertTherapistForm', {
            before: {
                method: (doc) => {
                    if (this.isOther(doc.mot)) {
                        doc.mot = $(this.motOtherId).val();
                    }

                    return doc;
                }
            }
        });
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
     * @param template - The current template
     */
    setMotOtherDisplayState = (ev, template) => {
        const motOther = $(template.find(this.motOtherId));

        this.isOtherChecked(template.find(ev.currentTarget)) ? motOther.show() : motOther.hide();
    };

    addMotInput = () => {
        $('[data-schema-key="mot"]').prepend($('<input>', {
            class: 'form-control',
            id: this.motOtherId.replace('#', ''),
            type: 'text'
        }).hide());
    };
}

new TherapistFormHelper().init(Template.TherapistsForm);
