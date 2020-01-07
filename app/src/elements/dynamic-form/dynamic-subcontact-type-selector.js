import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "./elements/tk-localizer";
class DynamicSubcontactTypeSelector extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="icpc-styles">
            paper-menu-button {
                padding: 0;
                color: grey;
            }

            paper-icon-button {
                padding: 0 4px 8px 4px;
                width: 20px;
                height: 20px;
            }

            .link .colour-code span {
                content: '';
                display: inline-block;
                height: 6px;
                width: 6px;
                border-radius: 3px;
                margin-right: 3px;
                margin-bottom: 1px;
            }

            paper-listbox {
                max-height: 33vh;
                padding: 0;
            }

            paper-item {
                font-size: var(--font-size-normal);
                min-height: 24px;
                padding: 0 8px;
            }

            paper-item.link:hover {
                cursor: pointer;
                background: var(--app-background-color-dark);
            }

            .dropdown_icon{
                height: 12px;
            }

            .status_icon{
                height: 8px;
            }

            .stat_act{
                color: var( --paper-green-400);
            }

            .stat_pass_rev{
                color: var(--paper-orange-400);
            }

            .stat_pass_n_rev{
                color: var( --paper-red-400);
            }

            .stat_not_pres{
                color: var(--paper-grey-400);
            }

        </style>
            <paper-menu-button id="subType" horizontal-align="left" dynamic-align="true" opened="{{typeOpened}}" allow-outside-scroll="">
                <paper-icon-button id="hc_menu" class="form-title-bar-btn" icon="folder" slot="dropdown-trigger" alt="menu" on-tap="_showSubContactType"></paper-icon-button>
                <paper-listbox slot="dropdown-content">
                    <template is="dom-repeat" items="[[subcontactType]]" as="sct">
                        <paper-item id="[[sct.id]]" class="link" on-tap="addSubcontactType">[[_getSubcontactTypeLabel(sct.label)]]</paper-item>
                    </template>
                </paper-listbox>
            </paper-menu-button>
        <paper-tooltip position="right" for="hc_menu">[[localize('contact_type','Contact type',language)]]</paper-tooltip>
`;
  }

  static get is() {
      return 'dynamic-subcontact-type-selector';
  }

  static get properties() {
      return {
          api: {
              type: Object
          },
          representedObject: {
              type: Object
          },
          typeOpened: {
              type: Boolean,
              value: false,
              observer: '_typeOpened'
          },
          statusOpened: {
              type: Boolean,
              value: false
          },
          openedOnce: {
              type: Boolean,
              value: false
          },
          initialised: {
              type: Boolean,
              value: false
          },
          delayed: {
              type: Boolean,
              value: true
          },
          subcontactType: {
              type: Array,
              value: () => []
          }
      };
  }

  static get observers() {
      return [];
  }

  ready() {
      super.ready();
      if (this.delayed) {
          setTimeout(() => this.set('initialised', true), 100)
      }
  }

  _typeOpened(b) {
      this.set('openedOnce', b || this.openedOnce)
  }

  _showSubContactType(e) {
      e.preventDefault();
      e.stopPropagation();

      if(e.target.id) {
          this.root.querySelector('#subType').open();
      }

  }

  addSubcontactType(e) {
      const type = this.subcontactType && this.subcontactType.find(type => e.target.id === type.id) || null
      if (!type) {
          return;
      }
      this.dispatchEvent(new CustomEvent('link-to-subcontact-type', {bubbles: true, composed: true, detail: { type: type} }));

  }

  _getSubcontactTypeLabel(label){
      return label[this.language]
  }
}
customElements.define(DynamicSubcontactTypeSelector.is, DynamicSubcontactTypeSelector);
