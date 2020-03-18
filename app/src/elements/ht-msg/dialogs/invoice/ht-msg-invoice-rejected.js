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
class HtMsgInvoiceRejected extends TkLocalizerMixin(PolymerElement) {
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
                             
                .statusIcon{
                    height: 8px;
                    width: 8px;
                }
                
                .invoice-status--redStatus{
                    background: #ff4d4d4d;
                }
                
                .statusIcon{
                    height: 8px;
                    width: 8px;
                }
               
                .statusIcon.invoice-status--redStatus {
                    color: var(--app-status-color-nok);
                }
                
                
                .statusIcon.invoice-status--orangeStatus,
                .statusIcon.invoice-status--greenStatus,
                .statusIcon.invoice-status--redStatus,
                .statusIcon.invoice-status--purpleStatus {
                    background: transparent !important;
                }

                *.txtcolor--redStatus {
                    color: var(--app-status-color-nok);
                }
                
                *.txtcolor--greenStatus {
                    color: var(--app-status-color-ok);
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
                        <div class="td w20 center">[[localize('inv_phys_ref','Physician reference',language)]]</div>
                        <div class="td w10 center">[[localize('inv_batch_num','Batch number',language)]]</div>
                        <div class="td w10 center">[[localize('inv_batch_month','Invoiced month',language)]]</div>
                        <div class="td w5 center">[[localize('inv_date_fact','Invoice date',language)]]</div>
                        <div class="td w5 center">[[localize('inv_batch_amount','Amount',language)]] [[localize('inv_batch_amount_invoiced','Invoiced',language)]]</div>
                        <div class="td w5 center">[[localize('inv_batch_amount','Amount',language)]] [[localize('inv_batch_amount_acc','Accepted',language)]]</div>
                        <div class="td w5 center">[[localize('inv_batch_amount','Amount',language)]] [[localize('inv_batch_amount_rej','Rejected',language)]]</div>
                        <div class="td w10 center">[[localize('inv_stat','Status',language)]]</div>
                        <div class="td w10">Motif rejet</div>                      
                    </div>
                    <template is="dom-repeat" items="[[_sortInvoiceListByInvoiceRef(listOfInvoice)]]" as="inv">
                        <div class="tr">
                            <div class="td w10 center">[[inv.messageInfo.hcp]]</div>
                            <div class="td w10 center">[[inv.messageInfo.oa]]</div>
                            <div class="td w20 center">[[inv.messageInfo.hcpReference]]</div>
                            <div class="td w10 center">[[inv.messageInfo.invoiceNumber]]</div>
                            <div class="td w10 center">[[formatDate(inv.messageInfo.invoiceMonth,'month')]]</div>
                            <div class="td w5 center">[[formatDate(inv.messageInfo.invoiceDate,'date')]]</div>
                            <div class="td w5 center"><span class="">[[_formatAmount(inv.messageInfo.invoicedAmount)]]€</span></div>
                            <div class="td w5 center"><span class="txtcolor--greenStatus">[[_formatAmount(inv.messageInfo.acceptedAmount)]]€</span></div>
                            <div class="td w5 center"><span class="txtcolor--redStatus">[[_formatAmount(inv.messageInfo.refusedAmount)]]€</span></div>
                            <div class="td w10 center"><span class="invoice-status invoice-status--redStatus"><iron-icon icon="vaadin:circle" class="statusIcon "></iron-icon> [[inv.messageInfo.invoiceStatus]]</span></div>                             
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
        return 'ht-msg-invoice-rejected';
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

}

customElements.define(HtMsgInvoiceRejected.is, HtMsgInvoiceRejected);
