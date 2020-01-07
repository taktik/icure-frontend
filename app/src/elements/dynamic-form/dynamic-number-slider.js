/*<link rel="import" href="../../../bower_components/paper-slider/paper-slider.js">*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import './dynamic-link.js';

import '../../styles/paper-input-style.js';
class DynamicNumberSlider extends Polymer.TkLocalizerMixin(Polymer.Element) {
  static get template() {
    return Polymer.html`
        <style include="paper-input-style">
            :host {
                position: relative;
                flex-grow: var(--dynamic-field-width, 25);
                min-width: calc(var(--dynamic-field-width-percent, '25%') - 12px);
                padding: 0 6px;
                --paper-font-caption_-_line-height: var(--font-size-normal);
                box-sizing: border-box;
            }

            dynamic-link {
                position: absolute;
                right: 0;
                top: 4px;
            }

            .modified-icon {
                width: 18px;
            }

            .modified-previous-value {
                color: var(--app-text-color-disabled);
                text-decoration: line-through;
                font-style: italic;
            }

            .modified-before-out {
                color: var(--app-secondary-color-dark);
                text-align: right;
                float: right;
                font-style: italic;
                border-bottom: 1px dotted var(--app-secondary-color-dark);
            }

            .modified-after-out {
                color: var(--app-secondary-color-dark);
                text-align: right;
                float: right;
                font-style: italic;
                border-bottom: 1px dotted var(--app-secondary-color-dark);
            }

            .label-span{
                display: block;
                max-width: calc(100% - 20px);
                text-overflow: ellipsis;
                float: left;
                overflow: hidden;
            }

        </style>

        <template is="dom-if" if="[[readOnly]]">
            <span class="label-span">[[localize(label,label,language)]] : [[value]] ([[_getTextValue(value)]])</span>
            <!--<paper-slider id="ratings" pin snaps min="[[minimum]]" max="[[maximum]]" step="[[step]]" value="{{value}}" disabled></paper-slider>-->
        </template>
        <template is="dom-if" if="[[!readOnly]]">
            <span class="label-span">[[localize(label,label,language)]] : [[value]] ([[_getTextValue(value)]])</span>
            <!--<paper-slider id="ratings" pin snaps min="[[minimum]]" max="[[maximum]]" step="[[step]]" value="{{value}}"></paper-slider>-->
            <dynamic-link i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" linkables="[[linkables]]" api="[[api]]" represented-object="[[label]]"></dynamic-link>
        </template>
`;
  }

  static get is() {
      return 'dynamic-number-slider';
  }

  static get properties() {
      return {
          wasModified: {
              type: Boolean
          },
          isModifiedAfter: {
              type: Boolean
          },
          readOnly: {
              type: Boolean,
              value: false
          },
          lastModified: {
              type: String
          },
          label: {
              type: String
          },
          value: {
              type: Number,
              notify: true,
              observer: '_valueChanged'
          },
          width: {
              type: Number,
              value: 24,
              observer: '_widthChanged'
          },
          minimum: {
              type: Number,
              value : 0
          },
          maximum:{
              type : Number,
              value : 10
          },
          step:{
              type: Number,
              value:1
          },
          textValues:{
              type: Array,
              value: []
          }
      };
  }

  constructor() {
      super();
  }

  _widthChanged(width) {
      this.updateStyles({ '--dynamic-field-width': width, '--dynamic-field-width-percent': '' + width + '%' });
  }

  _valueChanged(value) {
      if (!this.readOnly) {
          this.dispatchEvent(new CustomEvent('field-changed', {
              detail: {
                  context: this.context,
                  value: this.value
              }
          }));

      }

  }

  _getTextValue(){
      return "text value of "+this.value;
  }
}

customElements.define(DynamicNumberSlider.is, DynamicNumberSlider);
