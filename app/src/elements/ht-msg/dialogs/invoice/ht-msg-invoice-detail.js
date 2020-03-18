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
class HtMsgInvoiceDetail extends TkLocalizerMixin(PolymerElement) {
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
            
            .tr{
                display: flex;
                height: 22px;               
                border-bottom: 1px solid lightgray;   
                padding: 4px;                
            }
            
            .tr-title{
                height: auto;
                font-weight: bold;
                vertical-align: middle;
            }
            
            .tr-item{
                cursor: pointer;
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
                [[localize('inv-num-detail', 'Detail of invoice number', language)]] [[_getInvoiceReference(selectedInvoiceForDetail)]]
            </div>
            <div class="panel-search">
            
            </div>
            <div class="panel-content">
                <div class="table">
                    <div class="tr">                     
                        <div class="td w10 center">[[localize('inv_num_fac','Invoice number',language)]]</div>
                        <div class="td w10 center">[[localize('inv_pat','Patient',language)]]</div>
                        <div class="td w20 center">[[localize('inv_niss','Niss',language)]]</div>
                        <div class="td w10 center">[[localize('nmcl','Nmcl',language)]]</div>
                        <div class="td w10 center">[[localize('inv_batch_month','Invoiced month',language)]]</div>
                        <div class="td w5 center">[[localize('inv_date_fact','Invoice date',language)]]</div>
                        <div class="td w5 center">[[localize('inv_batch_amount','Amount',language)]] [[localize('inv_batch_amount_invoiced','Invoiced',language)]]</div>
                        <div class="td w5 center">[[localize('inv_batch_amount','Amount',language)]] [[localize('inv_batch_amount_acc','Accepted',language)]]</div>
                        <div class="td w5 center">[[localize('inv_batch_amount','Amount',language)]] [[localize('inv_batch_amount_rej','Rejected',language)]]</div>
                         <div class="td w10">Motif rejet</div>  
                          <div class="td w10">Payé</div>  
                        <div class="td w10 center">[[localize('inv_stat','Status',language)]]</div>                                          
                    </div>
                    <template is="dom-repeat" items="[[_sortInvoiceListByInvoiceRef(invoicesFromBatch)]]" as="inv">
                        <div class="tr">
                            <div class="td w10">[[inv.invoiceReference]]</div>
                            <div class="td w10">[[inv.patient]]</div>
                            <div class="td w20">[[inv.ssin]]</div>
                            <div class="td w10 center"></div>
                            <div class="td w10">[[formatDate(inv.invoiceDate,'date')]]</div>
                            <div class="td w5 right"><span class\$="[[_getTxtStatusColor(inv.statut,inv.totalAmount)]]">[[_formatAmount(inv.invoicedAmount)]]€</span></div>
                            <div class="td w5 right"><span class\$="[[_getTxtStatusColor('force-green',inv.acceptedAmount)]]">[[_formatAmount(inv.acceptedAmount)]]€</span></div>
                            <div class="td w5 right"><span class\$="[[_getTxtStatusColor('force-red',inv.refusedAmount)]]">[[_formatAmount(inv.refusedAmount)]]€</span></div>
                            <div class="td w5 center">[[inv.rejectionReason]]</div>
                            <div class="td w10 right">[[_formatAmount(inv.paid)]]€</div>                             
                            <div class="td w10"><span class\$="invoice-status [[_getIconStatusClass(inv.status))]]"><iron-icon icon="vaadin:circle" class\$="statusIcon [[_getIconStatusClass(inv.status)]]"></iron-icon> [[inv.status]]</span></div>           
                        </div>
                    </template>
                </div>
            </div>
            <div class="panel-button">
                <paper-button class="button button--save" on-tap="_closeDetailPanel">[[localize('clo','Close',language)]]</paper-button>              
            </div>
        </div>
`;
    }

    static get is() {
        return 'ht-msg-invoice-detail';
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
            },
            isSendError:{
                type: Boolean,
                value: false
            },
            invoicesErrorMsg: {
                type: String,
                value: null
            },
            invoicesFromBatch:{
                type: Array,
                value: () => []
            }
        };
    }

    constructor() {
        super();
    }

    static get observers() {
        return ['_initializeDataProvider(api, user, selectedInvoiceForDetail, selectedInvoiceForDetail.*)'];
    }

    _initializeDataProvider(){
        if(!_.isEmpty(_.get(this, 'selectedInvoiceForDetail', {}))){
            this._showDetail()
        }
    }

    _closeDetailPanel(){
        this.dispatchEvent(new CustomEvent('close-detail-panel', {bubbles: true, composed: true}))
    }

    _showDetail() {
            this.set('isSendError', _.get(this.selectedInvoiceForDetail, 'messageInfo.sendError', null) ? _.get(this.selectedInvoiceForDetail, 'messageInfo.sendError', null) : false)
            this.set('invoicesErrorMsg', null);

            this.api.setPreventLogging()

            this.api.invoice().getInvoices(new models.ListOfIdsDto({ids: _.get(this.selectedInvoiceForDetail, 'message.invoiceIds', []).map(i => i)}))
                .then(invoices => Promise.all(invoices.map(inv => this.api.crypto().extractCryptedFKs(inv, _.get(this.user, 'healthcarePartyId', null)).then(ids => [inv, ids.extractedKeys[0]]))))
                .then(invAndIdsPat =>
                    this.api.patient().getPatientsWithUser(this.user,new models.ListOfIdsDto({ids: _.uniq(invAndIdsPat.map(x => x[1]))})).then(pats => invAndIdsPat.map(it => [it[0], pats.find(p => p.id === it[1])]))
                )
                .then(invAndPats => invAndPats.map( ([inv, pat]) => ({
                    invoiceReference: _.get(inv, 'invoiceReference', null),
                    patient: _.get(pat, 'firstName', null)+" "+_.get(pat, 'lastName', null),
                    ssin: _.get(pat, 'ssin', null),
                    invoiceDate: _.get(inv, 'invoiceDate', null),
                    invoicedAmount: _.get(inv, 'invoicingCodes', []).reduce((t,c) => t + (c.reimbursement || 0), 0),
                    acceptedAmount: (!!(_.get(this.selectedInvoiceForDetail, 'message.status', null) & (1 << 17)) || !!(_.get(this.selectedInvoiceForDetail, 'message.status', null) & (1 << 12))) ? 0.00 : _.get(inv, 'invoicingCodes', []).reduce((t,c) => t + (c.paid || 0), 0),
                    refusedAmount: (!!(_.get(this.selectedInvoiceForDetail, 'message.status', null) & (1 << 17)) || !!(_.get(this.selectedInvoiceForDetail, 'message.status', null) & (1 << 12))) ? _.get(inv, 'invoicingCodes', []).reduce((t,c) => t + (c.reimbursement || 0), 0) : (Number(_.get(inv, 'invoicingCodes', []).reduce((t,c) => t + (c.reimbursement || 0), 0)) -  Number(_.get(inv, 'invoicingCodes', []).reduce((t,c) => t + (c.paid || 0), 0))),
                    rejectionReason: _.get(inv, 'error', null),
                    paid: false,
                    status: _.get(this.selectedInvoiceForDetail, 'messageInfo.invoiceStatus', null),
                    invoice: inv,
                    invoicingCodes: _.get(inv, 'invoicingCodes', []).map(code => ({
                        invoicingCode: _.get(code, 'code', null),
                        invoiceDate: _.get(code, 'dateCode', null),
                        invoicedAmount: Number(_.get(code, 'reimbursement', null)),
                        acceptedAmount:  (!!(_.get(this.selectedInvoiceForDetail, 'message.status', null) & (1 << 17)) || !!(_.get(this.selectedInvoiceForDetail, 'message.status', null) & (1 << 12))) ? 0.00 : ((_.get(code, 'paid', 0) >= 0) ? _.get(code, 'paid', 0) : 0.00),
                        refusedAmount:  (!!(_.get(this.selectedInvoiceForDetail, 'message.status', null) & (1 << 17)) || !!(_.get(this.selectedInvoiceForDetail, 'message.status', null) & (1 << 12))) ? Number(_.get(code, 'reimbursement', 0)) : (_.get(code, 'paid', 0) >= 0) ? (Number(code.reimbursement) - Number(code.paid)) : 0.00,
                        rejectionReason: _.get(code, 'error', null),
                        paid: false,
                        accepted: _.get(code, 'accepted', null),
                        status: _.get(code, 'accepted', false) === true ?  this.localize('nmcl-accepted','Accepted',this.language) : this.localize('nmcl-rejected','Rejected',this.language)
                    }))
                })))
                .then(infos => this.set('invoicesFromBatch', infos))
                .then(() => this.api.message().getChildren(_.get(this.selectedInvoiceForDetail, 'message.id', null)))
                .then((msgs) => Promise.all(_.map(msgs.filter(m => m.subject && ['920999','920099', '920098', '920900'].includes(m.subject.substr(0,6))), (msg => this.api.document().findByMessage(this.user.healthcarePartyId, msg)))))
                .then((docs) => Promise.all(_.flatMap(docs).filter(d => !_.endsWith(d.name, '_parsed_records') && _.endsWith(d.name, '_records') && d.mainUti === "public.json").map(d => this.api.document().getAttachment(d.id, d.attachmentId))))
                .then((attachs) => {
                    this.api.setPreventLogging(false)
                    attachs.forEach( a => {

                        if (typeof a === "string"){
                            try { a = JSON.parse( this.cleanStringForJsonParsing(a) ) } catch (ignored) {}
                        } else if (typeof a === "object") {
                            try { a = JSON.parse( this.cleanStringForJsonParsing(new Uint8Array(a).reduce((data, byte) => data + String.fromCharCode(byte), ''))); } catch (ignored) {}
                        }

                        const zone1and90 = _.get(a, 'message', []).find(enr => _.get(enr, 'zones', []).find(z => z.zone === "1" || z.zone === "90"))
                        let errorString = ''
                        Object.keys(_.get(zone1and90, 'errorDetail', [])).find(key => {
                            if(key.includes('rejectionCode')) {
                                if( parseInt(zone1and90.errorDetail[key]) > 0 ){
                                    const index = key.replace('rejectionCode',"")
                                    errorString = zone1and90.errorDetail['rejectionDescr' + index] + ' '
                                    return zone1and90.errorDetail['rejectionDescr' + index] && zone1and90.errorDetail['rejectionDescr' + index].length
                                }
                            }
                            return false
                        })

                        this.set('invoicesErrorMsg',errorString);

                        const zone200 = _.get(a, 'message', []).find(enr => enr.zones.find(z => z.zone === "200"))
                        const zone300 = _.get(a, 'message', []).find(enr => enr.zones.find(z => z.zone === "300"))
                        const zone400 = _.get(a, 'message', []).find(enr => enr.zones.find(z => z.zone === "400"))
                        const zone500 = _.get(a, 'message', []).find(enr => enr.zones.find(z => z.zone === "500"))

                        let globalError = _.compact(_.uniq([zone200 && this.SEG_getErrSegment_200(zone200.zones || []),
                            zone300 && this.SEG_getErrSegment_300(zone300.zones || []),
                            zone400 && this.SEG_getErrSegment_400(zone400.zones || []),
                            zone500 && this.SEG_getErrSegment_500(zone500.zones || [])]))

                        this.set('invoicesErrorMsg',this.invoicesErrorMsg+" "+globalError);

                    })
                }).finally(()=>{
                this.api.setPreventLogging(false)
            })

    }

    cleanStringForJsonParsing(inputValue) {
        return inputValue
            .replace(/\\n/g, "\\n")
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f")
            .replace(/[\u0000-\u0019]+/g,"")
    }

    _getInvoiceReference(){
        return _.get(this.selectedInvoiceForDetail, 'invoice.invoiceReference', null)
    }

    _sortInvoiceListByInvoiceRef(listOfInvoice) {
        return _.sortBy(listOfInvoice, ['invoiceReference'], ['asc'])
    }

    _formatAmount(amount){
        return this.findAndReplace(((Number(amount).toFixed(2)).toString()),'.',',')
    }

    findAndReplace(string, target, replacement) {
        for (let i = 0; i < string.length; i++) { string = string.replace(target, replacement); }
        return string;
    }

    _getIconStatusClass(status) {
        console.log("geticonstatus",status)
        return (status === this.localize('inv_acc_tre','Accepted for treatment',this.language)) ? "invoice-status--blueStatus" :
            (status === this.localize('inv_to_be_send','To be send',this.language)) ? (!this.statusToBeSend)  ? "invoice-status--blueStatus" : "invoice-status--orangeStatus" :
                (status === this.localize('inv_to_be_corrected','To be corrected',this.language))  ? "invoice-status--redStatus" :
                    (status === this.localize('inv_par_acc','Partially accepted',this.language)) ? "invoice-status--orangeStatus" :
                        (status === this.localize('inv_full_acc','Fully accepted',this.language)) ? "invoice-status--greenStatus" :
                            (status === this.localize('inv_tre','Treated',this.language)) ? "invoice-status--greenStatus" :
                                (status === this.localize('inv_acc_tre','Accepted for treatment',this.language)) ? "invoice-status--blueStatus" :
                                    (status === this.localize('inv_pen','Pending',this.language)) ? (!this.statusToBeSend) ? "invoice-status--blueStatus" : "" :
                                        (status === this.localize('inv_err','Error',this.language)) ? "invoice-status--redStatus" :
                                            (status === this.localize('inv_arch','Archived',this.language)) ? "invoice-status--purpleStatus" :
                                                (status === this.localize('nmcl-rejected','Rejected',this.language)) ? "invoice-status--redStatus" :
                                                    (status === this.localize('nmcl-accepted','Accepted',this.language)) ? "invoice-status--greenStatus" :
                                                        (status === this.localize('inv_send_err', 'Send error', this.language)) ? "invoice-status--redStatus" :
                                                            ""
    }
    _getTxtStatusColor(status,amount) {
        console.log("gettxtstatus",status,amount)
        if (amount > 0) {
            return (status === this.localize('inv_par_acc','Partially accepted',this.language)) ? "txtcolor--orangeStatus" :
                (status === this.localize('inv_full_acc','Fully accepted',this.language)) ? "txtcolor--greenStatus" :
                    (status === this.localize('inv_to_be_corrected','To be corrected',this.language))  ? "txtcolor-status--redStatus" :
                        (status === this.localize('inv_acc_tre','Accepted for treatment',this.language)) ? "txtcolor--blueStatus" :
                            (status === this.localize('inv_pen','Pending',this.language)) ? "txtcolor--blueStatus" :
                                (status === this.localize('inv_tre','Treated',this.language)) ? "txtcolor--greenStatus" :
                                    (status === this.localize('inv_err','Error',this.language)) ? "txtcolor--redStatus" :
                                        (status === this.localize('inv_arch','Archived',this.language)) ? "txtcolor--purpleStatus" :
                                            (status === this.localize('nmcl-rejected','Rejected',this.language)) ? "txtcolor--redStatus" :
                                                (status === this.localize('nmcl-accepted','Accepted',this.language)) ? "txtcolor--greenStatus" :
                                                    (status === 'force-red') ? "txtcolor--redStatus" :
                                                        (status === 'force-green') ? "txtcolor--greenStatus" :
                                                            (status === this.localize('inv_send_err', 'Send error', this.language)) ? "invoice-status--redStatus" :
                                                                ""
        }
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

}

customElements.define(HtMsgInvoiceDetail.is, HtMsgInvoiceDetail);
