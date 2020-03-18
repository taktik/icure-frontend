import '../../../dynamic-form/ckmeans-grouping.js';
import '../../../../styles/vaadin-icure-theme.js';
import '../../../../styles/spinner-style.js';
import '../../../../styles/scrollbar-style';
import '../../../../styles/shared-styles';
import '../../../../styles/buttons-style';
import '../../../../styles/dialog-style';
import '../../../ht-spinner/ht-spinner.js';

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
class HtMsgInvoiceAccepted extends TkLocalizerMixin(PolymerElement) {
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


                .statusIcon{
                    height: 8px;
                    width: 8px;
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
                [[localize('', 'Accepted', language)]]
            </div>
            <div class="panel-search">
                
            </div>
            <div class="panel-content">
                <div class="table">
                    <div class="tr">                     
                        <div class="td w10 center">[[localize('inv_prest','Physician',language)]]</div>
                        <div class="td w10 center">[[localize('inv_oa','Oa',language)]]</div>
                        <div class="td w20 center">[[localize('inv_batch_num','Batch number',language)]]</div>
                        <div class="td w10 center">[[localize('inv_batch_month','Billed month',language)]]</div>
                        <div class="td w10 center">[[localize('inv_date_fact','Invoice date',language)]]</div>
                        <div class="td w5 center">[[localize('inv_batch_amount','Amount',language)]] [[localize('inv_batch_amount_invoiced','Invoiced',language)]]</div>
                        <div class="td w5 center">[[localize('inv_batch_amount','Amount',language)]] [[localize('inv_batch_amount_acc','Accepted',language)]]</div>
                        <div class="td w5 center">[[localize('inv_batch_amount','Amount',language)]] [[localize('inv_batch_amount_rej','Rejected',language)]]</div>
                        <div class="td w5 center">[[localize('inv_stat','Status',language)]]</div>
                        <div class="td w10 center">[[localize('inv_batch_paid_informations','Paid information',language)]]</div>
                        <div class="td w10">[[localize('inv_batch_amount','Amount',language)]]</div>
                        <div class="td w10">[[localize('inv_batch_amount_paid','Paid',language)]]</div>
                        <div class="td w10">[[localize('inv_batch_bank_account','Bank account',language)]]</div>        
                        <div class="td w10">[[localize('inv_batch_paid_date','Payement date',language)]]</div>    
                        <div class="td w10">[[localize('inv_phys_ref','Physician reference',language)]]</div>        
                    </div>
                    <template is="dom-repeat" items="[[_sortInvoiceListByInvoiceRef(listOfInvoice)]]" as="inv">
                        <div class="tr">
                            <div class="td w10 center">[[inv.messageInfo.hcp]]</div>
                            <div class="td w10 center">[[inv.messageInfo.oa]]</div>
                            <div class="td w20 center">[[inv.messageInfo.invoiceNumber]]</div>
                            <div class="td w10 center">[[formatDate(inv.messageInfo.invoiceMonth,'month')]]</div>
                            <div class="td w10 center">[[formatDate(inv.messageInfo.invoiceDate,'date')]]</div>
                            <div class="td w5 center"><span class\$="[[_getTxtStatusColor(_getIconStatusClass(inv.messageInfo.invoiceStatus),inv.messageInfo.refusedAmount)]]">[[_formatAmount(inv.messageInfo.invoicedAmount)]]€</span></div>
                            <div class="td w5 center"><span class\$="[[_getTxtStatusColor(_getIconStatusClass(inv.messageInfo.invoiceStatus),inv.messageInfo.refusedAmount)]]">[[_formatAmount(inv.messageInfo.acceptedAmount)]]€</span></div>
                            <div class="td w5 center"><span class\$="[[_getTxtStatusColor(_getIconStatusClass(inv.messageInfo.invoiceStatus),inv.messageInfo.refusedAmount)]]">[[_formatAmount(inv.messageInfo.refusedAmount)]]€</span></div>
                            <div class="td w5 center"><span class\$="invoice-status [[_getIconStatusClass(inv.messageInfo.invoiceStatus)]]"><iron-icon icon="vaadin:circle" class\$="statusIcon [[_getIconStatusClass(inv.messageInfo.invoiceStatus)]]"></iron-icon> [[inv.messageInfo.invoiceStatus]]</span></div>
                            <div class="td w10 center">[[inv.messageInfo.paymentReference]]</div>
                            <div class="td w10">[[_formatAmount(inv.messageInfo.amountPaid)]]€</div>
                            <div class="td w10">[[_getPaidStatus(inv.messageInfo.paid)]]</div>
                            <div class="td w10">[[inv.messageInfo.paymentAccount]]</div>        
                            <div class="td w10">[[inv.messageInfo.paymentDate]]</div>    
                            <div class="td w10">[[inv.messageInfo.hcpReference]]</div>                             
                        </div>
                    </template>
                </div>
            </div>
            <div class="panel-button">
            
            </div>
        </div>   
     
`;
    }

    static get is() {
        return 'ht-msg-invoice-accepted';
    }

    static get properties() {
        return {
            api: {
                type: Object
            },
            user: {
                type: Object
            },
            hcp: {
                type : Object
            }
        };
    }

    constructor() {
        super();
    }

    static get observers() {
        return [];
    }

    _sortInvoiceListByInvoiceRef(listOfInvoice) {
        return _.sortBy(listOfInvoice, ['invoiceReference'], ['asc'])
    }

    _getTxtStatusColor(status,amount) {
        if (amount > 0) {
            return (status === this.localize('inv_full_acc','Fully accepted',this.language)) ? "txtcolor--greenStatus" :
                    ""
        }
    }

    _getIconStatusClass(status) {
        return (status === this.localize('inv_par_acc','Partially accepted',this.language)) ? "invoice-status--orangeStatus" :
                (status === this.localize('inv_full_acc','Fully accepted',this.language)) ? "invoice-status--greenStatus" :
                    ""
    }

    formatDate(d,f) {
        const input = d.toString() || _.trim(d)
        const yyyy = input.slice(0,4), mm = input.slice(4,6), dd = input.slice(6,8)
        switch(f) {
            case 'date' :
                return `${dd}/${mm}/${yyyy}`;
            case 'month' :
                const monthStr =
                    (mm.toString() === '01') ? this.localize('Jan',this.language) :
                        (mm.toString() === '02') ? this.localize('Feb',this.language) :
                            (mm.toString() === '03') ? this.localize('Mar',this.language) :
                                (mm.toString() === '04') ? this.localize('Apr',this.language) :
                                    (mm.toString() === '05') ? this.localize('May',this.language) :
                                        (mm.toString() === '06') ? this.localize('Jun',this.language) :
                                            (mm.toString() === '07') ? this.localize('Jul',this.language) :
                                                (mm.toString() === '08') ? this.localize('Aug',this.language) :
                                                    (mm.toString() === '09') ? this.localize('Sep',this.language) :
                                                        (mm.toString() === '10') ? this.localize('Oct',this.language) :
                                                            (mm.toString() === '11') ? this.localize('Nov',this.language) :
                                                                this.localize('Dec',this.language)
                return `${monthStr} ${yyyy}`
        }
    }

    _formatAmount(amount){
        return this.findAndReplace(((Number(amount).toFixed(2)).toString()),'.',',')
    }

    _getPaidStatus(paidStatus){
        return (paidStatus && paidStatus === true) ? "Oui" : "Non"
    }

    findAndReplace(string, target, replacement) {
        for (let i = 0; i < string.length; i++) { string = string.replace(target, replacement); }
        return string;
    }

}

customElements.define(HtMsgInvoiceAccepted.is, HtMsgInvoiceAccepted);
