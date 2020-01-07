import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-item/paper-item';

import {customElement, property} from "@polymer/decorators";

@customElement('font-picker')
export class FontPicker extends PolymerElement {

  static get template() {
    return html`<style>
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
                justify-content: space-between;
                width: 110px; 
                min-width: 110px;
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

            .font {
                padding: 2px 10px;
                border-bottom: 1px solid #aaa;
                cursor: pointer;
                font-size: .9rem;
            }

            .font.font38 {
                border-bottom: 0;
            }

        </style>

        <paper-menu-button id="fontMenuButton" vertical-offset="42" horizontal-offset="-3">
            <paper-button
                    id="fontButton"
                    slot="dropdown-trigger"
                    alt="font picker">
                    <span>[[_font(font)]]</span>
                    <iron-icon icon="arrow-drop-down"></iron-icon>
            </paper-button>
            <div slot="dropdown-content" class="dropdown-content box" id="box">
                <template is="dom-repeat" items="{{fontList}}">
                    <paper-item style$="font-family: [[item]];" id="[[item]]" on-tap="_onTap" class$="font font[[index]]">[[item]]</paper-item>
                </template>
            </div>
        </paper-menu-button>`
  }

  $: { editor: HTMLElement, content: HTMLElement } | any

  @property({type: String, notify: true, observer: '_fontChanged'})
  font?: string = ""

  @property({type: Array})
  fontList = ["Alegreya","Barlow","Barlow Condensed","Cardo","Crete Round","EB Garamond","Exo 2","Exo","Fjalla One","Great Vibes","Indie Flower","Josefin Sans","Kurale","Libre Baskerville","Lobster","Lora","Maven Pro","Monoton","Montserrat","Montserrat Alternates","Nanum Myeongjo","Neucha","Old Standard TT","Open Sans","Oswald","Pathway Gothic One","Poiret One","Poppins","Quattrocento","Quattrocento Sans","Quicksand","Raleway","Roboto","Roboto Condensed","Source Serif Pro","Spectral","Teko","Tinos","Vollkorn"]

  _onTap(event : any) {
    this.set('font', event.target.id)

    this.dispatchEvent(new CustomEvent('font-picker-selected', {detail: {value: this.font}, bubbles:true, composed:true} as EventInit) )

    this.$.fontMenuButton.opened = false
  }

  _font(font? : string) {
    return font && font.length ? font : "Font"
  }

  _fontChanged(font? : string) {
    this.$.fontButton.style.fontFamily = this.font ?  this.font : "Roboto"
  }

}


