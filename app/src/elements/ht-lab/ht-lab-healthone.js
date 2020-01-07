import '../filter-panel/filter-panel.js';
import '../dynamic-form/dynamically-loaded-form.js';
import '../dynamic-form/entity-selector.js';

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class HtLabHealthone extends TkLocalizerMixin(PolymerElement) {
    static get is() {
				return 'ht-lab-healthone';
    }

    static get properties() {
				return {
            api: {
                type: Object
            },
            labResults:{
                type: Object
            },
            healthone:{
                type: Object,
                value: {}
            }
				};
    }

    static get observers() {
				return ['_parseHealthone(labResults)'];
    }

    constructor() {
				super();
    }

    ready(){
				super.ready();
    }

    _parseHealthone(){
				console.log("_parseHealthone");
				if(this.attachment) {
            console.log("have lab");
            let healthone = {};
            let lines = this.attachment.split(/\r?\n/);
            lines.forEach(line => {
                let columns = line.split("\\");
                switch (columns[0]) {
                    case "A1":
                        healthone.sender = columns[2] || null;
                        break;
                    case "A2":
                        healthone.patient = {
                            lastname: columns[2] || null,
                            firstname: columns[3] || null,
                            gender: columns[4] || null,
                            birthdate: columns[5] || null,
                        };
                        break;
                    case "A3":
                        if (!healthone.patient) healthone.patient = {};
                        healthone.patient.address = {
                            street: columns[2] || null,
                            postalcode: columns[3] || null,
                            locality: columns[4] || null
                        };
                        break;
                    case "A4":
                        healthone.request = {
                            protocol: columns[2] || null,
                            prescriber: columns[3] || null,
                            date: columns[4] || null,
                            type: columns[6] || null
                        };
                        break;
                    case "L1":
                        if (!healthone.datas) healthone.datas = [];
                        healthone.datas.push({
                            codeAnal: columns[2] || null,
                            nameAnal: columns[3] || null,
                            value: columns[4] || null,
                            unity: columns[5] || null,
                            code: columns[6] || null,
                            result: columns[7] || null
                        })
                        break;
                }
            });
            this.set("healthone",healthone)
				}else{
            console.log("don't have lab");
        }
    }

}

customElements.define(HtLabHealthone.is, HtLabHealthone);
