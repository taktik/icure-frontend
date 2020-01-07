import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {PolymerElement, html} from '@polymer/polymer';
import {IronValidatorBehavior} from "@polymer/iron-validator-behavior";
class HtInamiValidator extends mixinBehaviors([IronValidatorBehavior], PolymerElement) {
    static get is() {
        return 'ht-inami-validator';
    }

    static get properties() {
        return {
            api :{
                type : Object
            },
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
        return !value || this.api.patient().checkInami(value+"")
    }
}

customElements.define(HtInamiValidator.is, HtInamiValidator);
