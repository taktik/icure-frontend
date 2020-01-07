import iban from 'iban';

class HtIbanValidator extends Polymer.mixinBehaviors([Polymer.IronValidatorBehavior], Polymer.Element) {
    static get is() {
        return 'ht-iban-validator';
    }

    static get properties() {
        return {
            pattern: {
                type: String,
                value: null
            }
        };
    }

    constructor() {
        super();
    }

    validate(value) {
        return !value || iban.isValid(value)
    }
}

customElements.define(HtIbanValidator.is, HtIbanValidator);
