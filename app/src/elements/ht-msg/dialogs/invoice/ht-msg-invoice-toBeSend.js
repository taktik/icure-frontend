import '../../../dynamic-form/ckmeans-grouping.js'
import '../../../../styles/vaadin-icure-theme.js'
import '../../../../styles/spinner-style.js'
import '../../../../styles/scrollbar-style'
import '../../../../styles/shared-styles'
import '../../../../styles/buttons-style'
import '../../../../styles/dialog-style'
import '../../../ht-spinner/ht-spinner.js'

//TODO import "@polymer/iron-collapse-button/iron-collapse-button"
import "@polymer/iron-icon/iron-icon"
import "@polymer/paper-button/paper-button"
import "@polymer/paper-dialog/paper-dialog"
import "@polymer/paper-input/paper-input"
import "@polymer/paper-input/paper-textarea"
import "@polymer/paper-tooltip/paper-tooltip"
import "@vaadin/vaadin-grid/vaadin-grid"
import "@vaadin/vaadin-grid/vaadin-grid-column"
import "@vaadin/vaadin-grid/vaadin-grid-column-group"
import "@vaadin/vaadin-grid/vaadin-grid-sorter"
import "@vaadin/vaadin-grid/vaadin-grid-tree-toggle"
import '@vaadin/vaadin-accordion/vaadin-accordion'
import '@vaadin/vaadin-details/vaadin-details'

import moment from 'moment/src/moment'
import _ from 'lodash/lodash'
import * as models from 'icc-api/dist/icc-api/model/models'

import {PolymerElement, html} from '@polymer/polymer'
import {TkLocalizerMixin} from "../../../tk-localizer"

class HtMsgInvoiceToBeSend extends TkLocalizerMixin(PolymerElement) {
    static get template() {
        return html`
        
        <style include="shared-styles spinner-style scrollbar-style buttons-style dialog-style">
            .panel{
                margin: 5px;
                height: calc(100% - 20px);
                width: auto;
            }
            
            .panel-title{
                height: 40px;
                width: auto;
            }
            
            .panel-search{
                height: 40px;
                width: auto;
            }
            
            .panel-content{
                height: calc(100% - 120px);
                width: auto;
            }
            
            .panel-button{
                height: 40px;
                width: auto;             
            }
            
            .assurability--redStatus{
                    color: var(--app-status-color-nok);
                    height: 8px;
                    width: 8px;
            }

            .assurability--greenStatus{
                    color: var(--app-status-color-ok);
                    height: 8px;
                    width: 8px;
            }
            
            .invoice-status {
                    border-radius: 20px;
                    padding: 1px 12px 1px 8px;
                    font-size: 12px;
                    display: block;
                    width: auto;
                    max-width: fit-content;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }

                .invoice-status--orangeStatus{
                    background: #fcdf354d;
                }
                
                .statusIcon{
                    height: 8px;
                    width: 8px;
                }
                .statusIcon.invoice-status--orangeStatus {
                    color: var(--app-status-color-pending);
                }
                
                .statusIcon.invoice-status--orangeStatus,
                .statusIcon.invoice-status--greenStatus,
                .statusIcon.invoice-status--redStatus,
                .statusIcon.invoice-status--purpleStatus {
                    background: transparent !important;
                }
                
                *.txtcolor--orangeStatus {
                    color: var(--app-status-color-pending);
                }
            
                      
            .table{         
                width: auto;
                height: 100%;
                overflow: auto;
                font-size: var(--font-size-normal);
            }
            
            .tr{
                display: flex;
                height: 22px;
                cursor: pointer;
                border-bottom: 1px solid lightgray;   
                padding: 4px;                
            }
            
            .td{
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .w5{
                width: 5%;
            }
            
            .w10{
                width: 10%;
            }
            
            .w20{
                width: 20%;
            }
            
            .center{
                text-align: center;
            }
            
            .right{
                text-align: right;
            }
            
            .status{
              display: block;
              margin-left: auto;
              margin-right: auto;
            }
            
        </style>
        
        <div class="panel">
            <div class="panel-title">
                [[localize('', 'To be send', language)]]
            </div>
            <div class="panel-search">
                
            </div>
            <div class="panel-content">
                <div class="table">
                    <div class="tr">                     
                        <div class="td w10 center">[[localize('inv_mut','Mutual',language)]]</div>
                        <div class="td w10 center">[[localize('inv_num_fac','Invoice number',language)]]</div>
                        <div class="td w20 center">[[localize('inv_pat','Patient',language)]]</div>
                        <div class="td w10 center">[[localize('inv_niss','Inss',language)]]</div>
                        <div class="td w10 center">[[localize('inv_date','Invoice date',language)]]</div>
                        <div class="td w5 center">[[localize('inv_oa','Oa',language)]]</div>
                        <div class="td w5 center">[[localize('inv_pat','Patient',language)]]</div>
                        <div class="td w5 center">[[localize('inv_supp','Extra',language)]]</div>
                        <div class="td w5 center">[[localize('inv_tot','Total',language)]]</div>
                        <div class="td w10 center">[[localize('inv_stat','Status',language)]]</div>
                        <div class="td w10 center"></div>                    
                    </div>
                    <template is="dom-repeat" items="[[_sortInvoiceListByOa(listOfInvoice)]]" as="inv">
                        <div class="tr">
                            <div class="td w10">[[inv.insuranceCode]]</div>
                            <div class="td w10">[[inv.invoiceReference]]</div>
                            <div class="td w20">
                                <template is="dom-if" if="[[!inv.insurabilityCheck]]">
                                     <iron-icon icon="vaadin:circle" class="assurability--redStatus"></iron-icon>
                                </template>
                                <template is="dom-if" if="[[inv.insurabilityCheck]]">
                                     <iron-icon icon="vaadin:circle" class="assurability--greenStatus"></iron-icon>
                                </template>
                                [[inv.patientName]]
                            </div>
                            <div class="td w10">[[inv.patientSsin]]</div>
                            <div class="td w10">[[inv.invoiceDate]]</div>                         
                            <div class="td w5 right">[[inv.reimbursement]]</div>
                            <div class="td w5 right">[[inv.patientIntervention]]</div>
                            <div class="td w5 right">[[inv.doctorSupplement]]</div>
                            <div class="td w5 right">[[inv.totalAmount]]</div>
                            <div class="td w10 center status">
                                <span class="invoice-status invoice-status--orangeStatus">
                                    <iron-icon icon="vaadin:circle" class="statusIcon invoice-status--orangeStatus"></iron-icon>
                                    [[inv.statut]]
                                 </span>
                            </div>                    
                        </div>
                    </template>
                </div>
            </div>
            <div class="panel-button">
            
            </div>
        </div>    
`
    }

    static get is() {
        return 'ht-msg-invoice-to-be-send'
    }

    static get properties() {
        return {
            api: {
                type: Object,
                value: () => {
                }
            },
            user: {
                type: Object,
                value: () => {
                }
            },
            hcp: {
                type: Object,
                value: () => {
                }
            },
            listOfInvoice: {
                type: Array,
                value: () => []
            }
        }
    }

    constructor() {
        super()
    }

    static get observers() {
        return []
    }

    _sortInvoiceListByOa(listOfInvoice) {
        return _.sortBy(listOfInvoice, ['insuranceCode'], ['asc'])
    }

}

customElements.define(HtMsgInvoiceToBeSend.is, HtMsgInvoiceToBeSend)
