/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import moment from 'moment/src/moment';
import _ from 'lodash/lodash';

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "./elements/tk-localizer";
class HtAdminManagementParent extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="shared-styles">
            :host {
                display: block;
            }

            :host *:focus{
                outline:0!important;
            }

            .off-med-hou-panel{
                height: 100%;
                width: 100%;
                padding: 0 20px;
                box-sizing: border-box;
                position:relative;
            }
        </style>

        <div class="off-med-hou-panel">
            <h4>[[localize('man_off_med_hou', 'Management - Office / Medical house', language)]]</h4>
        </div>
`;
  }

  static get is() {
      return 'ht-admin-management-parent'
  }

  static get properties() {
      return {
          api: {
              type: Object,
              noReset: true
          },
          user: {
              type: Object,
              noReset: true
          }
      }
  }

  static get observers() {
      return [];
  }

  constructor() {
      super()
  }

  ready() {
      super.ready()
  }
}

customElements.define(HtAdminManagementParent.is, HtAdminManagementParent)
