import _ from 'lodash/lodash';

export const TkLocalizerMixin = superClass => class extends superClass {
    constructor() {
        super();
    }

    static get properties() {
        return {
            resources: {
                type: Object
            },
            language: {
                type: String
            }
        };
    }

    ready() {
        if (!this.resources || !this.resources.en) {
            // console.log('Missing resources for ', this.tagName);
        }
        if (!this.language) {
            // console.log('Missing language for ', this.tagName);
        }
        super.ready();
    }

    localize(key, defaultValue) {
        const trns = this.resources && this.resources[this.language] && this.resources[this.language][key];
        if (!trns) {
            // console.log('Translation is missing for', this.language, key);
        }
        return trns || defaultValue;
    }

    localizeObjectKey(obj, key) {
        let k
        k= key+_.capitalize(this.language)
        if (obj[k] !== undefined) { return obj[k] }
        k = key+this.language
        if (obj[k] !== undefined) { return obj[k] }
        return null
    }
};
