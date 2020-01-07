import iban from 'iban';

import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {PolymerElement, html} from '@polymer/polymer';
import {IronValidatorBehavior} from "@polymer/iron-validator-behavior";
class HtIbanValidator extends mixinBehaviors([IronValidatorBehavior], PolymerElement) {
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
