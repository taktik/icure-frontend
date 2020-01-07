import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "./elements/tk-localizer";
class RelatedCodeLink extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style>
            paper-menu-button {
                padding: 0;
                color: grey;
                z-index: 1000;
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

            paper-item {
                font-size: 14px;
                min-height: 30px;
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


        <template is="dom-if" if="[[linkables]]">

            <paper-menu-button id="mb" horizontal-align="left" dynamic-align="true" allow-outside-scroll="">
                <paper-icon-button id="hc_menu" class="form-title-bar-btn" icon="link" slot="dropdown-trigger" alt="menu" on-tap="_show"></paper-icon-button>
                <paper-listbox slot="dropdown-content">
                    <template is="dom-repeat" items="[[linkables]]" as="nmcl">
                        <paper-item id="[[nmcl.id]]" class="link" on-tap="link">[[nmcl.code]]</paper-item>
                    </template>
                </paper-listbox>
            </paper-menu-button>

        </template>
`;
  }

  static get is() {
      return 'related-code-link';
  }

  static get properties() {
      return {
          api: {
              type: Object
          },
          linkables: {
              type: Array
          },
          representedObjectId:{
              type: Object
          }
      };
  }

  static get observers() {
      return [];
  }

  ready() {
      super.ready();
  }


  _show(e) {
      e.preventDefault();
      e.stopPropagation();

      if(e.target.id === "stat_menu"){
          this.root.querySelector('#stat').open();
      }else{
          this.root.querySelector('#mb').open();
      }

  }

  link(e) {
      const nmcl = this.linkables && this.linkables.find(nmcl => e.target.id === nmcl.id) || null
      if (!nmcl) {
          return;
      }
      this.dispatchEvent(new CustomEvent('link-nmcl-to-related-code', { bubbles: true, composed: true, detail: { relativeCode: nmcl.code, parentId: this.representedObjectId } }));

  }
}
customElements.define(RelatedCodeLink.is, RelatedCodeLink);
