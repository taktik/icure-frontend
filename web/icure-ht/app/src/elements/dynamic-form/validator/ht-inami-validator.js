class HtInamiValidator extends Polymer.mixinBehaviors([Polymer.IronValidatorBehavior], Polymer.Element) {
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
