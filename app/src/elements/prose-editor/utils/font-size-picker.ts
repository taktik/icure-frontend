import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-item/paper-item';

import {customElement, property} from "@polymer/decorators";

@customElement('font-size-picker')
export class FontSizePicker extends PolymerElement {

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

            .color {
                box-sizing: border-box;
                width: var(--polymer-color-picker-color-size, 20px);
                height: var(--polymer-color-picker-color-size, 20px);
                display: inline-block;
                padding: 0;
                margin: 0;
                cursor: pointer;
            }

            .color:hover {
                background: currentColor;
                transform: scale(1.3, 1.3);
            }

            paper-menu-button {
                padding: 0;
            }
            
            paper-button{
                font-size: 14px;
                font-weight: 400;
                text-transform: unset;
                height: 40px;
                width: 56px;
                min-width: 56px;
                justify-content: space-between;
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

            .fontSize {
                padding: 2px 10px;
                border-bottom: 1px solid #aaa;
                cursor: pointer;
                font-size: .9rem;
            }

            .fontSize.fontSize18 {
                border-bottom: 0;
            }

        </style>

        <paper-menu-button id="fontSizeMenuButton" vertical-offset="42" horizontal-offset="0">
            <paper-button
                    id="fontButton"
                    slot="dropdown-trigger"
                    alt="font size picker">
                    <span>[[_fontSize(fontSize)]]</span>
                    <iron-icon icon="arrow-drop-down"></iron-icon>
            </paper-button>
            <div slot="dropdown-content" class="dropdown-content box" id="box">
                <template is="dom-repeat" items="{{fontSizeList}}">
                    <paper-item id="[[item]]" on-tap="_onTap" class$="fontSize fontSize[[index]]">[[item]]</paper-item>
                </template>
            </div>
        </paper-menu-button>
`
  }

  $: { editor: HTMLElement, content: HTMLElement } | any

  @property({type: String, notify: true})
  fontSize?: string = ""

  @property({type: Array})
  fontSizeList = ["6 px","7 px","8 px","9 px","10 px","12 px","14 px","16 px","20 px","24 px","32 px","48 px","72 px"]

  constructor() {
    super()
  }

  _onTap(event : any) {
    this.set('fontSize', event.target.id)

    this.dispatchEvent(new CustomEvent('font-size-picker-selected', {detail: {value: this.fontSize}, bubbles:true, composed:true} as EventInit) )

    this.$.fontSizeMenuButton.opened = false
  }

  _fontSize(fontSize? : string) {
    return fontSize && fontSize.length ? fontSize : "11 px"
  }

}


