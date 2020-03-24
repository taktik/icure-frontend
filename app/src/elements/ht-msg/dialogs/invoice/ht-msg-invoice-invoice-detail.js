import '../../../dynamic-form/ckmeans-grouping.js';
import '../../../../styles/vaadin-icure-theme';
import '../../../../styles/spinner-style';
import '../../../../styles/scrollbar-style';
import '../../../../styles/shared-styles';
import '../../../../styles/buttons-style';
import '../../../../styles/dialog-style';
import '../../../ht-spinner/ht-spinner';

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

import moment from 'moment/src/moment';
import _ from 'lodash/lodash';
import * as models from 'icc-api/dist/icc-api/model/models'

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../../../tk-localizer";
class HtMsgInvoiceInvoiceDetail extends TkLocalizerMixin(PolymerElement) {
    static get template() {
        return html`

        <style include="shared-styles spinner-style scrollbar-style buttons-style dialog-style">
        
            .panel{
                background-color: white;
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
                height: 32px;
                width: auto; 
                padding: 4px; 
                display: flex;
                justify-content: flex-end!important; 
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
                                            
                .statusIcon{
                    height: 8px;
                    width: 8px;
                }
                
                .invoice-status--orangeStatus{
                    background: #fcdf354d;
                }
                .invoice-status--greenStatus{
                    background: #07f8804d;
                }
                .invoice-status--blueStatus {
                    background: #84c8ff;
                }
                .invoice-status--redStatus{
                    background: #ff4d4d4d;
                }
                .invoice-status--purpleStatus {
                    background: #e1b6e6;
                }
                
                 .statusIcon.invoice-status--orangeStatus {
                    color: var(--app-status-color-pending);
                }
                .statusIcon.invoice-status--greenStatus {
                    color: var(--app-status-color-ok);
                }
                .statusIcon.invoice-status--blueStatus {
                    color: var(--paper-blue-400);
                }
                .statusIcon.invoice-status--redStatus {
                    color: var(--app-status-color-nok);
                }
                .statusIcon.invoice-status--purpleStatus {
                    color: var(--paper-purple-300);
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
                *.txtcolor--greenStatus {
                    color: var(--app-status-color-ok);
                }
                *.txtcolor--blueStatus {
                    color: var(--paper-blue-400);
                }
                *.txtcolor--redStatus {
                    color: var(--app-status-color-nok);
                }
                *.txtcolor--purpleStatus {
                    color: var(--paper-purple-300)
                }
            
               .table{         
                width: auto;
                height: 100%;
                overflow: auto;
                font-size: var(--font-size-normal);
            }
            
            .table{         
                width: auto;
                height: 100%;
                overflow: auto;
                font-size: var(--font-size-normal);
            }
            
            .tr{
                display: flex;
                height: auto;               
                border-bottom: 1px solid lightgray;   
                padding: 4px;                
            }
            
            .th{
                height: auto!important;
                font-weight: bold;
                vertical-align: middle;
            }
            
            .tr-item{
                cursor: pointer;
            }
            
            .td{
                position: relative;
                display: flex;
                flex-flow: row nowrap;
                align-items: center;                           
                flex-basis: 0;
                padding: 6px;
                overflow: hidden;
                min-width: 0px;
                z-index: 2;
                word-break: break-word;
                white-space: nowrap;               
                font-size: 13px;
                text-overflow: ellipsis;
            }
            
            .fg0{
                flex-grow: 0.2;
            }
            
            .fg05{
                flex-grow: 0.5;
            }
            
            .fg1{
                flex-grow: 1;
            }
            
            .fg2{
                flex-grow: 2;
            }
            
            .fg3{
                flex-grow: 3;
            }   
                    
            .status{
              display: block;
              margin-left: auto;
              margin-right: auto;
            }
            
            .info-icon{
                height: 14px;
                width: 14px;
            }
            
            .searchField{
                display: block;
            }
            
            .rejectionInfo{
                white-space: normal!important;
            }
            
            .button{
               display: inline-flex!important;
               align-items: center!important;
            }
            
        </style>
        
        <div class="panel">
           <div class="panel-title">
                [[localize('inv-num-detail', 'Detail of invoice number', language)]] [[_getInvoiceReference(selectedInvoiceForDetail)]]              
            </div>
            <div class="panel-search">
                <dynamic-text-field label="[[localize('filter','Filter',language)]]" class="ml1 searchField" value="{{filter}}"></dynamic-text-field>
            </div>
            <div class="panel-content">
                <div class="table">
                    <div class="tr th">                     
                        <div class="td fg1">[[localize('inv_num_fac','Invoice number',language)]]</div>
                        <div class="td fg2">[[localize('inv_pat','Patient',language)]]</div>
                        <div class="td fg1">[[localize('inv_niss','Niss',language)]]</div>
                        <div class="td fg1">[[localize('nmcl','Nmcl',language)]]</div>
                        <div class="td fg1">[[localize('inv_batch_month','Invoiced month',language)]]</div>
                        <div class="td fg1">[[localize('inv_date_fact','Invoice date',language)]]</div>
                        <div class="td fg1">[[localize('inv_batch_amount','Amount',language)]]<br/>[[localize('inv_batch_amount_invoiced','Invoiced',language)]]</div>
                        <div class="td fg1">[[localize('inv_batch_amount','Amount',language)]]<br/>[[localize('inv_batch_amount_acc','Accepted',language)]]</div>
                        <div class="td fg1">[[localize('inv_batch_amount','Amount',language)]]<br/>[[localize('inv_batch_amount_rej','Rejected',language)]]</div>
                        <div class="td fg3">Motif rejet</div>  
                        <div class="td fg05">Payé</div>  
                        <div class="td fg1">[[localize('inv_stat','Status',language)]]</div>                                          
                    </div>
                    <ht-spinner active="[[isLoading]]"></ht-spinner>
                    <template is="dom-if" if="[[!isLoading]]">
                        <template is="dom-repeat" items="[[_sortInvoiceListByInvoiceRef(invoicesFromBatch)]]" as="inv">                       
                             <div class="tr">
                                 <div class="td fg1"></div>
                                 <div class="td fg2"></div>
                                 <div class="td fg1"></div>
                                 <div class="td fg1 center">[[invco.invoicingCode]]</div>
                                 <div class="td fg1">[[formatDate(invco.invoiceDate,'date')]]</div>
                                 <div class="td fg1"><span class\$="[[_getTxtStatusColor(inv.statut,inv.totalAmount)]]">[[_formatAmount(invco.invoicedAmount)]]€</span></div>
                                 <div class="td fg1"><span class\$="[[_getTxtStatusColor('force-green',inv.acceptedAmount)]]">[[_formatAmount(invco.acceptedAmount)]]€</span></div>
                                 <div class="td fg1"><span class\$="[[_getTxtStatusColor('force-red',inv.refusedAmount)]]">[[_formatAmount(invco.refusedAmount)]]€</span></div>
                                 <div class="td fg3 rejectionInfo">[[invco.rejectionReason]]</div>
                                 <div class="td fg05"></div>                             
                                 <div class="td fg1"><span class\$="invoice-status [[_getIconStatusClass(invco.status))]]"><iron-icon icon="vaadin:circle" class\$="statusIcon [[_getIconStatusClass(invco.status)]]"></iron-icon>[[invco.status]]</span></div>                                      
                             </div>   
                        </template>
                    </template>                   
                </div>
            </div>
            <div class="panel-button">              
                <paper-button class="button button--other" on-tap="_closeDetailPanel">[[localize('clo','Close',language)]]</paper-button>              
            </div>
        </div>
`;
    }

    static get is() {
        return 'ht-msg-invoice-invoice-detail';
    }

    static get properties() {
        return {
            api: {
                type: Object,
                value : () => {}
            },
            user: {
                type: Object,
                value : () => {}
            },
            hcp: {
                type : Object,
                value : () => {}
            },
            selectedInvoiceForDetail:{
                type: Object,
                value : () => {}
            }
        };
    }

    constructor() {
        super();
    }

    static get observers() {
        return [];
    }

    _initializeDataProvider(){

    }


}

customElements.define(HtMsgInvoiceInvoiceDetail.is, HtMsgInvoiceInvoiceDetail);
