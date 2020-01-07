import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-item/paper-item';

import {customElement, property} from "@polymer/decorators";

@customElement('heading-picker')
export class HeadingPicker extends PolymerElement {

  static get template() {
    return html`        <style>
            .box {
                font-size: 0;
                overflow: hidden;
                -ms-flex-direction: column;
                -webkit-flex-direction: column;
                flex-direction: column;
                display: -ms-flexbox;
                display: -webkit-flex;
                display: flex;
                -ms-flex-wrap: wrap;
                -webkit-flex-wrap: wrap;
                flex-wrap: wrap;
                overflow: hidden;
            }

            paper-menu-button {
                padding: 0;
            }

            paper-button{
                font-size: 14px;
                font-weight: 400;
                text-transform: unset;
                height: 40px;
                justify-content: space-between;
                width: 80px; 
                min-width: 80px;
                padding: .7em 0;
            }

            paper-button span{
                flex-grow: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            iron-icon{
                height: 16px;
                width: 16px;
                min-width: 16px;
                min-height: 16px;
            }

            .dropdown-content {
                border:1px solid #ccc
            }

            .heading {
                padding: 2px 10px;
                border-bottom: 1px solid #aaa;
                cursor: pointer;
                font-size: .9rem;
            }

            .heading.heading5 {
                border-bottom: 0;
            }

        </style>

        <paper-menu-button id="headingMenuButton" vertical-offset="42" horizontal-offset="-5">
            <paper-button
                    id="headingButton"
                    slot="dropdown-trigger"
                    alt="heading picker">
                    <span>[[_heading(heading)]]</span>
                    <iron-icon icon="arrow-drop-down"></iron-icon>
            </paper-button>
            <div slot="dropdown-content" class="dropdown-content box" id="box">
                <template is="dom-repeat" items="{{headingList}}">
                    <paper-item id="[[item]]" on-tap="_onTap" class$="heading heading[[index]]">[[item]]</paper-item>
                </template>
            </div>
        </paper-menu-button>
`
  }

  $: { editor: HTMLElement, content: HTMLElement } | any

  @property({type: String, notify: true})
  heading?: string = ""

  @property({type: Array})
  headingList = ["Normal", "Heading 1", "Heading 2", "Heading 3", "Heading 4", "Heading 5"]

  _onTap(event : any) {
    this.set('heading', event.target.id)
    this.dispatchEvent(new CustomEvent('heading-picker-selected', {detail: {value: this.heading}, bubbles:true, composed:true} as EventInit) )

    this.$.headingMenuButton.opened = false
  }

  _heading(heading? : string) {
    return heading && heading.length ? heading : "Normal"
  }
}
