import './dynamic-link.js';
import '../../styles/paper-input-style.js';
import "@vaadin/vaadin-date-picker/vaadin-date-picker-light"

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class DynamicDateField extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
		<style include="paper-input-style">
			:host {
				flex-grow: var(--dynamic-field-width, 25);
				min-width: calc(var(--dynamic-field-width-percent, '25%') - 12px);
				margin: 0 6px;
				position: relative;
				--paper-font-caption_-_line-height: var(--font-size-normal);
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

			iron-input {
				width: 100%;
				display : block;
			}

			input{
				border:none;
				width: calc(100% - 22px);
				outline: 0;
				background:none;
				font-size: var(--font-size-normal);
				height: 24px;
				line-height: var(--font-size-normal);
				padding: 0;
			}

			iron-icon{
				color: var(--app-text-color);
			}



			paper-input-container{
				--paper-input-container-input: {
					height: 22px;
					font-size: var(--font-size-normal);
					line-height: var(--font-size-normal);
					padding: 0 8px;
					box-sizing: border-box;
					background: var(--app-input-background-color);
					border-radius: 4px 0 0 0;
				};
				--paper-input-suffix: {
					background: var(--app-input-background-color);
					padding: 2px 2px 0;
					box-sizing: border-box;
					border-radius: 0 4px 0 0;
					height: 22px;
				}
			}
			
			#date-picker{
                display : block	;			
            }

		</style>


		<template is="dom-if" if="[[readOnly]]">
			<paper-input-container always-float-label="true" disabled="">
				<label slot="label">[[localize(label,label,language)]]
					<template is="dom-if" if="[[wasModified]]">
						<span class="modified-before-out">[[localize('mod','modified',language)]] [[lastModified]] <iron-icon class="modified-icon" icon="schedule"></iron-icon></span>
					</template>
					<template is="dom-if" if="[[isModifiedAfter]]">
						<span class="modified-after-out">[[localize('obs_val','obsolete value',language)]]<iron-icon class="modified-icon" icon="report-problem"></iron-icon></span>
					</template>
				</label>
				<vaadin-date-picker-light id="date-picker-ro" accuracy="{{accuracy}}" class="custom-theme paper-input-input" i18n="[[i18n]]" label="[[label]]" value="{{dateAsString}}" min="{{dateAsString}}" max="{{dateAsString}}" slot="input" attrforvalue="value" disabled="">
					<iron-input>
						<input value="{{dateValue}}" readonly="">
					</iron-input>
				</vaadin-date-picker-light>
				<iron-icon icon="icons:today" slot="suffix"></iron-icon>
			</paper-input-container>
		</template>
		<template is="dom-if" if="[[!readOnly]]">
			<paper-input-container always-float-label="true">
				<label slot="label">[[localize(label,label,language)]]
					<template is="dom-if" if="[[wasModified]]">
						<span class="modified-before-out">[[localize('mod','modified',language)]] [[lastModified]] <iron-icon class="modified-icon" icon="schedule"></iron-icon></span>
					</template>
					<template is="dom-if" if="[[isModifiedAfter]]">
						<span class="modified-after-out">[[localize('obs_val','obsolete value',language)]]<iron-icon class="modified-icon" icon="report-problem"></iron-icon></span>
					</template>
				</label>
				<vaadin-date-picker-light id="date-picker" accuracy="{{accuracy}}" class="custom-theme paper-input-input" i18n="[[i18n]]" label="[[label]]" value="{{dateAsString}}" slot="input"  attrForValue="value" can-be-fuzzy="[[!fullDateMode]]">
                    <iron-input>
                        <input value="{{dateValue}}">
                    </iron-input>
				</vaadin-date-picker-light>
				<iron-icon icon="icons:today" slot="suffix" on-tap="_openDatePicker"></iron-icon>
			</paper-input-container>
			<dynamic-link i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" linkables="[[linkables]]" represented-object="[[key]]" api="[[api]]"></dynamic-link>
		</template>
`;
  }

  static get is() {
      return 'dynamic-date-field';
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
          displayTime: {
              type: Boolean
          },
          dateAsString: {
              type: String,
              observer: '_dateAsStringChanged'
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
          fullDateMode:{
              type: Boolean,
              value: true,
              observer: '_fullDateModeChanged'
          },
          accuracy:{
              type: String,
              value: "day",
              notify:true
          }
      };
	}

  constructor() {
      super();
	}

  _widthChanged(width) {
      this.updateStyles({ '--dynamic-field-width': width, '--dynamic-field-width-percent': '' + width + '%' });
	}

  _valueChanged(date) {
      if (!date) {
          this.set("accuracy","day");
          this.dateAsString && this.set('dateAsString', null);return;
      }
      this.set('displayTime', date > 99991231);
      this.set("accuracy",date%100!==0 ? "day" : date%10000!==0 ? "month" : "year");
      const dateAsString = ('' + date).replace(/([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{6})/, '$1-$2-$3').replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, '$1-$2-$3');
      if (dateAsString !== this.dateAsString) {
          this.set('dateAsString', dateAsString);
      }
	}

  _dateAsStringChanged(dateAsString) {
      if (!dateAsString) {
          this.value && this.set('value', null);
          this.dispatchEvent(new CustomEvent('field-changed', { detail: { context: this.context, value: null } }));
          return;
      }
      const date = parseInt(dateAsString.replace(/(....)-(..)-(..)/, '$1$2$3')) * (this.displayTime ? 1000000 : 1);
      if ((date || this.value) && date !== this.value) {
          this.set('value', date);
          this.dispatchEvent(new CustomEvent('field-changed', { detail: { context: this.context, value: date } }));
      }
	}

  _openDatePicker() {
      this.shadowRoot.querySelector(this.readOnly ? '#date-picker-ro' : '#date-picker').open();
	}
}

customElements.define(DynamicDateField.is, DynamicDateField);
