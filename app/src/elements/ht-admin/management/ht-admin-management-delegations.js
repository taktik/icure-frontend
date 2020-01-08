/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import "@vaadin/vaadin-grid/vaadin-grid"
import "@vaadin/vaadin-grid/vaadin-grid-column"

import _ from 'lodash/lodash';

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../../tk-localizer";
class HtAdminManagementDelegations extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="shared-styles">
            :host {
                display: block;
            }

            :host *:focus{
                outline:0!important;
            }

            .delegations-panel{
                height: 100%;
                width: 100%;
                padding: 0 20px;
                box-sizing: border-box;
                position:relative;
            }

            vaadin-grid.material {

                font-family: Roboto, sans-serif;
                --divider-color: rgba(0, 0, 0, var(--dark-divider-opacity));

                --vaadin-grid-cell: {
                    padding: 8px;
                };

                --vaadin-grid-header-cell: {
                    height: 64px;
                    color: rgba(0, 0, 0, var(--dark-secondary-opacity));
                    font-size: 12px;
                };

                --vaadin-grid-body-cell: {
                    height: 48px;
                    color: rgba(0, 0, 0, var(--dark-primary-opacity));
                    font-size: 13px;
                };

                --vaadin-grid-body-row-hover-cell: {
                    background-color: var(--paper-grey-200);
                };

                --vaadin-grid-body-row-selected-cell: {
                    background-color: var(--paper-grey-100);
                };

                --vaadin-grid-focused-cell: {
                    box-shadow: none;
                    font-weight: bold;
                };
            }

            vaadin-grid.material .cell {
                overflow: hidden;
                text-overflow: ellipsis;
                padding-right: 0;
            }

            vaadin-grid.material .cell.last {
                padding-right: 24px;
            }

            vaadin-grid.material paper-checkbox {
                --primary-color: var(--paper-indigo-500);
                margin: 0 24px;
            }

            vaadin-grid.material vaadin-grid-sorter .cell {
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            vaadin-grid.material vaadin-grid-sorter iron-icon {
                transform: scale(0.8);
            }

            vaadin-grid.material vaadin-grid-sorter:not([direction]) iron-icon {
                color: rgba(0, 0, 0, var(--dark-disabled-opacity));
            }

            vaadin-grid.material vaadin-grid-sorter[direction] {
                color: rgba(0, 0, 0, var(--dark-primary-opacity));
            }

            vaadin-grid.material vaadin-grid-sorter[direction=desc] iron-icon {
                transform: scale(0.8) rotate(180deg);
            }

            #delegationList {
                max-height: 90%;
            }

        </style>

        <div class="delegations-panel">
            <h4>[[localize('man_my_delg', 'Management - My delegations', language)]]</h4>

            <vaadin-grid id="delegationList" class="material" items="[[listOfDelegations]]">
                <vaadin-grid-column>
                    <template class="header">
                        [[localize('deleg_first_name','Name',language)]]
                    </template>
                    <template>
                        <div>[[item.firstName]] [[item.lastName]]</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">
                        [[localize('deleg_user_type','User type',language)]]
                    </template>
                    <template>
                        <div>[[item.type]]</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">
                        [[localize('deleg_type','Delegation type',language)]]
                    </template>
                    <template>
                        <div>[[item.delegationType]]</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">
                        [[localize('Id','Id',language)]]
                    </template>
                    <template>
                        <div>[[item.id]]</div>
                    </template>
                </vaadin-grid-column>

            </vaadin-grid>
        </div>
`;
  }

  static get is() {
      return 'ht-admin-management-delegations'
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
          },
          listOfDelegations:{
              type: Object,
              value: () => []
          }
      }
  }

  static get observers() {
      return ['_getDelegationOfUser(user)'];
  }

  constructor() {
      super()
  }

  ready() {
      super.ready()
  }

  _getDelegationOfUser(){
      this.set('listOfDelegations', [])

      const delegationsKeys = Object.keys(this.user.autoDelegations)

      if(delegationsKeys && delegationsKeys.length > 0){
          this.api.hcparty().getHealthcareParties(_(_.flatten(delegationsKeys.map(key => this.user.autoDelegations[key]))).uniq().value().map(del => del).join(',')).then(delegatesHcp => {
              delegationsKeys.forEach(key => {
                  this.user.autoDelegations[key].map(hcp => this.push('listOfDelegations', _.assign((delegatesHcp.find(dhcp => hcp === dhcp.id)), {delegationType: key})))
              })
          })
      }
  }
}

customElements.define(HtAdminManagementDelegations.is, HtAdminManagementDelegations)
