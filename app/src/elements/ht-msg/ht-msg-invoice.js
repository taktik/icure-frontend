import '../dynamic-form/ckmeans-grouping.js';
import '../../styles/vaadin-icure-theme.js';
import '../../styles/spinner-style.js';
import '../ht-spinner/ht-spinner.js';
import '../ht-pat/dialogs/ht-pat-invoicing-dialog.js';

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

import moment from 'moment/src/moment';
import _ from 'lodash/lodash';
import * as models from 'icc-api/dist/icc-api/model/models'

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class HtMsgInvoice extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <custom-style>
            <style include="shared-styles vaadin-icure-theme spinner-style">

                :host {
                    display: block;
                    z-index:2;
                }

                :host *:focus {
                    outline: 0 !important;
                }

                vaadin-grid {
                    /*height: calc(100% - 41px - 32px - 32px);*/
                    height: auto;
                    /*width: calc(100vw - 16%);*/
                    box-shadow: var(--app-shadow-elevation-1);
                    border: none;
                    box-sizing: border-box;
                }

                vaadin-grid.material {
                    outline: 0 !important;
                    font-family: Roboto, sans-serif;
                    background: rgba(0, 0, 0, 0);
                    border: none;
                    --divider-color: rgba(0, 0, 0, var(--dark-divider-opacity));

                    --vaadin-grid-cell: {
                        padding: 8px;
                    };

                    --vaadin-grid-header-cell: {
                        height: 48px;
                        padding: 11.2px;
                        color: rgba(0, 0, 0, var(--dark-secondary-opacity));
                        font-size: 12px;
                        background: rgba(0, 0, 0, 0);
                        border-top: 0;
                    };

                    --vaadin-grid-body-cell: {
                        height: 48px;
                        color: rgba(0, 0, 0, var(--dark-primary-opacity));
                        font-size: 13px;
                    };

                    --vaadin-grid-body-row-hover-cell: {
                        background-color: var(--app-background-color-dark);
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
                    height: 100%;
                }

                vaadin-grid.material .cell.last {
                    padding-right: 24px;
                    text-align: center;
                }

                vaadin-grid.material .cell.numeric {
                    text-align: right;
                }

                vaadin-grid.material paper-checkbox {
                    --primary-color: var(--paper-indigo-500);
                    margin: 0 24px;
                }

                vaadin-grid.material vaadin-grid-sorter {
                    --vaadin-grid-sorter-arrow: {
                        display: none !important;
                    };
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

                vaadin-grid.material::slotted(div) {
                    outline: 0 !important;
                }

                .invoice-panel{
                    height: 100%;
                    width: 100%;
                    padding: 0 20px;
                    box-sizing: border-box;
                    z-index: -1;
                }

                .recipient-col{
                    width:  calc(100% / 11);
                }


                .oa-col{
                    min-width: 25px;
                }

                .ref-col{
                    min-width: 75px;
                }

                .invoice-col{
                    min-width: 40px;
                }

                .month-col{
                    min-width: 40px;
                }

                .invoiceDate-col{
                    min-width: 50px;
                }

                .invAmount-col{
                    min-width: 50px;
                }

                .accAmount-col{
                    min-width: 50px;
                }

                .refAmount-col{
                    min-width: 50px;
                }

                .stat-col{
                    min-width: 50px;
                }

                .reject-col{
                    min-width: 100px;
                }

                .payRef-col{
                    min-width: 50px;
                }

                .payDate-col{
                    min-width: 40px;
                }

                .payTot-col{
                    min-width: 40px;
                }

                .payBank-col{
                    min-width: 50px;
                }

                .payPaid-col{
                    min-width: 50px;
                }

                .facture-title {
                    padding: 15px;
                    font-size: 25px;
                    text-transform: capitalize;
                    margin: 0;
                    color: #212121;
                    height: 25px;
                    line-height: 25px;
                }


                @media screen and (max-width:1025px){
                    .invoice-panel {
                        left: 0;
                        width: 100%;
                    }
                }
                .gridContainer{
                    height: calc(100% - 128px);
                    overflow-y: hidden;
                    overflow-x: hidden;
                    box-shadow: var(--app-shadow-elevation-1);
                }

                .gridContainer.toBeSent {
                    max-height: calc(100% - 168px);
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

                #pendingDetailDialog{
                    height: calc(100vh - 40px);
                    width: calc(85% - 40px);
                    z-index: 1100;
                    position: fixed;
                    top: 64px;
                }

                #pendingGridDetail{
                    height: calc(100% - 185px);
                    padding: 0;
                    width: 100%;
                }

                .batch-status {
                    font-size: 24px;
                    text-transform: capitalize;
                    padding-top: 5px;
                    display: flex;
                    flex-flow: row wrap;
                    align-items: center;
                    justify-content: flex-start;
                }

                .batch-status .spinner{
                    margin-left: 24px;
                }

                .unlockBtn {
                    height: 12px;
                    width: 12px;
                }

                .hidden {
                    display: none;
                }

                #messagesGridContainer {
                    overflow-y: auto;
                }

                .invoiceContainer{
                    overflow-x: hidden;
                    overflow-y: hidden;
                    height: calc(100vh - 185px);
                    box-shadow: var(--app-shadow-elevation-1);
                }
                .invoiceSubContainerBig {
                   height: 100%;
                }

                .invoiceSubContainerMiddle {
                    /*height: 50%;*/
                    height: calc(100vh - 212px);
                    transition: all .5s ease;
                }
                .invoiceSubContainerMiddle vaadin-grid {
                    /*height: 100%;*/
                }
                .invoiceSubContainerMiddle.half {
                    height: 49%;
                }

                .invoiceDetailContainer,
                .toBeCorrectedContainerDetail{
                    height: 50%;
                    opacity: 0;
                    transition: all .75s ease-out;
                    overflow-y: auto;
                }
                .invoiceDetailContainer.open,
                .toBeCorrectedContainerDetail.open {
                    opacity: 1;
                    width: 100%;
                    height: calc( 37% - 72px );
                }

                tr.hidden {
                    display: none !important;
                }

                .mb0 {
                    margin-bottom: 0;
                }

                #pendingDetailDialog {
                    max-height: 80vh;
                }

                .helpdeskIcon {
                    height: 12px;
                    width: 12px;
                    cursor: pointer;
                    opacity: 0.7;
                    transition: all .24s cubic-bezier(0.075, 0.82, 0.165, 1);
                }

                .helpdeskIcon:hover{
                    transform: scale(1.05);
                    opacity: 1;
                }

                iron-collapse-button #trigger{
                    height: 45px;
                    background: var(--app-background-color-dark);
                    display: initial;
                }

                #invoiceCollapser {
                    display: block;
                    background: white;
                    height: calc(100% - 75px);
                    overflow-y: auto;
                }

                h3.header {
                    margin: 0 auto
                }
                #collapse-grid .recipient-col {
                    background: grey;
                }

                .rejectionReason-col {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    max-width: 100%;
                }

                .containScroll {
                    overflow: auto;
                    height: 100%;
                }

                .scrollBox {
                    width: 100%;
                    overflow: auto;
                    height: 100%;
                }
                .scrollBox > #messagesGrid {
                    width: 100%;
                    height: 100%;
                }

                .flex-header{
                    width: 100%;
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: flex-start;
                    align-items: center;
                    height: 48px;
                }

                iron-collapse-button:hover{
                    background: var(--app-background-color-dark);
                }

                .flex-header span{
                    display:block;
                    font-size: 12px;
                    font-weight: 400;
                    padding: 4px 12px;
                    box-sizing:border-box;
                    cursor: pointer;
                    color: rgb(115,115,115);
                }

                .flex-header span.center{
                    text-align: center;
                }

                .invoiceGrid {
                    overflow-y: scroll;
                    max-height: 20vh;
                }

                vaadin-grid.subGrid {
                    overflow-y: auto;
                    max-height: 35vh;
                }

                #invoiceGrid .footer{
                    background: red;
                }

                #helpdeskInfoDialog{
                    position: fixed;
                    width: 50%;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    max-width: none !important;
                    max-height: none !important;
                    overflow-y: auto;
                }

                .modal-title {
                    background: var(--app-background-color-dark);
                    margin-top: 0;
                    padding: 16px 24px;
                }

                .modal-content{
                    display: flex;
                    flex-flow: row wrap;
                    align-items: center;
                    justify-content: flex-start;
                }

                .modal-input{
                    margin: 0 12px;
                    flex-grow: 1;
                }

                paper-input{
                    --paper-input-container-focus-color: var(--app-primary-color);
                }

                .buttons {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    margin: 8px 16px;
                }

                .batchNumber{
                    color: var(--app-text-color-light);
                    border-radius: 25px;
                    min-height: 0;
                    margin-left: 8px;
                    font-size: .6em;
                    display: inline-block;
                    padding: 4px 6px;
                    line-height: 0.8;
                    text-align: center;
                    height: 10px;
                }
                .batchPending{background-color: var(--paper-orange-400);}
                .batchToBeCorrected{background-color: var(--paper-red-400);}
                .batchProcessed{background-color: var(--paper-blue-400);}
                .batchRejected{background-color: var(--paper-red-400);}
                .batchAccepted{background-color: var(--paper-green-400);}
                .batchArchived{background-color: var(--paper-purple-300);}

                ht-spinner {
                    height: 42px;
                    width: 42px;
                }

                .error_message_red{
                    color: var(--paper-red-400);
                }

                .iconBtn{
                    height: 16px;
                    width: 16px;
                }

                .alignRight{
                    float: right;
                    margin-right: 1%;
                }

                #archiveDialog{
                    height: 300px;
                    width: 500px;
                }

                .archiveDialogContent{
                    height: 250px;
                    width: auto;
                    margin: 10px;
                }

                .edit-invoice {
                    cursor: pointer;
                }

                @media screen and (max-height: 500px) {
                    vaadin-grid.subGrid {
                        overflow-y: auto;
                        max-height: 20vh;
                    }
                }

                @media screen and (max-width: 1024px) {
                    .hideOnMobile {display: none;opacity: 0;}
                }

                #toBeCorrectedGridDetail{
                    height: 96%;
                }

                .invoice-filter {
                    padding: 0 14px;
                    margin-bottom: 14px;
                }

                .invoice-error-msg {
                    font-size: 14px;
                    font-weight: 400;
                    display: inline-block;
                    padding: 6px 14px;
                    border-radius: 100px;
                    margin-bottom: 0;
                    margin-left: 12px;
                    box-sizing: border-box;
                }

                .invoice-detail-title {
                    margin-left: 14px;
                }

                #warningBeforeSend{
                    height: 500px;
                    width: 800px;
                }

                .unsentInvoice{
                    height: 250px;
                    width: auto;
                }

                previousCheck{
                    height: 100px;
                    width: auto;
                }

                .errorBeforeSendInvoice{
                    color: var(--app-status-color-nok);
                    font-weight: bold;
                }

                #patientsWithoutAssurabilityGrid{
                    max-height: 200px;
                    overflow: auto;
                }

                .traineeIcon{
                    height: 12px;
                    width: 12px;
                }

                .loadingContainer, .loadingContainerSmall {
                    position:absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;left: 0;
                    background-color: rgba(0,0,0,.3);
                    z-index: 10;
                    text-align: center;
                }

                .loadingContentContainer, .loadingContentContainerSmall {
                    position:relative;
                    width: 400px;
                    min-height: 200px;
                    background-color: #ffffff;
                    padding:20px;
                    border:3px solid var(--app-secondary-color);
                    margin:40px auto 0 auto;
                    text-align: center;
                }

                .loadingContentContainerSmall {
                    width: 250px;
                    min-height: 1px;
                }

                #loadingContent {
                    text-align: left;
                }

                .loadingIcon {
                    margin-right:5px;
                }

                .loadingIcon.done {
                    color: var(--app-secondary-color);
                }

                .grid-btn-small {
                    margin: 0;
                    padding:10px 10px;
                    box-sizing: border-box;
                    --paper-button-ink-color: var(--app-secondary-color-dark);
                    display: inline-block;
                    text-align: center;
                    --paper-button: {
                        background: var(--app-secondary-color);
                        color: var(--app-text-color);
                        width: auto;
                        margin: 0 auto;
                        font-size: 12px;
                        font-weight: 400;
                        padding:10px;
                    };
                }

                .button--rejected {
                    --paper-button-ink-color: var(--app-status-color-nok);
                    background-color: var(--app-status-color-nok);
                    color: var(--app-text-color-light);
                }

                .modalDialog{
                    height: 350px;
                    width: 600px;
                }

                .modalDialogContent{
                    height: 250px;
                    width: auto;
                    margin: 10px;
                }

                .m-t-50 {
                    margin-top:50px!important;
                }

                .textAlignCenter {
                    text-align: center;
                }

                .bold {
                    font-weight: 700!important;
                }

            </style>
        </custom-style>
        <div class="invoice-panel">

            <template is="dom-if" if="[[_bodyOverlay]]">
                <div class="loadingContainer"></div>
            </template>
            <template is="dom-if" if="[[_isLoading]]">
                <div class="loadingContainer">
                    <div class="loadingContentContainer">
                        <div style="max-width:200px; margin:0 auto"><ht-spinner class="spinner" alt="Loading..." active=""></ht-spinner></div>
                        <div id="loadingContent"><p><iron-icon icon="arrow-forward" class="loadingIcon"></iron-icon> [[localize("req_in_tre", language)]]</p></div>
                    </div>
                </div>
            </template>
            <template is="dom-if" if="[[_isLoadingSmall]]">
                <div class="loadingContainerSmall">
                    <div class="loadingContentContainerSmall">
                        <ht-spinner class="spinner" alt="Loading..." active=""></ht-spinner>
                        <p><iron-icon icon="arrow-forward" class="loadingIcon"></iron-icon> [[localize("pleaseWait", language)]]</p>
                    </div>
                </div>
            </template>

            <div id="batchStatus" class="batch-status">
                [[_displayInvoiceStatus(invoicesStatus)]]
                <template is="dom-if" if="[[_isEqual(invoicesStatus,'toBeSend')]]"><span class="batchNumber batchPending">{{_forceZeroNum(selectedInvoicesToBeSend.length)}}</span></template>
                <template is="dom-if" if="[[_isEqual(invoicesStatus,'toBeCorrected')]]"><span class="batchNumber batchToBeCorrected">{{_forceZeroNum(messagesToBeCorrected.length)}}</span></template>
                <template is="dom-if" if="[[_isEqual(invoicesStatus,'process')]]"><span class="batchNumber batchProcessed">{{_forceZeroNum(messagesProcessed.length)}}</span></template>
                <template is="dom-if" if="[[_isEqual(invoicesStatus,'accept')]]"><span class="batchNumber batchAccepted">{{_forceZeroNum(messagesAccepted.length)}}</span></template>
                <template is="dom-if" if="[[_isEqual(invoicesStatus,'reject')]]"><span class="batchNumber batchRejected">{{_forceZeroNum(messagesRejected.length)}}</span></template>
                <template is="dom-if" if="[[_isEqual(invoicesStatus,'archive')]]"><span class="batchNumber batchArchived">{{_forceZeroNum(messagesArchived.length)}}</span></template>
                <ht-spinner class="spinner" alt="Loading invoices" active="[[_isLoadingMessages]]"></ht-spinner>
                <template is="dom-if" if="[[_isBatchCanBeAutoArchived(invoicesStatus.*, messageIdsCanBeAutoArchived.splices)]]">
                    <paper-button class="button alignRight" on-tap="_archiveBatchAuto">[[localize('arch','Archive',language)]] [[_getNbMsgToArchive(messageIdsCanBeAutoArchived.splices)]] envoi(s)</paper-button>
                </template>
            </div>
            <template is="dom-if" if="[[statusToBeSend]]">
                <paper-input id="filter" label="[[localize('sch','Rechercher',language)]]" value="{{filterInput}}" on-keyup="refreshFilter" param="invoiceGrid" where="toBeSend">&gt;</paper-input>
            </template>
            <template is="dom-if" if="[[!statusToBeSend]]">
                <template is="dom-if" if="[[!isToBeCorrected(invoicesStatus.*)]]">
                    <paper-input id="filter" label="[[localize('sch','Rechercher',language)]]" value="{{filterInputInvoices}}" on-keyup="refreshFilter" param="messagesGrid" where="notToBeSend"></paper-input>
                </template>
                <template is="dom-if" if="[[isToBeCorrected(invoicesStatus.*)]]">
                    <paper-input id="filter" label="[[localize('sch','Rechercher',language)]]" value="{{filterInputInvoices}}" on-keyup="refreshFilter" param="toBeCorrected" where="notToBeSend"></paper-input>
                </template>
            </template>

            <template is="dom-if" if="[[statusToBeSend]]">
                <div class="gridContainer grid-pending toBeSent">
                    <div class="containScroll">
                        <vaadin-grid id="noscroll" class="pendingTable" theme="force-sizer">
                            <vaadin-grid-column flex-grow="0" width="4%" class="recipient-col">
                                <template class="header">
                                   <!-- <vaadin-grid-sorter path="invoice.sentMediumType">[[localize('inv_insurability','Insurability',language)]]</vaadin-grid-sorter>-->
                                </template>
                            </vaadin-grid-column>
                            <vaadin-grid-column flex-grow="0" width="10%" class="recipient-col">
                                <template class="header">
                                    <vaadin-grid-sorter path="patient.insurance.code">[[localize('inv_mut','Mutual',language)]]</vaadin-grid-sorter>
                                </template>
                            </vaadin-grid-column>
                            <vaadin-grid-column flex-grow="0" width="8%" class="recipient-col">
                                <template class="header">
                                    <vaadin-grid-sorter path="invoice.invoiceReference">[[localize('inv_num_fac','Invoice number',language)]]</vaadin-grid-sorter>
                                </template>
                            </vaadin-grid-column>
                            <vaadin-grid-column flex-grow="0" width="20%" class="recipient-col">
                                <template class="header">
                                    <vaadin-grid-sorter path="invoice.patient.firstName">[[localize('inv_pat','Patient',language)]]</vaadin-grid-sorter>
                                </template>
                            </vaadin-grid-column>
                            <vaadin-grid-column flex-grow="0" width="8%" class="recipient-col">
                                <template class="header">
                                    <vaadin-grid-sorter path="patient.ssin">[[localize('inv_niss','Inss',language)]]</vaadin-grid-sorter>
                                </template>
                            </vaadin-grid-column>
                            <vaadin-grid-column flex-grow="0" width="8%" class="recipient-col">
                                <template class="header">
                                    <vaadin-grid-sorter path="invoice.invoiceDate">[[localize('inv_date_fact','Invoice date',language)]]</vaadin-grid-sorter>
                                </template>
                            </vaadin-grid-column>
                            <vaadin-grid-column-group>
                                <!-- <template class="header hasBorder">Montants</template> -->
                                <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col">
                                    <template class="header border-left">
                                        <vaadin-grid-sorter path="invoice.reimbursement">[[localize('inv_oa','OA',language)]]</vaadin-grid-sorter>
                                    </template>
                                </vaadin-grid-column>
                                <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col">
                                    <template class="header">
                                        <vaadin-grid-sorter path="invoice.patientIntervention">[[localize('inv_pat','Patient',language)]]</vaadin-grid-sorter>
                                    </template>
                                </vaadin-grid-column>
                                <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col">
                                    <template class="header">
                                        <vaadin-grid-sorter path="invoice.doctorSupplement">[[localize('inv_supp','Extra',language)]]</vaadin-grid-sorter>
                                    </template>
                                </vaadin-grid-column>
                                <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col border-right">
                                    <template class="header border-right">
                                        <vaadin-grid-sorter path="invoice.totalAmount">[[localize('inv_tot','Total',language)]]</vaadin-grid-sorter>
                                    </template>
                                </vaadin-grid-column>
                            </vaadin-grid-column-group>
                            <vaadin-grid-column flex-grow="0" width="10%" class="recipient-col">
                                <template class="header">
                                    <vaadin-grid-sorter path="invoice.statut">[[localize('inv_stat','Status',language)]]</vaadin-grid-sorter>
                                </template>
                            </vaadin-grid-column>
                            <vaadin-grid-column flex-grow="0" width="4%" class="recipient-col">
                                <template class="header"></template>
                            </vaadin-grid-column>
                        </vaadin-grid>
                     
                        <template is="dom-repeat" items="[[toggledDatas]]">  
                             <vaadin-accordion>                       
                                <vaadin-accordion-panel>
                                    <div slot="summary" class="flex-header">
                                        <span class="center hideOnMobile" style="width: 4%;">[[localize('grp','Groupe',language)]]</span>
                                        <span style="width: 54%;">OA: [[item.code]]</span>
                                        <span class="center" style="width: 7%;">[[_formatAmount(item.sum.oa)]]€</span>
                                        <span class="center" style="width: 7%;">[[_formatAmount(item.sum.pat)]]€</span>
                                        <span class="center" style="width: 7%;">[[_formatAmount(item.sum.sup)]]€</span>
                                        <span class="center" style="width: 7%;">[[_formatAmount(item.sum.tot)]]€</span>
                                    </div>
                                   
                                    <div>
                                        <vaadin-grid id="invoiceGrid" class="invoiceGrid" items="[[item.pat]]" multi-sort="[[multiSort]]" active-item="{{activeGridItem}}" on-tap="_showInvoiceToBeSendDetails">
                                            <vaadin-grid-column flex-grow="0" width="4%" class="recipient-col">
                                                <template>
                                                    <small>
                                                        <template is="dom-if" if="[[item.realizedByTrainee]]">
                                                            <iron-icon icon="vaadin:academy-cap" class="traineeIcon"></iron-icon>
                                                        </template>
                                                    </small>
                                                </template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="10%" class="recipient-col">
                                                <template>
                                                    <small>[[item.insuranceCode]]</small>
                                                </template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="8%" class="recipient-col">
                                                <template><small>[[item.invoiceReference]]</small></template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="20%" class="recipient-col">
                                                <template>
                                                    <small>
                                                        <template is="dom-if" if="[[!item.insurabilityCheck]]">
                                                            <iron-icon icon="vaadin:circle" class="assurability--redStatus"></iron-icon>
                                                        </template>
                                                        <template is="dom-if" if="[[item.insurabilityCheck]]">
                                                            <iron-icon icon="vaadin:circle" class="assurability--greenStatus"></iron-icon>
                                                        </template>
                                                            [[item.patientName]]
                                                    </small>
                                                </template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="8%" class="recipient-col">
                                                <template><small>[[item.patientSsin]]</small></template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="8%" class="recipient-col">
                                                <template><small>[[formatDate(item.invoiceDate,'date')]]</small></template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column-group>
                                                <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col">
                                                    <template class="border-left"><small><span class\$="[[_getTxtStatusColor(item.statut,item.reimbursement)]]">[[_formatAmount(item.reimbursement)]]€</span></small></template>
                                                    <!--<template class="footer">[[_formatAmount(totalInvoicesToBeSend.totalReimbursement)]]€</template>-->
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col">
                                                    <template><small><span class\$="[[_getTxtStatusColor(item.statut,item.patientIntervention)]]">[[_formatAmount(item.patientIntervention)]]€</span></small></template>
                                                    <!--<template class="footer">[[_formatAmount(totalInvoicesToBeSend.totalPatientIntervention)]]€</template>-->
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col">
                                                    <template><small><span class\$="[[_getTxtStatusColor(item.statut,item.doctorSupplement)]]">[[_formatAmount(item.doctorSupplement)]]€</span></small></template>
                                                    <!--<template class="footer">[[_formatAmount(totalInvoicesToBeSend.totalDoctorSupplement)]]€</template>-->
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col border-right">
                                                    <template class="border-right"><small><span class\$="[[_getTxtStatusColor(item.statut,item.totalAmount)]]">[[_formatAmount(item.totalAmount)]]€</span></small></template>
                                                    <!--<template class="footer">[[_formatAmount(totalInvoicesToBeSend.totalAmount)]]€</template>-->
                                                </vaadin-grid-column>
                                            </vaadin-grid-column-group>
                                            <vaadin-grid-column flex-grow="0" width="10%" class="recipient-col">
                                                <template><span class\$="invoice-status [[_getIconStatusClass(item.statut)]]"><iron-icon icon="vaadin:circle" class\$="statusIcon [[_getIconStatusClass(item.statut)]]"></iron-icon> [[item.statut]]</span></template>
                                            </vaadin-grid-column>
                                        </vaadin-grid>
                                        <vaadin-grid items="toggledDatas">
                                            <vaadin-grid-column flex-grow="0" width="4%" class="recipient-col">
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="10%" class="recipient-col">
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="8%" class="recipient-col">
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="20%" class="recipient-col">
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="8%" class="recipient-col">
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="8%" class="recipient-col">
                                                <template class="footer">[[localize('tot_sub','Sous-total',language)]] :</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column-group>
                                                <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col">
                                                    <template class="footer"><b>[[_formatAmount(item.sum.oa)]]€</b></template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col">
                                                    <template class="footer"><b>[[_formatAmount(item.sum.pat)]]€</b></template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col">
                                                    <template class="footer"><b>[[_formatAmount(item.sum.sup)]]€</b></template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col border-right">
                                                    <template class="footer"><b>[[_formatAmount(item.sum.tot)]]€</b></template>
                                                </vaadin-grid-column>
                                            </vaadin-grid-column-group>
                                            <vaadin-grid-column flex-grow="0" width="10%" class="recipient-col">
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="4%" class="recipient-col">
                                            </vaadin-grid-column>
                                        </vaadin-grid>
                                    </div>                                
                                </vaadin-accordion-panel>  
                             </vaadin-accordion>                                                
                        </template>
                          
                        <vaadin-grid>
                            <vaadin-grid-column flex-grow="0" width="4%" class="recipient-col">
                            </vaadin-grid-column>
                            <vaadin-grid-column flex-grow="0" width="10%" class="recipient-col">
                            </vaadin-grid-column>
                            <vaadin-grid-column flex-grow="0" width="8%" class="recipient-col">
                            </vaadin-grid-column>
                            <vaadin-grid-column flex-grow="0" width="20%" class="recipient-col">
                            </vaadin-grid-column>
                            <vaadin-grid-column flex-grow="0" width="8%" class="recipient-col">
                            </vaadin-grid-column>
                            <vaadin-grid-column flex-grow="0" width="8%" class="recipient-col">
                                <template class="footer">[[localize('tot_global','Total',language)]] :</template>
                            </vaadin-grid-column>
                            <vaadin-grid-column-group>
                                <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col">
                                    <template class="footer">[[_formatAmount(totalInvoicesToBeSend.totalReimbursement)]]€</template>
                                </vaadin-grid-column>
                                <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col">
                                    <template class="footer">[[_formatAmount(totalInvoicesToBeSend.totalPatientIntervention)]]€</template>
                                </vaadin-grid-column>
                                <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col">
                                    <template class="footer">[[_formatAmount(totalInvoicesToBeSend.totalDoctorSupplement)]]€</template>
                                </vaadin-grid-column>
                                <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col border-right">
                                    <template class="footer">[[_formatAmount(totalInvoicesToBeSend.totalAmount)]]€</template>
                                </vaadin-grid-column>
                            </vaadin-grid-column-group>
                            <vaadin-grid-column flex-grow="0" width="10%" class="recipient-col">
                            </vaadin-grid-column>
                            <vaadin-grid-column flex-grow="0" width="4%" class="recipient-col">
                            </vaadin-grid-column>
                        </vaadin-grid>
                    </div>
                </div>
                <div class="buttons">
                    <ht-spinner class="center" active="[[isReceiving]]"></ht-spinner>
                    <ht-spinner class="center" active="[[isSending]]"></ht-spinner>
                    <template is="dom-if" if="[[api.tokenId]]">
                        <paper-button on-tap="receiveInvoices" class="button button--other" disabled="[[cannotGet]]">[[localize('inv_get','Get',language)]]</paper-button>
                        <paper-button on-tap="_checkBeforeSend" class="button button--save" disabled="[[cannotSend]]">[[localize('inv_send','Send',language)]]</paper-button>
                    </template>
                    <template is="dom-if" if="[[!api.tokenId]]">
                        <paper-button on-tap="" class="button button--error" disabled="" title="Pas de connexion ehealth active">[[localize('inv_get','Get',language)]]</paper-button>
                        <paper-button on-tap="" class="button button--error" disabled="" title="Pas de connexion ehealth active">[[localize('inv_send','Send',language)]]</paper-button>
                    </template>

                </div>
            </template>
            <template is="dom-if" if="[[!statusToBeSend]]">
                    <div class="gridContainer">
                        <div class="invoiceContainer">
                            <div id="messagesGridContainer" class="invoiceSubContainerMiddle">
                                <template is="dom-if" if="[[isToBeCorrected(invoicesStatus.*)]]">
                                    <div id="toBeCorrected" class="gridContainer grid-pending">
                                        <div class="scrollBox">
                                            <vaadin-grid id="noscroll" class="pendingTable" theme="force-sizer" items="[[messagesByStatus(invoicesStatus,messagesProcessed,messagesRejected,messagesAccepted, messagesToBeCorrected, messagesArchived)]]" active-item="{{activeGridItem}}" on-tap="_showMessagesToBeCorrectedDetail">
                                                <vaadin-grid-column flex-grow="0" width="4%" class="recipient-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="sentMediumType">[[localize('inv_type','Type',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.sentMediumType]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="10%" class="recipient-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="insuranceCode">[[localize('inv_mut','Mutual',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.insuranceCode]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="8%" class="recipient-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="invoiceReference">[[localize('inv_num_fac','Invoice number',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.invoiceReference]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="20%" class="recipient-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="patientName">[[localize('inv_pat','Patient',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.patientName]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="8%" class="recipient-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="patientSsin">[[localize('inv_niss','Inss',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.patientSsin]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="8%" class="recipient-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="invoiceDate">[[localize('inv_date','Invoice date',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.invoiceDate]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column-group>
                                                    <!-- <template class="header hasBorder">Montants</template> -->
                                                    <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col">
                                                        <template class="header border-left">
                                                            <vaadin-grid-sorter path="reimbursement">[[localize('inv_oa','Oa',language)]]</vaadin-grid-sorter>
                                                        </template>
                                                        <template>[[_formatAmount(item.reimbursement)]]€</template>
                                                    </vaadin-grid-column>
                                                    <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col">
                                                        <template class="header">
                                                            <vaadin-grid-sorter path="patientIntervention">[[localize('inv_pat','Patient',language)]]</vaadin-grid-sorter>
                                                        </template>
                                                        <template>[[_formatAmount(item.patientIntervention)]]€</template>
                                                    </vaadin-grid-column>
                                                    <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col">
                                                        <template class="header">
                                                            <vaadin-grid-sorter path="doctorSupplement">[[localize('inv_supp','Extra',language)]]</vaadin-grid-sorter>
                                                        </template>
                                                        <template>[[_formatAmount(item.doctorSupplement)]]€</template>
                                                    </vaadin-grid-column>
                                                    <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col border-right">
                                                        <template class="header border-right">
                                                            <vaadin-grid-sorter path="totalAmount">[[localize('inv_tot','Total',language)]]</vaadin-grid-sorter>
                                                        </template>
                                                        <template>[[_formatAmount(item.totalAmount)]]€</template>
                                                    </vaadin-grid-column>
                                                </vaadin-grid-column-group>
                                                <vaadin-grid-column flex-grow="0" width="10%" class="recipient-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="statut">[[localize('inv_stat','Status',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>
                                                        <span class\$="invoice-status [[_getIconStatusClass(item.statut)]]"><iron-icon icon="vaadin:circle" class\$="statusIcon [[_getIconStatusClass(item.statut)]]"></iron-icon> [[item.statut]]</span>
                                                    </template>
                                                </vaadin-grid-column>
                                            </vaadin-grid>
                                        </div>
                                    </div>
                                </template>
                                <template is="dom-if" if="[[isProcess(invoicesStatus.*)]]">
                                    <div class="scrollBox">
                                        <vaadin-grid id="messagesGrid" class="processTable" items="[[messagesByStatus(invoicesStatus,messagesProcessed,messagesRejected,messagesAccepted, messagesToBeCorrected, messagesArchived)]]" active-item="{{activeGridItem}}" on-tap="_showDetail">
                                            <vaadin-grid-column flex-grow="0" width="14%" class="recipient-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.hcp">[[localize('inv_prest','Physician',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[item.messageInfo.hcp]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="4%" class="oa-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.oa">[[localize('inv_oa','Oa',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[item.messageInfo.oa]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="20%" class="ref-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.hcpReference">[[localize('inv_phys_ref','Physician reference',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[item.messageInfo.hcpReference]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="8%" class="invoice-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.invoiceNumber">[[localize('inv_batch_num','Batch reference',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[item.messageInfo.invoiceNumber]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="8%" class="month-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.invoiceMonth">[[localize('inv_batch_month','Billed month',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[formatDate(item.messageInfo.invoiceMonth,'month')]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="9%" class="invoiceDate-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.invoiceDate">[[localize('inv_date_fact','Invoice date',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[formatDate(item.messageInfo.invoiceDate,'date')]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="8%" class="invAmount-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.invoicedAmount"> [[localize('inv_batch_amount','Amount',language)]]<br>[[localize('inv_batch_amount_invoiced','Invoiced',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template><span class\$="[[_getTxtStatusColor(_getIconStatusClass(item.messageInfo.invoiceStatus),item.messageInfo.refusedAmount)]]">[[_formatAmount(item.messageInfo.invoicedAmount)]]€</span></template>
                                                <template class="footer">[[_invoicedAmount(invoicesStatus,messagesProcessed,messagesRejected,messagesAccepted, messagesToBeCorrected, messagesArchived)]]€</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="8%" class="accAmount-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.acceptedAmount">[[localize('inv_batch_amount','Amount',language)]]<br>[[localize('inv_batch_amount_acc','Accepted',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template><span class\$="[[_getTxtStatusColor(_getIconStatusClass(item.messageInfo.invoiceStatus),item.messageInfo.refusedAmount)]]">[[_formatAmount(item.messageInfo.acceptedAmount)]]€</span></template>
                                                <template class="footer">[[_acceptedAmount(invoicesStatus,messagesProcessed,messagesRejected,messagesAccepted, messagesToBeCorrected, messagesArchived)]]€</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="8%" class="refAmount-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.refusedAmount">[[localize('inv_batch_amount','Amount',language)]]<br>[[localize('inv_batch_amount_rej','Rejected',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template><span class\$="[[_getTxtStatusColor(_getIconStatusClass(item.messageInfo.invoiceStatus),item.messageInfo.refusedAmount)]]">[[_formatAmount(item.messageInfo.refusedAmount)]]€</span></template>
                                                <template class="footer">[[_refusedAmount(invoicesStatus,messagesProcessed,messagesRejected,messagesAccepted, messagesToBeCorrected, messagesArchived)]]€</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="10%" class="stat-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.refusedAmount">[[localize('inv_stat','Status',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template><span class\$="invoice-status [[_getIconStatusClass(item.messageInfo.invoiceStatus)]]"><iron-icon icon="vaadin:circle" class\$="statusIcon [[_getIconStatusClass(item.messageInfo.invoiceStatus)]]"></iron-icon> [[item.messageInfo.invoiceStatus]]</span></template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="3%" class="payPaid-col">
                                                <template class="header"></template>
                                                <template>
                                                    <iron-icon icon="vaadin:info-circle" id="[[item.id]]" class="helpdeskIcon" data-item\$="[[item]]" on-tap="_openHelpDeskDialogSupp"></iron-icon>
                                                </template>
                                            </vaadin-grid-column>
                                        </vaadin-grid>
                                    </div>
                                </template>
                                <template is="dom-if" if="[[isArchOrAcc(invoicesStatus.*)]]">
                                    <div class="scrollBox">
                                        <vaadin-grid id="messagesGrid" class="archiveAndAccepted" items="[[messagesByStatus(invoicesStatus,messagesProcessed,messagesRejected,messagesAccepted, messagesToBeCorrected, messagesArchived)]]" active-item="{{activeGridItem}}" on-tap="_showDetail">
                                            <vaadin-grid-column flex-grow="0" width="12%" class="recipient-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.hcp">[[localize('inv_prest','Physician',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[item.messageInfo.hcp]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="4%" class="oa-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.oa">[[localize('inv_oa','Oa',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[item.messageInfo.oa]]</template>
                                            </vaadin-grid-column>

                                            <vaadin-grid-column flex-grow="0" width="9%" class="invoice-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.invoiceNumber">[[localize('inv_batch_num','Batch number',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[item.messageInfo.invoiceNumber]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="9%" class="month-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.invoiceMonth">[[localize('inv_batch_month','Billed month',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[formatDate(item.messageInfo.invoiceMonth,'month')]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="9%" class="invoiceDate-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.invoiceDate">[[localize('inv_date_fact','Invoice date',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[formatDate(item.messageInfo.invoiceDate,'date')]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="9%" class="invAmount-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.invoicedAmount"> [[localize('inv_batch_amount','Amount',language)]] [[localize('inv_batch_amount_invoiced','Invoiced',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template><span class\$="[[_getTxtStatusColor(_getIconStatusClass(item.messageInfo.invoiceStatus),item.messageInfo.refusedAmount)]]">[[_formatAmount(item.messageInfo.invoicedAmount)]]€</span></template>
                                                <template class="footer">[[_invoicedAmount(invoicesStatus,messagesProcessed,messagesRejected,messagesAccepted, messagesToBeCorrected, messagesArchived)]]€</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="9%" class="accAmount-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.acceptedAmount">[[localize('inv_batch_amount','Amount',language)]] [[localize('inv_batch_amount_acc','Accepted',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <!--<template><span class\$="[[_getTxtStatusColor(item.messageInfo.invoiceStatus,item.messageInfo.acceptedAmount)}}">[[_formatAmount(item.messageInfo.acceptedAmount)]]€</span></template>-->
                                                <template><span class\$="[[_getTxtStatusColor('force-green',item.messageInfo.acceptedAmount)]]">[[_formatAmount(item.messageInfo.acceptedAmount)]]€</span></template>
                                                <template class="footer">[[_acceptedAmount(invoicesStatus,messagesProcessed,messagesRejected,messagesAccepted, messagesToBeCorrected, messagesArchived)]]€</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="9%" class="refAmount-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.refusedAmount">[[localize('inv_batch_amount','Amount',language)]] [[localize('inv_batch_amount_rej','Rejected',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template><span class\$="[[_getTxtStatusColor('force-red',item.messageInfo.refusedAmount)]]">[[_formatAmount(item.messageInfo.refusedAmount)]]€</span></template>
                                                <template class="footer">[[_refusedAmount(invoicesStatus,messagesProcessed,messagesRejected,messagesAccepted, messagesToBeCorrected)]]€</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="10%" class="stat-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.refusedAmount">[[localize('inv_stat','Status',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template><span class\$="invoice-status [[_getIconStatusClass(item.messageInfo.invoiceStatus)]]"><iron-icon icon="vaadin:circle" class\$="statusIcon [[_getIconStatusClass(item.messageInfo.invoiceStatus)]]"></iron-icon> [[item.messageInfo.invoiceStatus]]</span></template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column-group>
                                               <template class="header hasBorder">[[localize('inv_batch_paid_informations','Paid information',language)]]</template>
                                                <vaadin-grid-column flex-grow="0" width="7%" class="reject-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="messageInfo.paymentReference">[[localize('inv_batch_paid_reference','Ref',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.messageInfo.paymentReference]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="7%" class="reject-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="messageInfo.amountPaid">[[localize('inv_batch_amount','Amount',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[_formatAmount(item.messageInfo.amountPaid)]]€</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="7%" class="reject-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="messageInfo.paid">[[localize('inv_batch_amount_paid','Paid',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[_getPaidStatus(item.messageInfo.paid)]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="7%" class="reject-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="messageInfo.paymentAccount">[[localize('inv_batch_bank_account','Bank account',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.messageInfo.paymentAccount]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="7%" class="reject-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="messageInfo.paymentDate">[[localize('inv_batch_paid_date','Payement date',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.messageInfo.paymentDate]]</template>
                                                </vaadin-grid-column>
                                            </vaadin-grid-column-group>
                                            <vaadin-grid-column flex-grow="0" width="17%" class="ref-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.hcpReference">[[localize('inv_phys_ref','Physician reference',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[item.messageInfo.hcpReference]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="3%" class="payPaid-col">
                                                <template class="header"></template>
                                                <template>
                                                    <iron-icon icon="vaadin:info-circle" id="[[item.id]]" class="helpdeskIcon" data-item\$="[[item]]" on-tap="_openHelpDeskDialogSupp"></iron-icon>
                                                </template>
                                            </vaadin-grid-column>
                                        </vaadin-grid>
                                    </div>
                                </template>
                                <template is="dom-if" if="[[isReject(invoicesStatus.*)]]">
                                    <div class="scrollBox">
                                        <vaadin-grid id="messagesGrid" class="rejectedTable" items="[[messagesByStatus(invoicesStatus,messagesProcessed,messagesRejected,messagesAccepted, messagesToBeCorrected, messagesArchived)]]" active-item="{{activeGridItem}}" on-tap="_showDetail" selected="{{selectedInvoiceIndex}}">
                                            <vaadin-grid-column flex-grow="0" width="14%" class="recipient-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.hcp">[[localize('inv_prest','Physician',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[item.messageInfo.hcp]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="4%" class="oa-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.oa">[[localize('inv_oa','Oa',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[item.messageInfo.oa]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="17%" class="ref-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.hcpReference">[[localize('inv_phys_ref','Physician reference',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[item.messageInfo.hcpReference]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="8%" class="invoice-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.invoiceNumber">[[localize('inv_batch_num','Batch number',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[item.messageInfo.invoiceNumber]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="8%" class="month-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.invoiceMonth">[[localize('inv_batch_month','Invoiced month',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[formatDate(item.messageInfo.invoiceMonth,'month')]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="9%" class="invoiceDate-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.invoiceDate">[[localize('inv_date_fact','Invoice date',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[formatDate(item.messageInfo.invoiceDate,'date')]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="7%" class="invAmount-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.invoicedAmount"> [[localize('inv_batch_amount','Amount',language)]] [[localize('inv_batch_amount_invoiced','Invoiced',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template><span class\$="[[_getTxtStatusColor(_getIconStatusClass(item.messageInfo.invoiceStatus),item.messageInfo.refusedAmount)]]">[[_formatAmount(item.messageInfo.invoicedAmount)]]€</span></template>
                                                <template class="footer">[[_invoicedAmount(invoicesStatus,messagesProcessed,messagesRejected,messagesAccepted, messagesToBeCorrected, messagesArchived)]]€</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="7%" class="accAmount-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.acceptedAmount">[[localize('inv_batch_amount','Amount',language)]] [[localize('inv_batch_amount_acc','Accepted',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template><span class\$="[[_getTxtStatusColor(_getIconStatusClass(item.messageInfo.invoiceStatus),item.messageInfo.refusedAmount)]]">[[_formatAmount(item.messageInfo.acceptedAmount)]]€</span></template>
                                                <template class="footer">[[_acceptedAmount(invoicesStatus,messagesProcessed,messagesRejected,messagesAccepted, messagesToBeCorrected, messagesArchived)]]€</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="7%" class="refAmount-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.refusedAmount">[[localize('inv_batch_amount','Amount',language)]] [[localize('inv_batch_amount_rej','Rejected',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template><span class\$="[[_getTxtStatusColor(item.messageInfo.invoiceStatus,item.messageInfo.refusedAmount)]]">[[_formatAmount(item.messageInfo.refusedAmount)]]€</span></template>
                                                <template class="footer">[[_refusedAmount(invoicesStatus,messagesProcessed,messagesRejected,messagesAccepted, messagesToBeCorrected, messagesArchived)]]€</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="6%" class="stat-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.refusedAmount">[[localize('inv_stat','Status',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template><span class\$="invoice-status [[_getIconStatusClass(item.messageInfo.invoiceStatus)]]"><iron-icon icon="vaadin:circle" class\$="statusIcon [[_getIconStatusClass(item.messageInfo.invoiceStatus)]]"></iron-icon> [[item.messageInfo.invoiceStatus]]</span></template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="7%" class="reject-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="messageInfo.rejectionReason">Motif rejet</vaadin-grid-sorter>
                                                </template>
                                                <template>[[item.messageInfo.rejectionReason]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="3%" class="payPaid-col">
                                                <template class="header"></template>
                                                <template>
                                                    <iron-icon icon="vaadin:info-circle" id="[[item.id]]" class="helpdeskIcon" data-item\$="[[item]]" on-tap="_openHelpDeskDialogSupp"></iron-icon>
                                                </template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="3%" class="payPaid-col">
                                                <template class="header"></template>
                                                <template>
                                                    <template is="dom-if" if="[[item.messageInfo.allInvoicesIsCorrected]]">
                                                        <iron-icon icon="vaadin:archive" class="helpdeskIcon"></iron-icon>
                                                    </template>
                                                </template>
                                            </vaadin-grid-column>

                                        </vaadin-grid>
                                    </div>
                                </template>
                            </div>
                            <template is="dom-if" if="[[ifInvoiceSelected]]">
                                <template is="dom-if" if="[[isToBeCorrected(invoicesStatus.*)]]">
                                    <h4 class="mb0">Détail de la facture n°[[activeGridItem.invoice.invoiceReference]]
                                        <paper-button on-tap="_openInvoicingDialog" class="button alignRight" id="[[activeGridItem.invoice.id]]">Corriger</paper-button>
                                        <paper-button class="grid-btn-small button button--rejected alignRight" on-tap="_flagInvoiceAsLostConfirmationDialog" data-invoice-id\$="[[activeGridItem.invoice.id]]"><iron-icon icon="error" class="force-left" data-invoice-id\$="[[activeGridItem.invoice.id]]"></iron-icon> &nbsp; [[localize('invoiceIsUnrecoverable',"Unrecoverable invoice",language)]]</paper-button>
                                    </h4>
                                    <template is="dom-if" if="[[activeGridItem.invoice.error]]">
                                        <h6 class="invoice-error-msg">[[activeGridItem.invoice.error]]</h6>
                                    </template>
                                    <div id="toBeCorrectedDetailContainer" class="toBeCorrectedContainerDetail">
                                        <vaadin-grid id="toBeCorrectedGridDetail" items="[[toBeCorrectedMessageDetail]]">
                                            <vaadin-grid-column class="recipient-col">
                                                <template class="header">[[localize('inv_batch_paid_date','Date',language)]]</template>
                                                <template>[[formatDate(item.dateCode,'date')]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column class="recipient-col">
                                                <template class="header">Code</template>
                                                <template>[[item.code]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column class="recipient-col">
                                                <template class="header">Libellé</template>
                                                <template>[[item.label]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column class="recipient-col">
                                                <template class="header">PR</template>
                                                <template>[[item.relatedCode]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column class="recipient-col">
                                                <template class="header">Tp</template>
                                                <template>[[item.insuranceJustification]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column-group class="hasBorder">
                                                <template class="header">[[localize('inv_batch_amount','Amount',language)]]</template>
                                                <vaadin-grid-column class="recipient-col">
                                                    <template class="header">OA</template>
                                                    <template><span class\$="[[_getTxtStatusColor(item.messageInfo.invoiceStatus,item.reimbursement)]]">[[_formatAmount(item.reimbursement)]]</span></template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column class="recipient-col">
                                                    <template class="header">Patient</template>
                                                    <template><span class\$="[[_getTxtStatusColor(item.messageInfo.invoiceStatus,item.patientIntervention)]]">[[_formatAmount(item.patientIntervention)]]</span></template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column class="recipient-col">
                                                    <template class="header">Supplément</template>
                                                    <template><span class\$="[[_getTxtStatusColor(item.messageInfo.invoiceStatus,item.doctorSupplement)]]">[[_formatAmount(item.doctorSupplement)]]</span></template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column class="recipient-col">
                                                    <template class="header">Total</template>
                                                    <template><span class\$="[[_getTxtStatusColor(item.messageInfo.invoiceStatus,item.totalAmount)]]">[[_formatAmount(item.totalAmount)]]</span></template>
                                                </vaadin-grid-column>
                                            </vaadin-grid-column-group>
                                            <vaadin-grid-column class="recipient-col" width="300px">
                                                <template class="header">Erreur</template>
                                                <template><span class\$="[[_getIconStatusClass(item.error)]]">[[item.error]]</span></template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column class="recipient-col">
                                                <template class="header"></template>
                                                <template>
                                                    <iron-icon class="edit-invoice" icon="vaadin:pencil" id="edit-[[item.id]]" on-tap="_openInvoicingDialog"></iron-icon>
                                                </template>
                                            </vaadin-grid-column>
                                        </vaadin-grid>
                                        <paper-tooltip for="edit-[[item.id]]" position="left">[[localize('edit','Edit',language)]]</paper-tooltip>
                                    </div>
                                </template>
                                <template is="dom-if" if="[[!isToBeCorrected(invoicesStatus.*)]]">
                                    <h4 class="invoice-detail-title mb0">Détail de l'envoi n°[[activeGridItem.message.externalRef]] de l'oa [[activeGridItem.messageInfo.oa]]
                                        <template is="dom-if" if="[[!isArchived(invoicesStatus.*)]]">
                                            <paper-button class="button button--other alignRight" on-tap="_openArchiveDialogForBatch">Archiver</paper-button>
                                        </template>
                                        <template is="dom-if" if="[[isSendError]]">
                                            <paper-button class="button button--other alignRight" on-tap="_transferInvoicesForResending">Transférer pour réenvoi</paper-button>
                                        </template>
                                    </h4>
                                    <template is="dom-if" if="[[invoicesErrorMsg]]">
                                        <h2 class="invoice-error-msg mb0 invoice-status--redStatus">[[invoicesErrorMsg]]</h2>
                                    </template>
                                    <paper-input id="filter" class="invoice-filter" label="[[localize('fil','Filter',language)]]" value="{{selectedInputDetail}}" on-keyup="refreshFilter" param="selectedInputDetail" where="invoiceSelected"></paper-input>
                                    <div id="invoiceDetailContainer" class="invoiceDetailContainer">
                                        <vaadin-grid id="invoiceGridDetail" data-provider="[[_batchDetailDataProvider()]]">
                                            <vaadin-grid-column flex-grow="0" width="96px" class="recipient-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="invoiceReference">N° fact.</vaadin-grid-sorter>
                                                </template>
                                                <template>
                                                    <vaadin-grid-tree-toggle leaf="[[!item.invoicingCodes.length]]" expanded="{{expanded}}" level="[[level]]">
                                                        [[item.invoiceReference]]
                                                    </vaadin-grid-tree-toggle>
                                                </template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="160px" class="recipient-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="patientName">[[localize('inv_pat','Patient',language)]] </vaadin-grid-sorter>
                                                </template>
                                                <template>[[item.patient]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="8%" class="recipient-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="ssin">[[localize('inv_niss','Niss',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[item.ssin]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="5%" class="recipient-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="invoicingCode">Nmcl</vaadin-grid-sorter>
                                                </template>
                                                <template>[[item.invoicingCode]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="invoiceDate">Date presta.</vaadin-grid-sorter>
                                                </template>
                                                <template>[[formatDate(item.invoiceDate,'date')]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column-group>
                                                <vaadin-grid-column flex-grow="0" width="5%" class="recipient-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="invoicedAmount">[[localize('inv_batch_amount','Amount',language)]]<br>[[localize('inv_batch_amount_invoiced','Invoiced',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template><span class\$="[[_getTxtStatusColor(item.statut,item.totalAmount)]]">[[_formatAmount(item.invoicedAmount)]]€</span></template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="5%" class="recipient-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="acceptedAmount">[[localize('inv_batch_amount','Amount',language)]]<br>[[localize('inv_batch_amount_acc','Accepted',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template><span class\$="[[_getTxtStatusColor('force-green',item.acceptedAmount)]]">[[_formatAmount(item.acceptedAmount)]]€</span></template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="5%" class="recipient-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="refusedAmount">[[localize('inv_batch_amount','Amount',language)]]<br>[[localize('inv_batch_amount_rej','Rejected',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template><span class\$="[[_getTxtStatusColor('force-red',item.refusedAmount)]]">[[_formatAmount(item.refusedAmount)]]€</span></template>
                                                </vaadin-grid-column>
                                            </vaadin-grid-column-group>
                                            <vaadin-grid-column flex-grow="0" width="36%" class="rejectionReason-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="rejectionReason">Motif de rejet</vaadin-grid-sorter>
                                                </template>
                                                <template style="align-self: flex-start;">
                                                    <div class="rejectionReason-cell">[[item.rejectionReason]]</div>
                                                </template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="5%" class="recipient-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="paid">Payé</vaadin-grid-sorter>
                                                </template>
                                                <template><span class\$="[[_getTxtStatusColor(item.statut,item.paid)]]">[[_formatAmount(item.paid)]]€</span></template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="10%" class="recipient-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="status">[[localize('inv_stat','Status',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>
                                                    <span class\$="invoice-status [[_getIconStatusClass(item.status))]]"><iron-icon icon="vaadin:circle" class\$="statusIcon [[_getIconStatusClass(item.status)]]"></iron-icon> [[item.status]]</span>
                                                </template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="3%" class="recipient-col">
                                                <template class="header"></template>
                                                <template>
                                                    <iron-icon icon="vaadin:info-circle" id="[[item.id]]" class="helpdeskIcon" data-item\$="[[item]]" on-tap="_openHelpDeskDialogDet"></iron-icon>
                                                </template>
                                            </vaadin-grid-column>
                                        </vaadin-grid>
                                    </div>
                                </template>
                            </template>
                        </div>
                    </div>
                </template>

            </div>

            <ht-pat-invoicing-dialog id="invoicingForm" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patientFromSelectedInvoice]]" i18n="[[i18n]]" resources="[[resources]]"></ht-pat-invoicing-dialog>

        <paper-dialog id="pendingDetailDialog">
                <div>
                    Détail de l'envoi n° [[activeGridItem.invoice.invoiceReference]]
                    <paper-input label="Patient" value="[[activeGridItem.patient.firstName]] [[activeGridItem.patient.lastName]]" readonly=""></paper-input>
                    <paper-input label="Mutuelle" value="[[activeGridItem.insuranceCode]]" readonly=""></paper-input>
                </div>
                    <vaadin-grid id="pendingGridDetail" items="[[activeGridItem.invoice.invoicingCodes]]">
                        <vaadin-grid-column width="7%" class="recipient-col">
                            <template class="header">Date</template>
                            <template>[[formatDate(item.dateCode,"date")]]</template>
                        </vaadin-grid-column>
                        <vaadin-grid-column width="7%" class="recipient-col">
                            <template class="header">Code</template>
                            <template>[[item.code]]</template>
                        </vaadin-grid-column>
                        <vaadin-grid-column width="25%" class="recipient-col">
                            <template class="header">Libellé</template>
                            <template>[[item.label]]</template>
                        </vaadin-grid-column>
                        <vaadin-grid-column width="7%" class="recipient-col">
                            <template class="header">PR</template>
                            <template>[[item.relatedCode]]</template>
                        </vaadin-grid-column>
                        <vaadin-grid-column width="4%" class="recipient-col">
                            <template class="header">Tp</template>
                            <template>[[item.insuranceJustification]]</template>
                        </vaadin-grid-column>
                        <vaadin-grid-column width="13%" class="recipient-col">
                            <template class="header">N° engagement</template>
                            <template>[[item.contract]]</template>
                        </vaadin-grid-column>
                        <vaadin-grid-column-group class="hasBorder">
                            <template class="header">Montants</template>
                            <vaadin-grid-column width="9%" class="recipient-col">
                                <template class="header">OA</template>
                                <template><span class\$="[[_getTxtStatusColor(item.messageInfo.invoiceStatus,item.reimbursement)]]">[[_formatAmount(item.reimbursement)]]</span></template>
                                <template class="footer">[[sumReimb]] €</template>
                            </vaadin-grid-column>
                            <vaadin-grid-column width="9%" class="recipient-col">
                                <template class="header">Patient</template>
                                <template><span class\$="[[_getTxtStatusColor(item.messageInfo.invoiceStatus,item.patientIntervention)]]">[[_formatAmount(item.patientIntervention)]]</span></template>
                                <template class="footer">[[sumPatInter]] €</template>
                            </vaadin-grid-column>
                            <vaadin-grid-column width="9%" class="recipient-col">
                                <template class="header">Supplément</template>
                                <template><span class\$="[[_getTxtStatusColor(item.messageInfo.invoiceStatus,item.doctorSupplement)]]">[[_formatAmount(item.doctorSupplement)]]</span></template>
                                <template class="footer">[[sumDoctorSup]] €</template>
                            </vaadin-grid-column>
                            <vaadin-grid-column width="9%" class="recipient-col">
                                <template class="header">Total</template>
                                <template><span class\$="[[_getTxtStatusColor(item.messageInfo.invoiceStatus,item.totalAmount)]]">[[_formatAmount(item.totalAmount)]]</span></template>
                                <template class="footer">[[sumTot]] €</template>
                            </vaadin-grid-column>
                        </vaadin-grid-column-group>
                    </vaadin-grid>
            </paper-dialog>
        

        <paper-dialog id="helpdeskInfoDialog">
            <h2 class="modal-title">Info Helpdesk</h2>
            <div class="modal-content">
                <paper-input class="flex-container-nmcl-row modal-input" always-float-label="" label="OA" value="[[infoHelpdesk.messageInfo.oa]]" readonly=""></paper-input>
                <paper-input class="flex-container-nmcl-row modal-input" always-float-label="" label="Inami tiers facturant" value="[[hcp.nihii]]" readonly=""></paper-input>
                <paper-input class="flex-container-nmcl-row modal-input" always-float-label="" label="N° envoi" value="[[infoHelpdesk.messageInfo.invoiceNumber]]" readonly=""></paper-input>
                <paper-input class="flex-container-nmcl-row modal-input" always-float-label="" label="Mois et année de facturation" value="[[infoHelpdesk.messageInfo.invoiceMonth]]" readonly=""></paper-input>
                <paper-input class="flex-container-nmcl-row modal-input" always-float-label="" label="Date d'envoi du fichier" value="[[_dateFormat(infoHelpdesk.message.sent)]]" readonly=""></paper-input>
                <paper-input class="flex-container-nmcl-row modal-input" always-float-label="" label="Date dernière réponse OA" value="" readonly=""></paper-input>
                <paper-input class="flex-container-nmcl-row modal-input" always-float-label="" label="Type dernière réponse OA" value="" readonly=""></paper-input>
                <paper-input class="flex-container-nmcl-row modal-input" always-float-label="" label="Montant facturé" value="[[infoHelpdesk.messageInfo.invoicedAmount]]" readonly=""><div slot="suffix">€</div></paper-input>
                <paper-input class="flex-container-nmcl-row modal-input" always-float-label="" label="Nom du soft" value="TOPAZ" readonly=""></paper-input>
                <paper-input class="flex-container-nmcl-row modal-input" always-float-label="" label="N° de tél de contact médecin" value="[[mobile]]" readonly=""></paper-input>
                <template is="dom-if" if="[[isCompleteHelpDesk]]">
                    <paper-input class="flex-container-nmcl-row modal-input" always-float-label="" label="Patient" value="[[infoHelpdeskDet.patient]]" readonly=""></paper-input>
                    <paper-input class="flex-container-nmcl-row modal-input" always-float-label="" label="Niss" value="[[infoHelpdeskDet.ssin]]" readonly=""></paper-input>
                    <paper-input class="flex-container-nmcl-row modal-input" always-float-label="" label="Prestation" value="[[infoHelpdeskDet.invoiceDate]]" readonly=""></paper-input>
                    <paper-input class="flex-container-nmcl-row modal-input" always-float-label="" label="Date de la prestation" value="[[_dateFormat(infoHelpdeskDet.invoiceDate)]]" readonly=""></paper-input>
                    <paper-input class="flex-container-nmcl-row modal-input" always-float-label="" label="Montant facturé" value="[[infoHelpdeskDet.invoicedAmount]]" readonly=""><div slot="suffix">€</div></paper-input>
                    <paper-input class="flex-container-nmcl-row modal-input" always-float-label="" label="Montant accepté" value="[[infoHelpdeskDet.acceptedAmount]]" readonly=""><div slot="suffix">€</div></paper-input>
                    <paper-input class="flex-container-nmcl-row modal-input" always-float-label="" label="Montant refusé" value="[[infoHelpdeskDet.refusedAmount]]" readonly=""><div slot="suffix">€</div></paper-input>
                    <paper-textarea class="flex-container-nmcl-row modal-input" always-float-label="" label="Motif(s) de rejet" value="[[infoHelpdeskDet.rejectionReason]]" readonly=""></paper-textarea>
                </template>
            </div>
            <div class="buttons">
                <paper-button class="button" dialog-dismiss="">[[localize('clo','Close',language)]]</paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="archiveDialog">
            <h2 class="modal-title">Archivage de l'envoi n°</h2>
            <div class="archiveDialogContent">
                Voulez-vous vraiment archiver votre envoi ?
            </div>
            <div class="buttons">
                <paper-button class="button" dialog-dismiss="">[[localize('clo','Close',language)]]</paper-button>
                <paper-button class="button button--save" on-tap="_archiveBatch">[[localize('confirm','Confirm',language)]]</paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="warningBeforeSend">
            <h2 class="modal-title">[[localize('pre_chk_bef_inv','Pre check before invoice',language)]]</h2>

            <div class="previousCheck">
                <h4>[[localize('pr_ctr_block_inv','Prior control(s) blocking(s)',language)]]</h4>
                <template is="dom-if" if="[[checkBeforeSendEfact.inamiCheck]]">
                    <div class="errorBeforeSendInvoice">[[localize('pr_nihii_inv','- Nihii invalid',language)]]</div>
                </template>
                <template is="dom-if" if="[[checkBeforeSendEfact.ssinCheck]]">
                    <div class="errorBeforeSendInvoice">[[localize('pr_ssin_inv','- Ssin invalid',language)]]</div>
                </template>
                <template is="dom-if" if="[[checkBeforeSendEfact.bceCheck]]">
                    <div class="errorBeforeSendInvoice">[[localize('pr_cbe_inv','- Cbe invalid',language)]]</div>
                </template>
                <template is="dom-if" if="[[checkBeforeSendEfact.ibanCheck]]">
                    <div class="errorBeforeSendInvoice">[[localize('pr_iban_inv','- Iban invalid',language)]]</div>
                </template>
                <template is="dom-if" if="[[checkBeforeSendEfact.bicCheck]]">
                    <div class="errorBeforeSendInvoice">[[localize('pr_bic_inv','- Bic invalid',language)]]</div>
                </template>

                <template is="dom-if" if="[[!checkBeforeSendEfact.invoiceCheck100]]">
                    <div class="errorBeforeSendInvoice">[[localize('pr_inv_numb_OA100_inv','- Anomaly detected on the invoiceNumber for OA100. Please contact helpdesk',language)]]</div>
                </template>
                <template is="dom-if" if="[[!checkBeforeSendEfact.invoiceCheck200]]">
                    <div class="errorBeforeSendInvoice">[[localize('pr_inv_numb_OA200_inv','- Anomaly detected on the invoiceNumber for OA200. Please contact helpdesk',language)]</div>
                </template>
                <template is="dom-if" if="[[!checkBeforeSendEfact.invoiceCheck300]]">
                    <div class="errorBeforeSendInvoice">[[localize('pr_inv_numb_OA300_inv','- Anomaly detected on the invoiceNumber for OA300. Please contact helpdesk',language)]]</div>
                </template>
                <template is="dom-if" if="[[!checkBeforeSendEfact.invoiceCheck306]]">
                    <div class="errorBeforeSendInvoice">[[localize('pr_inv_numb_OA306_inv','- Anomaly detected on the invoiceNumber for OA306. Please contact helpdesk',language)]]</div>
                </template>
                <template is="dom-if" if="[[!checkBeforeSendEfact.invoiceCheck400]]">
                    <div class="errorBeforeSendInvoice">[[localize('pr_inv_numb_OA400_inv','- Anomaly detected on the invoiceNumber for OA400. Please contact helpdesk',language)]]</div>
                </template>
                <template is="dom-if" if="[[!checkBeforeSendEfact.invoiceCheck500]]">
                    <div class="errorBeforeSendInvoice">[[localize('pr_inv_numb_OA500_inv','- Anomaly detected on the invoiceNumber for OA500. Please contact helpdesk',language)]]</div>
                </template>
                <template is="dom-if" if="[[!checkBeforeSendEfact.invoiceCheck600]]">
                    <div class="errorBeforeSendInvoice">[[localize('pr_inv_numb_OA600_inv','- Anomaly detected on the invoiceNumber for OA600. Please contact helpdesk',language)]]</div>
                </template>
                <template is="dom-if" if="[[!checkBeforeSendEfact.invoiceCheck900]]">
                    <div class="errorBeforeSendInvoice">[[localize('pr_inv_numb_OA900_inv','- Anomaly detected on the invoiceNumber for OA900. Please contact helpdesk',language)]]</div>
                </template>
            </div>
            <template is="dom-if" if="[[patientWithoutMutuality.length]]">
                <div class="unsentInvoice">
                    <h4>[[localize('pr_don_send_inv','Next invoice don't be send',language)]]</h4>
                    <vaadin-grid id="patientsWithoutAssurabilityGrid" items="[[patientWithoutMutuality]]">
                        <vaadin-grid-column class="recipient-col">
                            <template class="header">
                                <vaadin-grid-sorter path="patientName">[[localize('pr_pat_inv','Patient',language)]]</vaadin-grid-sorter>
                            </template>
                            <template>[[item.patientName]]</template>
                        </vaadin-grid-column>
                        <vaadin-grid-column class="recipient-col">
                            <template class="header">
                                <vaadin-grid-sorter>Cause</vaadin-grid-sorter>
                            </template>
                            <template>[[localize('pr_pat_ass_inf_inv','Patient without assurability information',language)]]</template>
                        </vaadin-grid-column>
                    </vaadin-grid>
                </div>
            </template>
            <div class="buttons">
                <paper-button class="button" dialog-dismiss="">[[localize('clo','Close',language)]]</paper-button>
                <template is="dom-if" if="[[patientWithoutMutuality.length]]">
                    <paper-button class="button button--save" on-tap="sendInvoices">[[localize('continue','Continue',language)]]</paper-button>
                </template>
            </div>
        </paper-dialog>

        <paper-dialog class="modalDialog" id="flagInvoiceAsLostConfirmationDialog" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
            <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
            <div class="modalDialogContent m-t-50">
                <h3 class="textAlignCenter">[[localize('areYouSureFlagInvoiceAsLost','Are you sure you wish to flag invoice as permanently lost?',language)]]</h3>
                <p class="textAlignCenter m-t-50 bold">[[localize('unrecoverableAction','This action is unrecoverable',language)]].</p>
            </div>
            <div class="buttons">
                <paper-button class="button" on-tap="_closeDialogs">[[localize('can','Cancel',language)]]</paper-button>
                <paper-button class="button button--save" on-tap="_flagInvoiceAsLost"><iron-icon icon="check-circle"></iron-icon> [[localize('confirm','Confirm',language)]]</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-msg-invoice';
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
          },
          selectedMessages: {
              type: Object,
              notify: true
          },
          activeItem: {
              type: Object
          },
          messages: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          selectList: {
              type: Object
          },
          totalInvoicesToBeSend:{
              type: Object,
              value : () => ({
                  totalReimbursement:          Number(0.00).toFixed(2),
                  totalAmount:                 Number(0.00).toFixed(2),
                  totalPatientIntervention:    Number(0.00).toFixed(2),
                  totalDoctorSupplement:       Number(0.00).toFixed(2)
              })
          },
          invoicesStatus: {
              type: String,
              observer: '_invoicesStatusChanged'
          },
          statusToBeSend:{
              type: Boolean,
              value: true
          },
          selectedInvoicesToBeSend:{
              type: Object,
              value : () => ({})
          },
          messagesToBeCorrected:{
              type: Object,
              value : () => ({})
          },
          selectedInvoicesByStatus:{
              type: Object,
              value : () => ({})
          },
          multiSort:{
              type: Boolean,
              value: true
          },
          activeGridItem:{
              type: Object,
              value: function () {
                  return [];
              }
          },
          filterValue:{
              type: String,
              value: ""
          },
          filterPath:{
              type:String,
              value: "invoice.patient.firstName"
          },
          btnSelectionPatient: {
              type: Boolean,
              value: false,
              notify: true
          },
          showInactive: {
              type: Boolean,
              value: false
          },
          ifInvoiceSelected: {
              type: Boolean,
              value: true
          },
          level :{
              type : Number,
              value : 0
          },
          expanded : {
              type : Boolean,
              value : true
          },
          invoicesFromBatch:{
              type: Object,
              value: function () {
                  return [];
              }
          },
          invoicesErrorMsg: {
              type: String,
              value: ""
          },
          toBeCorrectedMessageDetail:{
              type: Object,
              value: function () {
                  return [];
              }
          },
          infoHelpdesk:{
              type : Object
          },
          isCompleteHelpDesk:{
              type: Boolean
          },
          infoHelpdeskDet:{
              type: Object
          },
          mobile :{
              type: String
          },
          displayedYear: {
              type: Number,
              value: () => Number(moment().format('YYYY'))
          },
          processing:{
              type: Boolean,
              value: false
          },
          archOrAcc:{
              type: Boolean,
              value:false
          },
          toBeCorr:{
              type: Boolean,
              value: false
          },
          patientFromSelectedInvoice:{
              type: Object
          },
          selectedInvoiceIndex:{
              type : Number
          },
          messageIdsCanBeAutoArchived:{
              type: Array,
              value: []
          },
          isMessagesLoaded:{
              type: Boolean,
              value: false,
          },
          sumReimb:{
              type: Object,
              value : "0.00"
          },
          sumPatInter:{
              type: Object,
              value : "0.00"
          },
          sumDoctorSup:{
              type: Object,
              value : "0.00"
          },
          sumTot:{
              type: Object,
              value: "0.00"
          },
          cannotSend: {
              type: Boolean,
              value: false
          },
          cannotGet: {
              type: Boolean,
              value: false
          },
          patientWithoutMutuality:{
              type: Array,
              value: () => []
          },
          checkBeforeSendEfact:{
              type: Object,
              value: () => ({
                  inamiCheck : false,
                  ssinCheck: false,
                  bceCheck: false,
                  ibanCheck: false,
                  bicCheck: false,
                  invoiceCheck100: false,
                  invoiceCheck200: false,
                  invoiceCheck300: false,
                  invoiceCheck306: false,
                  invoiceCheck400: false,
                  invoiceCheck500: false,
                  invoiceCheck600: false,
                  invoiceCheck900: false
              })
          },
          isSendError:{
              type: Boolean,
              value: false
          },
          _isLoading: {
              type: Boolean,
              value: false,
              observer: '_loadingStatusChanged'
          },
          _bodyOverlay: {
              type: Boolean,
              value: false
          },
          _isLoadingSmall: {
              type: Boolean,
              value: false
          },
          flagInvoiceAsLostId: {
              type: String,
              value: ""
          }
      };
  }

  constructor() {
      super();
  }

  static get observers() {
      return ['_invoicesChange(invoices.*)', '_detailsChanged(invoicesFromBatch.*)','activeGridItemChanged(activeGridItem)'];
  }

  activeGridItemChanged(item){
      if(!item || item.length===0)return;
      console.log("selected:",item)
      // this.set("sumReimb", _.reduce(item.invoice.invoicingCodes,(sum, n)=>{return sum + n.reimbursement;}, 0))
      // this.set("sumPatInter",_.reduce(item.invoice.invoicingCodes,(sum, n)=>{return sum + n.patientIntervention;}, 0))
      // this.set("sumDoctorSup", _.reduce(item.invoice.invoicingCodes,(sum, n)=>{return sum + n.doctorSupplement;}, 0))
      // this.set("sumTot",_.reduce(item.invoice.invoicingCodes,(sum, n)=>{return sum + n.reimbursement + n.doctorSupplement + n.patientIntervention;}, 0))
  }

  ready() {
      super.ready();
      this.set("isMessagesLoaded",false)
      this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(response =>{
          this.set("hcp",response)
      })

      const LastSend = parseInt(localStorage.getItem('lastInvoicesSent')) ? parseInt(localStorage.getItem('lastInvoicesSent')) : -1
      const maySend = (LastSend < Date.now() + 24*60*60000 || LastSend===-1)
      this.set('cannotSend',!maySend)
      const LastGet = parseInt(localStorage.getItem('lastInvoicesGet')) ? parseInt(localStorage.getItem('lastInvoicesGet')) : -1
      const mayGet = (LastGet < Date.now() + 24*60*60000 || LastGet===-1)
      this.set('cannotGet',!mayGet)
  }

  _detailsChanged() {
      const igd = this.root.querySelector('#invoiceGridDetail')
      igd && igd.clearCache()
  }


  fetchMessageToBeSendOrToBeCorrected(){
      this.set("_isLoadingMessages",true)
      let prom = Promise.resolve()

      if(this.shadowRoot.getElementById("messagesGridContainer") && this.shadowRoot.getElementById("messagesGridContainer").classList.contains("half")){
          this.shadowRoot.getElementById("messagesGridContainer").classList.contains("half") ? this.shadowRoot.getElementById("messagesGridContainer").classList.remove("half") : null
          this.shadowRoot.getElementById("invoiceDetailContainer") && this.shadowRoot.getElementById("invoiceDetailContainer").classList.contains("open") ? this.shadowRoot.getElementById("invoiceDetailContainer").classList.remove("open") : null
      }

      this.api.setPreventLogging()

      this.api.invoice().listToInsurancesUnsent(this.user.id).then(invoicesUnsent => {
          const efactUnsent = invoicesUnsent.filter(iu => iu.sentMediumType === "efact")

          efactUnsent.forEach(eu =>
              prom = prom.then(listOfEfact =>
                  this.api.crypto().extractCryptedFKs(eu, this.user.healthcarePartyId).then(ids => _.concat(listOfEfact, {invoice: eu, patientId: ids.extractedKeys[0]})))
          )
          prom = prom.then(listOfEfact =>
              Promise.all([_.compact(listOfEfact), this.api.patient().getPatientsWithUser(this.user, new models.ListOfIdsDto({ids: _.uniq(_.compact(listOfEfact).map(x => x.patientId))}))])
                  .then(([listOfEfact, patientsList]) => listOfEfact.map(efact => _.assign(efact, {patient: patientsList.find(p => p.id === efact.patientId)})))
          ).then(listOfEfact =>
              Promise.all([listOfEfact, this.api.insurance().getInsurances(new models.ListOfIdsDto({ids: _.uniq(_.compact(listOfEfact.map(e => e.invoice.recipientId || null)))}))])
                  .then(([listOfEfact, insuranceList]) => listOfEfact.map(efact => _.assign(efact, {insurance: insuranceList.find(i => i.id === efact.invoice.recipientId) || null})))
          ).then(listOfEfact => listOfEfact.map(efact => {
              let insurabilityComplete = false

              efact.patient && efact.patient.insurabilities ? efact.patient.insurabilities = efact.patient.insurabilities.filter(ins => ins.insuranceId && ins.insuranceId.length && ins.parameters && ins.parameters.tc1 && ins.parameters.tc1.length && ins.parameters.tc2 && ins.parameters.tc2.length) : []
              efact.patient.insurabilities.length > 0 ? insurabilityComplete = true : insurabilityComplete = false

              return ({
                  patientName: efact.patient.lastName+" "+efact.patient.firstName,
                  invoiceId: efact.invoice.id,
                  sentMediumType: efact.invoice.sentMediumType,
                  insuranceCode: efact.insurance && efact.insurance.code ? efact.insurance.code : null,
                  insuranceParent: efact.insurance && efact.insurance.parent ? efact.insurance.parent : null,
                  invoiceReference: efact.invoice.invoiceReference,
                  patientSsin: efact.patient.ssin,
                  invoiceDate: efact.invoice.invoiceDate,
                  reimbursement: efact.invoice.invoicingCodes ? efact.invoice.invoicingCodes.reduce((tot, m) => tot + Number(m.reimbursement), 0).toFixed(2) : 0.00,
                  patientIntervention: efact.invoice.invoicingCodes ? efact.invoice.invoicingCodes.reduce((tot, m) => tot + Number(m.patientIntervention), 0).toFixed(2) : 0.00,
                  totalAmount: efact.invoice.invoicingCodes ? efact.invoice.invoicingCodes.reduce((tot, m) => tot + Number(m.totalAmount), 0).toFixed(2) : 0.00 ,
                  doctorSupplement: efact.invoice.invoicingCodes ? efact.invoice.invoicingCodes.reduce((tot, m) => tot + Number(m.doctorSupplement), 0).toFixed(2) : 0.00,
                  statut : (!!efact.invoice.invoicingCodes.find(ic => ic.resent === true)) === true ? this.localize('inv_to_be_corrected','To be corrected',this.language) : this.localize('inv_to_be_send','To be send'),
                  hasChildren : false,
                  uuid : efact.invoice.id,
                  parentUuid : efact.insurance && efact.insurance.code ? efact.insurance.code.charAt(0) : null,
                  patient: efact.patient,
                  invoice: efact.invoice,
                  toBeCorrected: !!efact.invoice.invoicingCodes.find(ic => ic.resent === true),
                  error: efact.invoice.error || "",
                  insurabilityCheck: insurabilityComplete,
                  realizedByTrainee : efact.invoice.internshipNihii && efact.invoice.internshipNihii.length ? true : false
              })
          })).then(invoices => {
              this.set("messagesToBeCorrected", invoices.filter(inv => inv.toBeCorrected === true))
              this.set('selectedInvoicesToBeSend', invoices.filter(inv => inv.toBeCorrected === false && inv.invoice.printedDate))

              this.set("totalInvoicesToBeSend.totalPatientIntervention",this.selectedInvoicesToBeSend ? this.selectedInvoicesToBeSend.reduce((tot, m) => tot + Number(m.patientIntervention), 0).toFixed(2) : 0.00)
              this.set("totalInvoicesToBeSend.totalDoctorSupplement",this.selectedInvoicesToBeSend ? this.selectedInvoicesToBeSend.reduce((tot, m) => tot + Number(m.doctorSupplement), 0).toFixed(2) : 0.00)
              this.set("totalInvoicesToBeSend.totalReimbursement",this.selectedInvoicesToBeSend ? this.selectedInvoicesToBeSend.reduce((tot, m) => tot + Number(m.reimbursement), 0).toFixed(2) : 0.00)
              this.set("totalInvoicesToBeSend.totalAmount",this.selectedInvoicesToBeSend ? this.selectedInvoicesToBeSend.reduce((tot, m) => tot + Number(m.totalAmount), 0).toFixed(2) : 0.00)
              this._toggleDataProvider(this.selectedInvoicesToBeSend)
          }).finally(() =>{
              this.api.setPreventLogging(false)
              return this.fetchMessages()
          })
           .catch(e => console.log('Erreur lors de la récupération des factures: ', e))
      })



  }


  _fetchMessageToBeSendOrToBeCorrected(){

      this.set("_isLoadingMessages",true)

      if(this.shadowRoot.getElementById("messagesGridContainer") && this.shadowRoot.getElementById("messagesGridContainer").classList.contains("half")){
          this.shadowRoot.getElementById("messagesGridContainer").classList.contains("half") ? this.shadowRoot.getElementById("messagesGridContainer").classList.remove("half") : null
          this.shadowRoot.getElementById("invoiceDetailContainer") && this.shadowRoot.getElementById("invoiceDetailContainer").classList.contains("open") ? this.shadowRoot.getElementById("invoiceDetailContainer").classList.remove("open") : null
      }

      this.api.setPreventLogging()
      this.api.invoice().listToInsurancesUnsent(this.user.id)
          .then(invoices => Promise.all(invoices.filter(i => i.sentMediumType === "efact").map(inv => this.api.crypto().extractCryptedFKs(inv, this.user.healthcarePartyId).then(ids => [inv, ids.extractedKeys[0]]))))
          .then(invAndIdsPat =>
              this.api.patient().getPatientsWithUser(this.user, new models.ListOfIdsDto({ids: _.uniq(invAndIdsPat.map(x => x[1]))})).then(pats => invAndIdsPat.map(it => [it[0], pats.find(p => p.id === it[1])]))
          ).then(invAndPats =>
              this.api.insurance().getInsurances(new models.ListOfIdsDto({ids : _.uniq(_.flatten(invAndPats).filter(i => i.insurabilities).map(i => i && i.insurabilities && i.insurabilities[0] && i.insurabilities[0].insuranceId))})).then(ins => invAndPats.map(it=>[it[0], it[1], ins.find(i=>it && (it[0] && it[0].insurabilities && it[0].insurabilities[0] && i.id === it[1].insurabilities[0].insuranceId) || (it[1] && it[1].insurabilities && it[1].insurabilities.find(patIns => (it[0] && it[0].invoiceDate && patIns.startDate && patIns.endDate && it[0].invoiceDate>=patIns.startDate && it[0].invoiceDate<=patIns.endDate && patIns.insuranceId===i.id) || (!(it[0] && it[0].invoiceDate && patIns.startDate && patIns.endDate) && patIns.insuranceId===i.id))))]))
          ).then(invAndPatsAndInsurances => {
              return _.flatMap(invAndPatsAndInsurances, ([inv, pat, ins]) => {
              let insurabilityComplete = false
              pat && pat.insurabilities ? pat.insurabilities = pat.insurabilities.filter(ins => ins.insuranceId && ins.insuranceId.length && ins.parameters && ins.parameters.tc1 && ins.parameters.tc1.length && ins.parameters.tc2 && ins.parameters.tc2.length) : []
              pat.insurabilities.length > 0 ? insurabilityComplete = true : insurabilityComplete = false
              return ({
                  patientName: pat.lastName+" "+pat.firstName,
                  invoiceId: inv.id,
                  sentMediumType: inv.sentMediumType,
                  insuranceCode: ins && ins.code ? ins.code : null,
                  insuranceParent: ins && ins.parent ? ins.parent : null,
                  invoiceReference: inv.invoiceReference,
                  patientSsin: pat.ssin,
                  invoiceDate: inv.invoiceDate,
                  reimbursement: inv.invoicingCodes ? inv.invoicingCodes.reduce((tot, m) => tot + Number(m.reimbursement), 0).toFixed(2) : 0.00,
                  patientIntervention: inv.invoicingCodes ? inv.invoicingCodes.reduce((tot, m) => tot + Number(m.patientIntervention), 0).toFixed(2) : 0.00,
                  totalAmount: inv.invoicingCodes ? inv.invoicingCodes.reduce((tot, m) => tot + Number(m.totalAmount), 0).toFixed(2) : 0.00 ,
                  doctorSupplement: inv.invoicingCodes ? inv.invoicingCodes.reduce((tot, m) => tot + Number(m.doctorSupplement), 0).toFixed(2) : 0.00,
                  statut : (!!inv.invoicingCodes.find(ic => ic.resent === true)) === true ? this.localize('inv_to_be_corrected','To be corrected',this.language) : this.localize('inv_to_be_send','To be send'),
                  hasChildren : false,
                  uuid : inv.id,
                  parentUuid : ins && ins.code ? ins.code.charAt(0) : null,
                  patient: pat,
                  invoice: inv,
                  toBeCorrected: !!inv.invoicingCodes.find(ic => ic.resent === true),
                  error: inv.error || "",
                  insurabilityCheck: insurabilityComplete,
                  realizedByTrainee : inv.internshipNihii && inv.internshipNihii.length ? true : false
              })
          })
      })
      .then(invoiceStruct => {
          this.set("messagesToBeCorrected", invoiceStruct.filter(inv => inv.toBeCorrected === true))
          this.set('selectedInvoicesToBeSend', invoiceStruct.filter(inv => inv.toBeCorrected === false && inv.invoice.printedDate))

          this.set("totalInvoicesToBeSend.totalPatientIntervention",this.selectedInvoicesToBeSend ? this.selectedInvoicesToBeSend.reduce((tot, m) => tot + Number(m.patientIntervention), 0).toFixed(2) : 0.00)
          this.set("totalInvoicesToBeSend.totalDoctorSupplement",this.selectedInvoicesToBeSend ? this.selectedInvoicesToBeSend.reduce((tot, m) => tot + Number(m.doctorSupplement), 0).toFixed(2) : 0.00)
          this.set("totalInvoicesToBeSend.totalReimbursement",this.selectedInvoicesToBeSend ? this.selectedInvoicesToBeSend.reduce((tot, m) => tot + Number(m.reimbursement), 0).toFixed(2) : 0.00)
          this.set("totalInvoicesToBeSend.totalAmount",this.selectedInvoicesToBeSend ? this.selectedInvoicesToBeSend.reduce((tot, m) => tot + Number(m.totalAmount), 0).toFixed(2) : 0.00)
          this._toggleDataProvider(this.selectedInvoicesToBeSend)
      }).finally(() => {
          this.api.setPreventLogging(false)
          return this.fetchMessages()
      })
  }

  fetchMessages() {
      this.messageIdsCanBeAutoArchived = []

      if(this.shadowRoot.getElementById("messagesGridContainer") && this.shadowRoot.getElementById("messagesGridContainer").classList.contains("half")){
          this.shadowRoot.getElementById("messagesGridContainer").classList.remove("half")
          this.shadowRoot.getElementById("invoiceDetailContainer").classList.remove("open")
      }

      this.api.message().findMessagesByTransportGuid("EFACT:BATCH:*").then(messages => {

          const filteredMessages = messages.rows.filter(msg => msg.transportGuid && msg.responsible === this.hcp.id && (msg.transportGuid.startsWith("EFACT:BATCH:" + this.displayedYear) || msg.transportGuid.startsWith("EFACT:BATCH:" + (this.displayedYear-1))))

          Promise.all(filteredMessages.map(msg =>
              this.api.invoice().getInvoices(new models.ListOfIdsDto({ids: msg.invoiceIds.map(id => id)}))
                  .then(invsFromMess => this.api.invoice().getInvoices(new models.ListOfIdsDto({ids: invsFromMess.map(inv => inv.correctiveInvoiceId)})))
                  .then(correctiveInvoices => {
                      let allInvoicesIsCorrected = false

                      if((msg.status & (1 << 17)) !== 0 && !(msg.status & (1 << 21))){
                          const resentNmclStatus = _.uniq(_.flatten(correctiveInvoices && correctiveInvoices.map(inv =>inv && inv.invoicingCodes && inv.invoicingCodes.map(c => c.resent))))
                          let allInvoicesIsCorrected = false

                          if(resentNmclStatus.length === 1 && resentNmclStatus[0] === false){
                              this.push("messageIdsCanBeAutoArchived", msg.id)
                              allInvoicesIsCorrected = true
                          }
                      }

                      return this.api.document().findByMessage(this.user.healthcarePartyId, msg)
                          .then(docs => {
                              console.log(docs)
                              const jsonDoc = docs.find(d => d.mainUti === "public.json" && _.endsWith(d.name, '_records'))
                              return jsonDoc && jsonDoc.attachmentId ? this.api.document().getAttachment(jsonDoc.id, jsonDoc.attachmentId, jsonDoc.secretForeignKeys).then(a => {

                                  if (typeof a === "string"){
                                      try { a = JSON.parse( this.cleanStringForJsonParsing(a) ) } catch (ignored) {}
                                  } else if (typeof a === "object") {
                                      try { a = JSON.parse( this.cleanStringForJsonParsing(new Uint8Array(a).reduce((data, byte) => data + String.fromCharCode(byte), ''))); } catch (ignored) {}
                                  }

                                  const zone200 = a && a.find(enr => enr.zones.find(z => z.zone === "200"))
                                  const zone300 = a && a.find(enr => enr.zones.find(z => z.zone === "300"))
                                  const zone400 = a && a.find(enr => enr.zones.find(z => z.zone === "400"))
                                  const zone500 = a && a.find(enr => enr.zones.find(z => z.zone === "500"))
                                  const enr10 = a && a.find(enr => enr.zones.find(z => z.zone === "1" && z.value === "10"))

                                  const st = msg.status

                                  const invoiceStatus =
                                      !!(st & (1 << 21)) ? this.localize('inv_arch','Archived',this.language):
                                          !!(st & (1 << 17)) ? this.localize('inv_err','Error',this.language):
                                              !!(st & (1 << 16)) ? this.localize('inv_par_acc','Partially accepted',this.language):
                                                  !!(st & (1 << 15)) ? this.localize('inv_full_acc','Fully accepted',this.language):
                                                      !!(st & (1 << 12)) ? this.localize('inv_rej','Rejected',this.language):
                                                          !!(st & (1 << 11)) ? this.localize('inv_tre','Treated',this.language):
                                                              !!(st & (1 << 10)) ? this.localize('inv_acc_tre','Accepted for treatment',this.language):
                                                                  !!(st & (1 << 9))  ? this.localize('inv_succ_tra_oa','Successfully transmitted to OA',this.language):
                                                                      !!(st & (1 << 8))  ? this.localize('inv_pen','Pending',this.language):
                                                                          !!(st & (1 << 7))  ? this.localize('inv_pen','Pending',this.language): ""


                                  const rejectionReason = !!(st & (1 << 17)) ? this.localize('inv_rej_5%','More than 5% error',this.language) :
                                      !!(st & (1 << 12)) ? this.localize('inv_rej_block','Blocking error',this.language): ""

                                  return (zone200 && zone300) ?
                                      ({
                                          message: msg,
                                          messageInfo: {
                                              messageType:        zone200.zones && zone200.zones.find(z => z.zone === "200") ? zone200.zones.find(z => z.zone === "200").value : "",
                                              hcp:                this.hcp.firstName + " " + this.hcp.lastName,
                                              oa:                 zone500.zones && zone500.zones.find(z => z.zone === "501") ? (zone500.zones.find(z => z.zone === "501").value).charAt(0) + "00" : "",
                                              hcpReference:       enr10.zones && enr10.zones.find(z => z.zone === "28") ? enr10.zones.find(z => z.zone === "28").value : "",
                                              invoiceNumber:      zone300.zones && zone300.zones.find(z => z.zone === "301") ? zone300.zones.find(z => z.zone === "301").value : "",
                                              invoiceMonth:       zone300.zones &&zone300.zones.find(z => z.zone === "300") ? zone300.zones.find(z => z.zone === "300").value : "",
                                              invoiceDate:        zone300.zones && zone300.zones.find(z => z.zone === "302") ? zone300.zones.find(z => z.zone === "302").value : "",
                                              invoicedAmount:     msg.metas && msg.metas.totalAmount ? Number(msg.metas.totalAmount) : "0.00",
                                              acceptedAmount:     msg.metas && msg.metas.totalAcceptedAmount ? Number(msg.metas.totalAcceptedAmount) : "0.00",
                                              refusedAmount:      (!!(st & (1 << 17)) || !!(st & (1 << 12))) ? Number(msg.metas.totalAmount) : (msg.metas && msg.metas.totalRejectedAmount) ? Number(msg.metas.totalRejectedAmount) : "0.00",
                                              invoiceStatus:      invoiceStatus,
                                              rejectionReason:    rejectionReason,
                                              paymentReference:   msg.metas && msg.metas.paymentReferenceAccount1 ? msg.metas.paymentReferenceAccount1 : "",
                                              paymentDate:        "",
                                              amountPaid:         msg.metas && msg.metas.totalAcceptedAmount ? Number(msg.metas.totalAcceptedAmount).toFixed(2) : "0.00",
                                              paymentAccount:     enr10.zones && enr10.zones.find(z => z.zone === "36") ? enr10.zones.find(z => z.zone === "36").value : "",
                                              paid: false,
                                              allInvoicesIsCorrected : allInvoicesIsCorrected,
                                              sendError: false
                                          }
                                      }) : {}
                              }) : Promise.resolve({
                                  message: msg,
                                  messageInfo: {
                                      messageType:        null,
                                      hcp:                this.hcp.firstName + " " + this.hcp.lastName,
                                      oa:                 msg.metas && msg.metas.ioFederationCode ? msg.metas.ioFederationCode : null,
                                      hcpReference:       msg.metas && msg.metas.errors ? msg.metas.errors : null,
                                      invoiceNumber:      msg.externalRef || null,
                                      invoiceMonth:       msg.metas && msg.metas.invoiceMonth && msg.metas.invoiceYear ? msg.metas.invoiceYear+''+msg.metas.invoiceMonth : null,
                                      invoiceDate:        msg.metas && msg.metas.invoiceMonth && msg.metas.invoiceYear ? msg.metas.invoiceYear+''+msg.metas.invoiceMonth+'01' : null,
                                      invoicedAmount:     msg.metas && msg.metas.totalAmount ? Number(msg.metas.totalAmount) : "0.00",
                                      acceptedAmount:     msg.metas && msg.metas.totalAcceptedAmount ? Number(msg.metas.totalAcceptedAmount) : "0.00",
                                      refusedAmount:      msg.metas && msg.metas.totalAmount ? Number(msg.metas.totalAmount) : "0.00",
                                      invoiceStatus:      !!(msg.status & (1 << 21)) ? this.localize('inv_arch','Archived',this.language) : this.localize('inv_send_err','Send error',this.language),
                                      rejectionReason:    msg.metas && msg.metas.errors ? msg.metas.errors : null,
                                      paymentReference:   msg.metas && msg.metas.paymentReferenceAccount1 ? msg.metas.paymentReferenceAccount1 : "",
                                      paymentDate:        null,
                                      amountPaid:         msg.metas && msg.metas.totalAcceptedAmount ? Number(msg.metas.totalAcceptedAmount).toFixed(2) : "0.00",
                                      paymentAccount:     null,
                                      paid:               false,
                                      allInvoicesIsCorrected : false,
                                      sendError:          true
                                  }
                              })
                          })

                  }))).then(msgsStructs => {
              this.set('allMessages', msgsStructs)
              this.dispatchMessages()
              this.set("_isLoadingMessages",false)
              this.set("isMessagesLoaded",true)
          })

      })
  }

  getMessage(){
      if(!this.isMessagesLoaded)
      this.fetchMessageToBeSendOrToBeCorrected()
  }

  dispatchMessages() {
      !!this.set("messagesArchived", this.allMessages.filter( m => m.message && m.message.status && (m.message.status & (1 << 21)) !== 0))
      this.set("messagesProcessed", this.allMessages.filter(m => m.message && m.message.status && (m.message.status & (1 << 15 | 1 << 16 | 1 << 17)) === 0 && !(m.message.status & (1<<21))))
      !!this.set("messagesAccepted", this.allMessages.filter( m => m.message && m.message.status && (m.message.status & (1 << 15 | 1 << 16 )) !== 0 && !(m.message.status & (1<<21))))
      !!this.set("messagesRejected", this.allMessages.filter( m => m.message && m.message.status && (m.message.status & (1 << 17)) !== 0 && !(m.message.status & (1<<21))))

      !!this.initializeBatchCounter(this.selectedInvoicesToBeSend.length ? this.selectedInvoicesToBeSend.length : 0, this.messagesToBeCorrected.length ? this.messagesToBeCorrected.length : 0 , this.allMessages.filter(m => m.message && m.message.status && (m.message.status & (1 << 15 | 1 << 16 | 1 << 17)) === 0 && !(m.message.status & (1<<21))).length, this.allMessages.filter( m => m.message && m.message.status && (m.message.status & (1 << 15 | 1 << 16 )) !== 0 && !(m.message.status & (1<<21))).length, this.allMessages.filter( m => m.message && m.message.status && (m.message.status & (1 << 17)) !== 0 && !(m.message.status & (1<<21))).length, this.allMessages.filter( m => m.message && m.message.status && (m.message.status & (1 << 21)) !== 0).length)
  }

  _toggleDataProvider(input) {
      //TODO rewrite lodash

      let inputList = input
      let mutGroups = []
      inputList.map(patient => {
          const thisMutGrp = // set this pat insurance code grp
              (parseInt(_.trim(patient.insuranceCode).substring(0,3)) < 200) ? "100" :
                  (parseInt(_.trim(patient.insuranceCode).substring(0,3)) < 300) ? "200" :
                      (parseInt(_.trim(patient.insuranceCode).substring(0,3)) < 400) ? "300" :
                          (parseInt(_.trim(patient.insuranceCode).substring(0,3)) < 500) ? "400" :
                              (parseInt(_.trim(patient.insuranceCode).substring(0,3)) < 600) ? "500" :
                                  (parseInt(_.trim(patient.insuranceCode).substring(0,3)) < 700) ? "600" : "900"
          let grpExists = false
          mutGroups.map(grp=> { if (grp.code === thisMutGrp) { // check if grp exists
              grpExists = true
          }})
          if (!grpExists) { mutGroups.push({ // else create object
              code: thisMutGrp,pat: [],sum:{oa:0,pat:0,sup:0,tot:0}
          })}
          mutGroups.map(grp=>{ if (grp.code === thisMutGrp) { // get into this grp
              (grp.pat).push(patient) // add the patient
          }})
      }) // inputList map end

      mutGroups.sort((a, b)=>{return a.code-b.code})
      this.set('toggledDatas', mutGroups ) // this.set
      for (let grp of mutGroups) {
          console.log("grp",grp)
          let totPat = 0
          for (let pat of grp.pat){
              console.log(">pat",pat)
              grp.sum.oa += Number(pat.reimbursement)
              grp.sum.pat += Number(pat.patientIntervention)
              grp.sum.sup += Number(pat.doctorSupplement)
              grp.sum.tot += Number(pat.totalAmount)
              totPat++
          }
          // const totEntr = this.localize('entr','Entries',language)
          // const totWord = this.localize('tot','Total',language)
          // grp.code = `${grp.code} (${totPat} ${totEntr}), OA : ${grp.sum.oa}€ - Patient : ${grp.sum.pat}€ - Sup : ${grp.sum.sup}€ - ${totWord} : ${grp.sum.tot}€`
      }
  } // provider end

  calculateTotalInvoicesToBeSend(){

      let total = {
          totalReimbursement :          Number(0.00),
          totalAmount :                 Number(0.00),
          totalPatientIntervention :    Number(0.00),
          totalDoctorSupplement :       Number(0.00),
      }

      this.selectedInvoicesToBeSend.map(invoice => {
          total.totalReimbursement          += Number(invoice.totalInvoice.reimbursement)
          total.totalAmount                 += Number(invoice.totalInvoice.totalAmount)
          total.totalPatientIntervention    += Number(invoice.totalInvoice.patientIntervention)
          total.totalDoctorSupplement       += Number(invoice.totalInvoice.doctorSupplement)
      })

      this.set('totalInvoicesToBeSend', total)

  }

  _invoicesStatusChanged(){
      this.invoicesStatus === "toBeSend" ? this.set('statusToBeSend', true) : this.set('statusToBeSend', false)
      this.set('processing',this.isProcess())
      this.set('archOrAcc',!(this.isProcess() || this.isReject()))
  }

  messagesByStatus() {
      return this.invoicesStatus === "process" ? this.messagesProcessed :
          this.invoicesStatus === "accept" ? this.messagesAccepted :
              this.invoicesStatus === "reject" ? this.messagesRejected :
                  this.invoicesStatus === "toBeCorrected" ? this.messagesToBeCorrected :
                      this.invoicesStatus === "archive" ? this.messagesArchived : []
  }

  _invoicedAmount() {
      return this.messagesByStatus() ? this._formatAmount( (this.messagesByStatus().reduce((tot, m) => tot + Number(m.messageInfo.invoicedAmount), 0).toFixed(2) ) ) :0
  }

  _acceptedAmount() {
      return this.messagesByStatus() ? this._formatAmount( (this.messagesByStatus().reduce((tot, m) => tot + Number(m.messageInfo.acceptedAmount), 0).toFixed(2) ) ): 0
  }

  _refusedAmount() {
      return this.messagesByStatus() ? this._formatAmount( (this.messagesByStatus().reduce((tot, m) => tot + Number(m.messageInfo.refusedAmount), 0).toFixed(2) ) ) : 0
  }

  _displayInvoiceStatus(status){

     return this.localize(status, this.language)

      //this.shadowRoot.getElementById("batchStatus").classList.add("")
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
  _forceZeroNum(num) {
      console.log('num',num)
      return (!num) ? '0' : num.toString()
  }

  findAndReplace(string, target, replacement) {
      for (let i = 0; i < string.length; i++) { string = string.replace(target, replacement); }
      return string;
  }

  refreshFilter(e){
      const param = e.target.getAttribute('param')
      console.log("refresh, param",param)
      const where = this.invoicesStatus // toBeSend, toBeCorrected, process, reject, accept, archive
      const str =
          (param === "invoiceGrid") ? this.filterInput:
          (param === "messagesGrid") ? this.filterInputInvoices :
          (param === "toBeCorrected") ? this.filterInputInvoices :
          this.selectedInputDetail
      setTimeout(function () {
          let arrList =
              (param === "invoiceGrid") ? this.shadowRoot.querySelectorAll("."+param) :
              (param === "selectedInputDetail") ? this.shadowRoot.querySelectorAll("#invoiceDetailContainer #invoiceGridDetail") :
              // (param == "toBeCorrected") ? this.shadowRoot.querySelector("#"+param+" .containScroll") :
              this.shadowRoot.querySelectorAll(".scrollBox")
          console.log("arrList a",param,arrList)
          if ((param === "messagesGrid") || (param === "toBeCorrected")) {
              let temp
              const selected =
                  (where === "process") ? "processTable" :
                  (where === "reject") ? "rejectedTable" :
                  (where === "toBeCorrected") ? "pendingTable" :
                  "archiveAndAccepted"
              console.log('selected',selected)
              Array.prototype.slice.call(arrList).map(list=> {
                  console.log("list", list)
                  if (list.querySelector("."+selected) ) {
                      temp = list.querySelectorAll("."+selected)
                  }
              })
              arrList = temp
          }
          console.log("arrList b",param,arrList)
          Array.prototype.slice.call(arrList).map(table=>{
              console.log("before exec",str,table)
              this.executeSearch(str,table)
          })

      }.bind(this), 500)
  }

  executeSearch(str,param) {
      console.log("exec",str,param)
      const grid = param
      const tbody = grid.shadowRoot.querySelector("#scroller #table tbody")
      const trs = tbody.querySelectorAll("tr")
      console.log("tbody trs",tbody,trs)
      let input = (str.includes(":") ) ? this.treatQuery(str) : str
      input = (this.checkFilters(input)).toString().toLowerCase()
      if (trs.length){
          let keepList = []
          Array.prototype.slice.call(trs).map(row=>{
              let cells = row.querySelectorAll("td"), toHide = true
              cells.forEach(that=>{
                  const test = (that._content.innerText).toString().toLowerCase()
                  if (test.includes(input)) {
                      toHide = false
                  }
              })
              if (toHide) {
                  row.hidden = true
              } else {
                  keepList.push(row)
                  row.hidden = false
              }
          })
          let showCount = 0
          keepList.map(showMe=>{
              showMe.style.transform = "translateY("+ (showCount*48) +"px)"
              showMe.style.height = "48px"
              showMe.style.lineHeight = "24px"
              showCount++
          })
      } // endif
  }

  _batchDetailDataProvider() {
      return (params, callback) => {
          const startIndex = params.page * params.pageSize
          if (!params.parentItem) {
              this.invoicesFromBatch ? callback(this.invoicesFromBatch.slice(startIndex, startIndex + params.pageSize), this.invoicesFromBatch.length) : callback([], 0)
          } else {
              callback(params.parentItem.invoicingCodes.slice(startIndex, startIndex + params.pageSize), params.parentItem.invoicingCodes.length)
          }
      }
  }

  checkFilters(str) { // will (set the path type for vaadin filter and) format search output
      let searchType = "invoice.patient.firstName"
      let output = str
      if (str.length) {
          if (!isNaN(str)) { // is a number
              searchType =
                  (str.toString().length === 11) ? "patient.ssin" : // NISS (length must be 11)
                  (str.length === 8) ? "invoice.invoiceReference" : // bill number
                  (str >= 1930 && str <= (new Date().getFullYear() + 100)) ? "invoice.invoiceDate" : // year (from 1930 to now +100yr)
                  ((typeof str === "float") || str.includes(".")) ? "invoice.totalAmount" : // float amount
                  (str.length === 3 && (100 <= str && str <= 999) ) ? "patient.insurance.code" : // Insurance code
                  "invoice.invoiceReference"
              // format output ->
              if (searchType === "patient.ssin") { output = this.findAndReplace(output,'.',''); }
              if (searchType === "invoice.totalAmount") { output = this.findAndReplace(output.toString(),'.',',') }
          } else { // is a string
              searchType =
                  (/(^([0-2][0-9]|(3)[0-1])[.\- /](((0)[0-9])|((1)[0-2]))[.\- /]\d{4}$)/.test(str) || /(^([0-2][0-9]|(3)[0-1])[.\- /](((0)[0-9])|((1)[0-2]))[.\- /]\d{2}$)/.test(str) ) ? "invoice.invoiceDate" :
                  (/(^[0-9]{2}[.\- /]{0,1}[0-9]{2}[.\- /]{0,1}[0-9]{2}[.\- /]{0,1}[0-9]{3}[.\- /]{0,1}[0-9]{2}$)/.test(str)) ? "patient.ssin" :
                  (str.includes(" ") ) ? "invoice.patient.firstName" :
                  (str.includes("€") || str.includes(".") || str.includes(",")) ? "invoice.totalAmount" :
                  "invoice.patient.firstName"
              // format output ->
              if (searchType === "invoice.totalAmount") { output = this.findAndReplace(output,'€',''); output = this.findAndReplace(output,'.',','); }
              if (searchType === "patient.ssin") { output = this.findAndReplace(output,' ',''); output = this.findAndReplace(output,'-',''); output = this.findAndReplace(output,'/',''); output = this.findAndReplace(output,'.',''); }
              if (searchType === "invoice.invoiceDate") { output = this.fourNumYears(output) }
          }
      }
      return output
  }
  fourNumYears(input) {
      const aa = input.slice(0,2),bb = input.slice(3,5)
      let cccc = input.slice(6,11)
      cccc = (cccc.toString().length === 2) ? cccc = "20"+cccc : cccc
      return `${aa}/${bb}/${cccc}`
  }
  treatQuery(query) { // mainly used for numbers
      let search = (query.substr(query.indexOf(':')+1, query.length) ).toString()
      search =(search.includes(':')) ? this.findAndReplace(search,':',' ') : search
      return search
  }

  _invoicesChange(){
      this.calculateTotalInvoicesToBeSend()
  }

  _checkBeforeSend(){

      this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {

          this.set('checkBeforeSendEfact.inamiCheck', hcp && hcp.nihii && hcp.nihii.length ? false : true)
          this.set('checkBeforeSendEfact.ssinCheck', hcp && hcp.ssin && hcp.ssin.length ? false : true)
          this.set('checkBeforeSendEfact.bceCheck', hcp && hcp.cbe && hcp.cbe.length ? false : true)

          this.set('checkBeforeSendEfact.ibanCheck', (hcp && hcp.bankAccount && hcp.nihii.bankAccount) || (hcp && hcp.financialInstitutionInformation && hcp.financialInstitutionInformation[0] && hcp.financialInstitutionInformation[0].bankAccount) ? false : true)
          this.set('checkBeforeSendEfact.bicCheck', (hcp && hcp.bic && hcp.bic.length) || (hcp && hcp.financialInstitutionInformation && hcp.financialInstitutionInformation[0] && hcp.financialInstitutionInformation[0].bic) ? false : true)

          this.set('patientWithoutMutuality', this.selectedInvoicesToBeSend.filter(inv => inv.insurabilityCheck === false) || [])

          this.set('checkBeforeSendEfact.invoiceCheck100',this.checkIfDoubleInvoiceNumber(this.selectedInvoicesToBeSend, 100, 200))
          this.set('checkBeforeSendEfact.invoiceCheck200',this.checkIfDoubleInvoiceNumber(this.selectedInvoicesToBeSend, 200, 300))
          this.set('checkBeforeSendEfact.invoiceCheck300',this.checkIfDoubleInvoiceNumber(this.selectedInvoicesToBeSend, 300, 400))
          this.set('checkBeforeSendEfact.invoiceCheck306',this.checkIfDoubleInvoiceNumber(this.selectedInvoicesToBeSend, 306, 307))
          this.set('checkBeforeSendEfact.invoiceCheck400',this.checkIfDoubleInvoiceNumber(this.selectedInvoicesToBeSend, 400, 500))
          this.set('checkBeforeSendEfact.invoiceCheck500',this.checkIfDoubleInvoiceNumber(this.selectedInvoicesToBeSend, 500, 600))
          this.set('checkBeforeSendEfact.invoiceCheck600',this.checkIfDoubleInvoiceNumber(this.selectedInvoicesToBeSend, 600, 700))
          this.set('checkBeforeSendEfact.invoiceCheck900',this.checkIfDoubleInvoiceNumber(this.selectedInvoicesToBeSend, 900, 1000))

          if((this.patientWithoutMutuality && this.patientWithoutMutuality.length) || this.checkBeforeSendEfact.inamiCheck === true || this.checkBeforeSendEfact.ssinCheck === true ||
          this.checkBeforeSendEfact.bceCheck === true || this.checkBeforeSendEfact.ibanCheck === true || this.checkBeforeSendEfact.bicCheck === true ||
          this.checkBeforeSendEfact.invoiceCheck100 === false || this.checkBeforeSendEfact.invoiceCheck200 === false || this.checkBeforeSendEfact.invoiceCheck300 === false ||
          this.checkBeforeSendEfact.invoiceCheck306 === false || this.checkBeforeSendEfact.invoiceCheck400 === false || this.checkBeforeSendEfact.invoiceCheck500 === false ||
          this.checkBeforeSendEfact.invoiceCheck600 === false || this.checkBeforeSendEfact.invoiceCheck900 === false){
              this.$['warningBeforeSend'].open()
          }else{
             this.sendInvoices()
          }
      })
  }

  checkIfDoubleInvoiceNumber(invoices, startOfRange, endOfRange){
      if(startOfRange === 300 && endOfRange === 400){
          return _.uniq(_.sortBy(invoices.filter(i => i.insuranceCode >= startOfRange && i.insuranceCode < endOfRange && i.insuranceCode !== "306").map( i => parseInt(i.invoiceReference)))).length === _.sortBy(invoices.filter(i => i.insuranceCode >= startOfRange && i.insuranceCode < endOfRange && i.insuranceCode !== "306").map( i => parseInt(i.invoiceReference))).length
      }else{
          return _.uniq(_.sortBy(invoices.filter(i => i.insuranceCode >= startOfRange && i.insuranceCode < endOfRange).map( i => parseInt(i.invoiceReference)))).length === _.sortBy(invoices.filter(i => i.insuranceCode >= startOfRange && i.insuranceCode < endOfRange).map( i => parseInt(i.invoiceReference))).length
      }
  }

  sendInvoices(){
      const LastSend = parseInt(localStorage.getItem('lastInvoicesSent')) ? parseInt(localStorage.getItem('lastInvoicesSent')) : -1
      const maySend = (LastSend < Date.now() + 24*60*60000 || LastSend===-1)
      if (maySend) {
          this.set('cannotSend',true)
          localStorage.setItem('lastInvoicesSent', Date.now())
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp=> {
              let prom = Promise.resolve()
              _.chain(_.head(_.chunk(this.selectedInvoicesToBeSend.filter(inv => inv.insurabilityCheck === true), 500)))
                  .groupBy(fact => fact.insuranceParent)
                  .toPairs().value()
                  .forEach(([fedId,invoices]) => {
                      prom = prom.then(() => this.api.message().sendBatch(this.user, hcp, invoices.map(iv=>({invoiceDto:iv.invoice, patientDto:iv.patient})), this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, this.api.fhc().Efactcontroller(),
                          undefined,
                          (fed, hcpId) => Promise.resolve(`efact:${hcpId}:${fed.code === "306" ? "300" : fed.code}:`))
                      ).then(message => this.api.register(message,'message'))
                  })

              return prom.then(() => {
                  this.set('isSending',false)
                  this.set("isMessagesLoaded",false)
                  this.getMessage()
              })
          })
      }

  }

  _showInvoiceToBeSendDetails(){
      this.$.pendingDetailDialog.open()
  }

  SEG_getErrSegment_200(zones){
      var erreur = '';

      //Erreur sur le nom du message
      if(zones.find(z => z.zone === "2001") && zones.find(z => z.zone === "2001").value !== '00'){
          if(zones.find(z => z.zone === "2001") && zones.find(z => z.zone === "2001").value === '10'){
              erreur += 'Nom du message => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "2001") && zones.find(z => z.zone === "2001").value === '11'){
              erreur += 'Nom du message => Erreur de format<br>';
          }else if(zones.find(z => z.zone === "2001") && zones.find(z => z.zone === "2001").value === '20'){
              erreur += 'Nom du message => Codification inconnue<br>';
          }else if(zones.find(z => z.zone === "2001") && zones.find(z => z.zone === "2001").value === '21'){
              erreur += 'Nom du message => Message non autorisé pour cet émetteur<br>';
          }else if(zones.find(z => z.zone === "2001") && zones.find(z => z.zone === "2001").value === '22'){
              erreur += 'Nom du message => # de 920000<br>';
          }
      }

      //Erreur sur le n° de version du message
      if(zones.find(z => z.zone === "2011") && zones.find(z => z.zone === "2011").value !== '00'){
          if(zones.find(z => z.zone === "2011") && zones.find(z => z.zone === "2011").value === '10'){
              erreur += 'N° version mess => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "2011") && zones.find(z => z.zone === "2011").value === '11'){
              erreur += 'N° version mess => Erreur format<br>';
          }else if(zones.find(z => z.zone === "2011") && zones.find(z => z.zone === "2011").value === '20'){
              erreur += 'N° version mess => N° de version n\'est plus d\'application<br>';
          }else if(zones.find(z => z.zone === "2011") && zones.find(z => z.zone === "2011").value === '21'){
              erreur += 'N° version mess => N° de version pas encore d\'application<br>';
          }else if(zones.find(z => z.zone === "2011") && zones.find(z => z.zone === "2011").value === '30'){
              erreur += 'N° version mess => N° de version non autorisé pour ce flux<br>';
          }
      }

      //Erreur sur le type de message
      if(zones.find(z => z.zone === "2021") && zones.find(z => z.zone === "2021").value !== '00'){
          if(zones.find(z => z.zone === "2021") && zones.find(z => z.zone === "2021").value === '10'){
              erreur += 'Type de mess => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "2021") && zones.find(z => z.zone === "2021").value === '11'){
              erreur += 'Type de mess => Erreur format<br>';
          }else if(zones.find(z => z.zone === "2021") && zones.find(z => z.zone === "2021").value === '20'){
              erreur += 'Type de mess => Valeur non permise<br>';
          }else if(zones.find(z => z.zone === "2021") && zones.find(z => z.zone === "2021").value === '30'){
              erreur += 'Type de mess => Message test dans un buffer de production (1er car zone 107 = P)<br>';
          }else if(zones.find(z => z.zone === "2021") && zones.find(z => z.zone === "2021").value === '31'){
              erreur += 'Type de mess => Message de production dans un buffer de test (1er car zone 107 = T)<br>';
          }
      }

      //Erreur sur le statut du message
      if(zones.find(z => z.zone === "2031") && zones.find(z => z.zone === "2031").value !== '00'){
          if(zones.find(z => z.zone === "2031") && zones.find(z => z.zone === "2031").value === '10'){
              erreur += 'Statut mess => Erreur format<br>';
          }else if(zones.find(z => z.zone === "2031") && zones.find(z => z.zone === "2031").value === '20'){
              erreur += 'Statut mess => Valeur non permise<br>';
          }
      }

      //Erreur sur la référence message institution ou prestataire de soins
      if(zones.find(z => z.zone === "2041") && zones.find(z => z.zone === "2041").value !== '00'){
          if(zones.find(z => z.zone === "2041") && zones.find(z => z.zone === "2041").value === '10'){
              erreur += 'Réf mess => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "2041") && zones.find(z => z.zone === "2041").value === '11'){
              erreur += 'Réf mess => Erreur format<br>';
          }
      }

      //Erreur sur la référence message O.A
      if(zones.find(z => z.zone === "2051") && zones.find(z => z.zone === "2051").value !== '00'){
          if(zones.find(z => z.zone === "2051") && zones.find(z => z.zone === "2051").value === '10'){
              erreur += 'Réf mess OA => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "2051") && zones.find(z => z.zone === "2051").value === '11'){
              erreur += 'Réf mess OA => Erreur format<br>';
          }
      }

      return erreur;
  }

  SEG_getErrSegment_300(zones){
      var erreur = '';

      //Erreur sur l'année et le mois de facturation
      if(zones.find(z => z.zone === "3001") && zones.find(z => z.zone === "3001").value !== '00'){
          if(zones.find(z => z.zone === "3001") && zones.find(z => z.zone === "3001").value === '10'){
              erreur += 'Année mois fact => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "3001") && zones.find(z => z.zone === "3001").value === '11'){
              erreur += 'Année mois fact => Erreur format<br>';
          }else if(zones.find(z => z.zone === "3001") && zones.find(z => z.zone === "3001").value === '20'){
              erreur += 'Année mois fact => Valeur non permise<br>';
          }
      }

      //Erreur sur le n° d'envoi
      if(zones.find(z => z.zone === "3011") && zones.find(z => z.zone === "3011").value !== '00'){
          if(zones.find(z => z.zone === "3011") && zones.find(z => z.zone === "3011").value === '10'){
              erreur += 'N° envoi => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "3011") && zones.find(z => z.zone === "3011").value === '11'){
              erreur += 'N° envoi => Erreur format<br>';
          }else if(zones.find(z => z.zone === "3011") && zones.find(z => z.zone === "3011").value === '40'){
              erreur += 'N° envoi => Signalisation de double fichier de facturation transmis<br>';
          }
      }

      //Erreur sur la date de création de la facture
      if(zones.find(z => z.zone === "3021")  && zones.find(z => z.zone === "3021").value !== '00'){
          if(zones.find(z => z.zone === "3021") && zones.find(z => z.zone === "3021").value === '10'){
              erreur += 'Date création facture => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "3021") && zones.find(z => z.zone === "3021").value === '11'){
              erreur += 'Date création facture => Erreur format<br>';
          }else if(zones.find(z => z.zone === "3021") && zones.find(z => z.zone === "3021").value === '20'){
              erreur += 'Date création facture => Date > date du jour<br>';
          }else if(zones.find(z => z.zone === "3021") && zones.find(z => z.zone === "3021").value === '21'){
              erreur += 'Date création facture => Date invraisemblable ( date < 01/01/2002)<br>';
          }
      }


      //Erreur sur le n° de version des instruction
      if(zones.find(z => z.zone === "3041") && zones.find(z => z.zone === "3041").value !== '00'){
          if(zones.find(z => z.zone === "3041") && zones.find(z => z.zone === "3041").value === '10'){
              erreur += 'N° version instruction => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "3041") && zones.find(z => z.zone === "3041").value === '11'){
              erreur += 'N° version instruction => Erreur format<br>';
          }else if(zones.find(z => z.zone === "3041") && zones.find(z => z.zone === "3041").value === '20'){
              erreur += 'N° version instruction => Valeur non permise<br>';
          }else if(zones.find(z => z.zone === "3041") && zones.find(z => z.zone === "3041").value === '21'){
              erreur += 'N° version instruction => Incompatibilité avec valeur reprise en zone 202<br>';
          }
      }

      //Erreur sur le nom de la personne de contact
      if(zones.find(z => z.zone === "3051") && zones.find(z => z.zone === "3051").value !== '00'){
          if(zones.find(z => z.zone === "3051") && zones.find(z => z.zone === "3051").value === '10'){
              erreur += 'Nom personne de contact => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "3051") && zones.find(z => z.zone === "3051").value === '11'){
              erreur += 'Nom personne de contact => Erreur format<br>';
          }
      }

      //Erreur sur le prenom de la personne de contact
      if(zones.find(z => z.zone === "3061") && zones.find(z => z.zone === "3061").value !== '00'){
          if(zones.find(z => z.zone === "3061") && zones.find(z => z.zone === "3061").value === '10'){
              erreur += 'Prénom personne de contact => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "3061") && zones.find(z => z.zone === "3061").value === '11'){
              erreur += 'Prénom personne de contact => Erreur format<br>';
          }
      }

      //Erreru sur le n° de tel de contact
      if(zones.find(z => z.zone === "3071") && zones.find(z => z.zone === "3071").value !== '00'){
          if(zones.find(z => z.zone === "3071") && zones.find(z => z.zone === "3071").value === '10'){
              erreur += 'N° téléphone => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "3071") && zones.find(z => z.zone === "3071").value === '11'){
              erreur += 'N° téléphone => Erreur format<br>';
          }
      }

      //Erreur sur le type de la facture
      if(zones.find(z => z.zone === "3081") && zones.find(z => z.zone === "3081").value !== '00'){
          if(zones.find(z => z.zone === "3081") && zones.find(z => z.zone === "3081").value === '10'){
              erreur += 'Type de la facture => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "3081") && zones.find(z => z.zone === "3081").value  === '11'){
              erreur += 'Type de la facture => Erreur format<br>';
          }else if(zones.find(z => z.zone === "3081") && zones.find(z => z.zone === "3081").value  === '20'){
              erreur += 'Type de la facture => Valeur non permise en fonction du secteur qui émet la facturation';
          }
      }

      //Erreur sur le type de facturation
      if(zones.find(z => z.zone === "3091") && zones.find(z => z.zone === "3091").value !== '00'){
          if(zones.find(z => z.zone === "3091") && zones.find(z => z.zone === "3091").value === '10'){
              erreur += 'Type de facturation => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "3091") && zones.find(z => z.zone === "3091").value === '11'){
              erreur += 'Type de facturation => Erreur format<br>';
          }else if(zones.find(z => z.zone === "3091") && zones.find(z => z.zone === "3091").value === '20'){
              erreur += 'Type de facturation => Valeur non permise en fonction du secteur qui émet la facturation';
          }else if(zones.find(z => z.zone === "3091") && zones.find(z => z.zone === "3091").value === '30'){
              erreur += 'Type de facturation => Valeur # de 1 ou 2 alors que la zone 308 = 3';
          }
      }

      return erreur;

  }

  SEG_getErrSegment_400(zones){
      var erreur = '';

      //Erreur sur le type de record
      if(zones.find(z => z.zone === "4001")  && zones.find(z => z.zone === "4001").value  !== '00'){
          if(zones.find(z => z.zone === "4001") && zones.find(z => z.zone === "4001").value === '10'){
              erreur +='Type de record => Zone obligatoire<br>';
          }else if(zones.find(z => z.zone === "4001") && zones.find(z => z.zone === "4001").value === '11'){
              erreur += 'Type de record => Erreur de format<br>';
          }else if(zones.find(z => z.zone === "4001") && zones.find(z => z.zone === "4001").value === '20'){
              erreur += 'Type de record => Valeur non permise<br>';
          }
      }

      //Erreur sur le num de mut
      if(zones.find(z => z.zone === "4011") && zones.find(z => z.zone === "4011").value  !== '00'){
          if(zones.find(z => z.zone === "4011") && zones.find(z => z.zone === "4011").value === '10'){
              erreur += 'N° de mutualité => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "4011") && zones.find(z => z.zone === "4011").value === '11'){
              erreur +='N° de mutualité => Erreur de format<br>';
          }else if(zones.find(z => z.zone === "4011") && zones.find(z => z.zone === "4011").value === '20'){
              erreur +='N° de mutualité => Numéro inconnu ou codification erronée<br>';
          }else if(zones.find(z => z.zone === "4011") && zones.find(z => z.zone === "4011").value === '21'){
              erreur += 'N° de mutualité => N° de mutualité non retrouvé dans le détail de la facturation<br>';
          }
      }

      //Erreur sur le num fact
      if(zones.find(z => z.zone === "4021") && zones.find(z => z.zone === "4021").value  !== '00'){
          if(zones.find(z => z.zone === "4021") && zones.find(z => z.zone === "4021").value === '10'){
              erreur +='N° de facture récapitulative => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "4021") && zones.find(z => z.zone === "4021").value === '11'){
              erreur += 'N° de facture récapitulative => Erreur de format<br>';
          }
      }

      //Erreur sur le signe montant a ou montant demande a
      if(zones.find(z => z.zone === "4041") && zones.find(z => z.zone === "4041").value !== '00'){
          if(zones.find(z => z.zone === "4041") && zones.find(z => z.zone === "4041").value === '11'){
              erreur += 'Montant demandé cpt a => Erreur de format<br>';
          }else if(zones.find(z => z.zone === "4041") && zones.find(z => z.zone === "4041").value === '40'){
              erreur += 'Montant demandé cpt a => Erreur code signe (# de + ou -)<br>';
          }else if(zones.find(z => z.zone === "4041") && zones.find(z => z.zone === "4041").value === '41'){
              erreur +='Montant demandé cpt a => Discordance entre montant ci-mentionné et total du fichier facturation pour la mutualité<br>';
          }else if(zones.find(z => z.zone === "4041") && zones.find(z => z.zone === "4041").value === '20'){
              erreur += 'Montant demandé cpt a => Somme erronée<br>';
          }
      }

      //Erreur sur le signe montant b ou montant demande b
      if(zones.find(z => z.zone === "4061") && zones.find(z => z.zone === "4061").value !== '00'){
          if(zones.find(z => z.zone === "4061") && zones.find(z => z.zone === "4061").value === '11'){
              erreur += 'Montant demandé cpt b => Erreur de format<br>';
          }else if(zones.find(z => z.zone === "4061") && zones.find(z => z.zone === "4061").value === '15'){
              erreur +='Montant demandé cpt b => Zone # de 0 si l\'émetteur n\est pas une institution hospitalière - Zone signe # de «blanc» et émetteur de la facturation # d’une institution hospitalière<br>';
          }else if(zones.find(z => z.zone === "4061") && zones.find(z => z.zone === "4061").value === '40'){
              erreur +='Montant demandé cpt b => Erreur code signe (# de + ou -)';
          }else if(zones.find(z => z.zone === "4061") && zones.find(z => z.zone === "4061").value === '41'){
              erreur +='Montant demandé cpt b => Discordance entre montant ci-mentionné et total du fichier facturation pour la mutualité<br>';
          }else if(zones.find(z => z.zone === "4061") && zones.find(z => z.zone === "4061").value === '20'){
              erreur +='Montant demandé cpt b => Somme erronée<br>';
          }
      }

      //Erreur sur le signe montant a + b ou montant demande a + b
      if(zones.find(z => z.zone === "4081") && zones.find(z => z.zone === "4081").value !== '00'){
          if(zones.find(z => z.zone === "4081") && zones.find(z => z.zone === "4081").value === '11'){
              erreur +='Total montant demandés cpt a + cpt b => Erreur de format<br>';
          }else if(zones.find(z => z.zone === "4081") && zones.find(z => z.zone === "4081").value === '20'){
              erreur +='Total montant demandé cpt a + cpt b => Montant # somme des montants cpt a et cpt b<br>';
          }else if(zones.find(z => z.zone === "4081") && zones.find(z => z.zone === "4081").value === '40'){
              erreur +='Total montant demandé cpt a + cpt b => Erreur code signe (# de + ou -)<br>';
          }
      }

      //Erreur sur le nb d'enreg
      if(zones.find(z => z.zone === "4091") && zones.find(z => z.zone === "4091").value !== '00'){
          if(zones.find(z => z.zone === "4091") && zones.find(z => z.zone === "4091").value === '10'){
              erreur += 'Nb de records détail => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "4091") && zones.find(z => z.zone === "4091").value === '11'){
              erreur +='Nb de records détail => Erreur de format<br>';
          }else if(zones.find(z => z.zone === "4091") && zones.find(z => z.zone === "4091").value === '20'){
              erreur += 'Nb de records détail => Somme erronée<br>';
          }
      }

      //Erreur sur le num de controle par mutualite si 95 ou num de controle de l'envoi si 96
      if(zones.find(z => z.zone === "4101") && zones.find(z => z.zone === "400").value !== '00'){
          if(zones.find(z => z.zone === "400") && zones.find(z => z.zone === "400").value === '95'){
              if(zones.find(z => z.zone === "4101") && zones.find(z => z.zone === "4101").value === '10'){
                  erreur += 'N° de contrôle par mutualité => zone obligaoire non complétée<br>';
              }else if(zones.find(z => z.zone === "4101") && zones.find(z => z.zone === "4101").value === '11'){
                  erreur +='N° de contrôle par mutualité => Erreur de format<br>';
              }
          }else if(zones.find(z => z.zone === "400") && zones.find(z => z.zone === "4101").value  === '96'){
              if(zones.find(z => z.zone === "4101") && zones.find(z => z.zone === "4101").value === '10'){
                  erreur += 'N° de contrôle de l\'envoi => zone obligaoire non complétée<br>';
              }else if(zones.find(z => z.zone === "4101") && zones.find(z => z.zone === "4101").value === '11'){
                  erreur +='N° de contrôle de l\'envoi => Erreur de format<br>';
              }
          }
      }

      return erreur;
  }

  SEG_getErrSegment_500(zones){
      var erreur = '';

      //Erreur sur le type de record
      if(zones.find(z => z.zone === "5001") && zones.find(z => z.zone === "5001").value  !== '00'){
          if(zones.find(z => z.zone === "5001") && zones.find(z => z.zone === "5001").value === '10'){
              erreur +='Type de record => Zone obligatoire<br>';
          }else if(zones.find(z => z.zone === "5001") && zones.find(z => z.zone === "5001").value === '11'){
              erreur += 'Type de record => Erreur de format<br>';
          }else if(zones.find(z => z.zone === "5001") && zones.find(z => z.zone === "5001").value === '20'){
              erreur += 'Type de record => Valeur non permise<br>';
          }
      }

      //Erreur sur le num de mut
      if(zones.find(z => z.zone === "5011") && zones.find(z => z.zone === "5011").value !== '00'){
          if(zones.find(z => z.zone === "5011") && zones.find(z => z.zone === "5011").value === '10'){
              erreur += 'N° de mutualité => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "5011") && zones.find(z => z.zone === "5011").value === '11'){
              erreur +='N° de mutualité => Erreur de format<br>';
          }else if(zones.find(z => z.zone === "5011") && zones.find(z => z.zone === "5011").value === '20'){
              erreur +='N° de mutualité => Numéro inconnu ou codification erronée<br>';
          }else if(zones.find(z => z.zone === "5011") && zones.find(z => z.zone === "5011").value === '21'){
              erreur += 'N° de mutualité => N° de mutualité non retrouvé dans le détail de la facturation<br>';
          }
      }

      //Erreur sur le num fact
      if(zones.find(z => z.zone === "5021") && zones.find(z => z.zone === "5021").value !== '00'){
          if(zones.find(z => z.zone === "5021") && zones.find(z => z.zone === "5021").value === '10'){
              erreur +='N° de facture récapitulative => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "5021") && zones.find(z => z.zone === "5021").value === '11'){
              erreur += 'N° de facture récapitulative => Erreur de format<br>';
          }
      }

      //Erreur sur le signe montant a ou montant demande a
      if(zones.find(z => z.zone === "5041") && zones.find(z => z.zone === "5041").value !== '00'){
          if(zones.find(z => z.zone === "5041") && zones.find(z => z.zone === "5041").value === '11'){
              erreur += 'Montant demandé cpt a => Erreur de format<br>';
          }else if(zones.find(z => z.zone === "5041") && zones.find(z => z.zone === "5041").value === '40'){
              erreur += 'Montant demandé cpt a => Erreur code signe (# de + ou -)<br>';
          }else if(zones.find(z => z.zone === "5041") && zones.find(z => z.zone === "5041").value === '41'){
              erreur +='Montant demandé cpt a => Discordance entre montant ci-mentionné et total du fichier facturation pour la mutualité<br>';
          }else if(zones.find(z => z.zone === "5041") && zones.find(z => z.zone === "5041").value === '20'){
              erreur += 'Montant demandé cpt a => Somme erronée<br>';
          }
      }

      //Erreur sur le signe montant b ou montant demande b
      if(zones.find(z => z.zone === "5061") && zones.find(z => z.zone === "5061").value !== '00'){
          if(zones.find(z => z.zone === "5061") && zones.find(z => z.zone === "5061").value === '11'){
              erreur += 'Montant demandé cpt b => Erreur de format<br>';
          }else if(zones.find(z => z.zone === "5061") && zones.find(z => z.zone === "5061").value === '15'){
              erreur +='Montant demandé cpt b => Zone # de 0 si l\'émetteur n\est pas une institution hospitalière - Zone signe # de «blanc» et émetteur de la facturation # d’une institution hospitalière<br>';
          }else if(zones.find(z => z.zone === "5061") && zones.find(z => z.zone === "5061").value === '40'){
              erreur +='Montant demandé cpt b => Erreur code signe (# de + ou -)';
          }else if(zones.find(z => z.zone === "5061") && zones.find(z => z.zone === "5061").value === '41'){
              erreur +='Montant demandé cpt b => Discordance entre montant ci-mentionné et total du fichier facturation pour la mutualité<br>';
          }else if(zones.find(z => z.zone === "5061") && zones.find(z => z.zone === "5061").value === '20'){
              erreur +='Montant demandé cpt b => Somme erronée<br>';
          }
      }

      //Erreur sur le signe montant a + b ou montant demande a + b
      if(zones.find(z => z.zone === "5081") && zones.find(z => z.zone === "5081").value !== '00'){
          if(zones.find(z => z.zone === "5081") && zones.find(z => z.zone === "5081").value === '11'){
              erreur +='Total montant demandés cpt a + cpt b => Erreur de format<br>';
          }else if(zones.find(z => z.zone === "5081") && zones.find(z => z.zone === "5081").value === '20'){
              erreur +='Total montant demandé cpt a + cpt b => Montant # somme des montants cpt a et cpt b<br>';
          }else if(zones.find(z => z.zone === "5081") && zones.find(z => z.zone === "5081").value === '40'){
              erreur +='Total montant demandé cpt a + cpt b => Erreur code signe (# de + ou -)<br>';
          }
      }

      //Erreur sur le nb d'enreg
      if(zones.find(z => z.zone === "5091") && zones.find(z => z.zone === "5091").value !== '00'){
          if(zones.find(z => z.zone === "5091") && zones.find(z => z.zone === "5091").value === '10'){
              erreur += 'Nb de records détail => Zone obligatoire non complétée<br>';
          }else if(zones.find(z => z.zone === "5091") && zones.find(z => z.zone === "5091").value === '11'){
              erreur +='Nb de records détail => Erreur de format<br>';
          }else if(zones.find(z => z.zone === "5091") && zones.find(z => z.zone === "5091").value === '20'){
              erreur += 'Nb de records détail => Somme erronée<br>';
          }
      }

      //Erreur sur le num de controle par mutualite si 95 ou num de controle de l'envoi si 96
      if(zones.find(z => z.zone === "5101") && zones.find(z => z.zone === "5101").value !== '00'){
          if(zones.find(z => z.zone === "500") && zones.find(z => z.zone === "500").value === '95'){
              if(zones.find(z => z.zone === "5101") && zones.find(z => z.zone === "5101").value === '10'){
                  erreur += 'N° de contrôle par mutualité => zone obligaoire non complétée<br>';
              }else if(zones.find(z => z.zone === "5101") && zones.find(z => z.zone === "5101").value === '11'){
                  erreur +='N° de contrôle par mutualité => Erreur de format<br>';
              }
          }else if(zones.find(z => z.zone === "500") && zones.find(z => z.zone === "500").value === '96'){
              if(zones.find(z => z.zone === "5101") && zones.find(z => z.zone === "5101").value === '10'){
                  erreur += 'N° de contrôle de l\'envoi => zone obligatoire non complétée<br>';
              }else if(zones.find(z => z.zone === "5101") && zones.find(z => z.zone === "5101").value === '11'){
                  erreur +='N° de contrôle de l\'envoi => Erreur de format<br>';
              }
          }
      }

      return erreur;
  }


  _showDetail() {

      if (this.activeGridItem && this.activeGridItem.message){
          this.set('isSendError', this.activeGridItem && this.activeGridItem.messageInfo && this.activeGridItem.messageInfo.sendError ? this.activeGridItem.messageInfo.sendError : false)
          this.shadowRoot.getElementById("messagesGridContainer").classList.add("half")
          this.shadowRoot.getElementById("invoiceDetailContainer").classList.add("open")

          this.set('invoicesErrorMsg',"");

          const invoiceIds = this.activeGridItem.message.invoiceIds
          const st = this.activeGridItem.message.status

          this.api.setPreventLogging()

          this.api.invoice().getInvoices(new models.ListOfIdsDto({ids: invoiceIds.map(i => i)}))
              .then(invoices => Promise.all(invoices.map(inv => this.api.crypto().extractCryptedFKs(inv, this.user.healthcarePartyId).then(ids => [inv, ids.extractedKeys[0]]))))
              .then(invAndIdsPat =>
                  this.api.patient().getPatientsWithUser(this.user,new models.ListOfIdsDto({ids: _.uniq(invAndIdsPat.map(x => x[1]))})).then(pats => invAndIdsPat.map(it => [it[0], pats.find(p => p.id === it[1])]))
              )
              .then(invAndPats => invAndPats.map( ([inv, pat]) => ({
                  invoiceReference: inv.invoiceReference,
                  patient: pat && pat.firstName+" "+pat && pat.lastName,
                  ssin: pat && pat.ssin,
                  invoiceDate: inv.invoiceDate,
                  invoicedAmount: inv.invoicingCodes && inv.invoicingCodes.reduce((t,c) => t + (c.reimbursement || 0), 0),
                  acceptedAmount: (!!(st & (1 << 17)) || !!(st & (1 << 12))) ? 0.00 : inv.invoicingCodes && inv.invoicingCodes.reduce((t,c) => t + (c.paid || 0), 0),
                  refusedAmount: (!!(st & (1 << 17)) || !!(st & (1 << 12))) ? inv.invoicingCodes && inv.invoicingCodes.reduce((t,c) => t + (c.reimbursement || 0), 0) : (Number(inv.invoicingCodes && inv.invoicingCodes.reduce((t,c) => t + (c.reimbursement || 0), 0)) -  Number(inv.invoicingCodes && inv.invoicingCodes.reduce((t,c) => t + (c.paid || 0), 0))),
                  rejectionReason: inv.error,
                  paid: false,
                  status: this.activeGridItem.messageInfo.invoiceStatus,
                  invoice: inv,
                  invoicingCodes: inv.invoicingCodes && inv.invoicingCodes.map(code => ({
                      invoicingCode: code && code.code,
                      invoiceDate: code && code.dateCode,
                      invoicedAmount: Number(code.reimbursement),
                      acceptedAmount:  (!!(st & (1 << 17)) || !!(st & (1 << 12))) ? 0.00 : ((code && code.paid >= 0) ? code.paid : 0.00),
                      refusedAmount:  (!!(st & (1 << 17)) || !!(st & (1 << 12))) ? Number(code.reimbursement) : (code && code.paid >= 0) ? (Number(code.reimbursement) - Number(code.paid)) : 0.00,
                      rejectionReason: code && code.error,
                      paid: false,
                      accepted: code && code.accepted,
                      status: code && code.accepted === true ?  this.localize('nmcl-accepted','Accepted',this.language) : this.localize('nmcl-rejected','Rejected',this.language)
                  }))
              })))
              .then(infos => this.set('invoicesFromBatch', infos))
              .then(() => this.api.message().getChildren(this.activeGridItem.message.id))
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

                      const zone1and90 = a.message && a.message.find(enr => enr.zones.find(z => z.zone === "1" || z.zone === "90"))
                      let errorString = ''
                      Object.keys(zone1and90 && zone1and90.errorDetail || {}).find(key => {
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

                      const zone200 = a.message && a.message.find(enr => enr.zones.find(z => z.zone === "200"))
                      const zone300 = a.message && a.message.find(enr => enr.zones.find(z => z.zone === "300"))
                      const zone400 = a.message && a.message.find(enr => enr.zones.find(z => z.zone === "400"))
                      const zone500 = a.message && a.message.find(enr => enr.zones.find(z => z.zone === "500"))

                      let globalError = _.compact(_.uniq([zone200 && this.SEG_getErrSegment_200(zone200.zones || []),
                          zone300 && this.SEG_getErrSegment_300(zone300.zones || []),
                          zone400 && this.SEG_getErrSegment_400(zone400.zones || []),
                          zone500 && this.SEG_getErrSegment_500(zone500.zones || [])]))

                      this.set('invoicesErrorMsg',this.invoicesErrorMsg+" "+globalError);

                  })
              }).finally(()=>{
              this.api.setPreventLogging(false)
          })

      } else {
          this.shadowRoot.getElementById("messagesGridContainer").classList.remove("half")
          this.shadowRoot.getElementById("invoiceDetailContainer").classList.remove("open")
      }
  }

  _showMessagesToBeCorrectedDetail(){
      if (this.activeGridItem){
          this.shadowRoot.getElementById("messagesGridContainer").classList.add("half")
          this.shadowRoot.getElementById("toBeCorrectedDetailContainer").classList.add("open")

          this.set("toBeCorrectedMessageDetail", this.activeGridItem.invoice.invoicingCodes)
          this.set("patientFromSelectedInvoice", this.activeGridItem.patient)

      }else{
          this.shadowRoot.getElementById("messagesGridContainer").classList.remove("half")
          this.shadowRoot.getElementById("toBeCorrectedDetailContainer").classList.remove("open")
      }
  }

  _openHelpDeskDialogSupp(e){
      e.stopPropagation();
      this.set("infoHelpdesk",JSON.parse(e.target.dataset.item))
      this.set("isCompleteHelpDesk",false)
      this.set("mobile",this.hcp.addresses[0].telecoms.find(tel => tel.telecomType==='mobile').telecomNumber)

      this.$["helpdeskInfoDialog"].open()
  }

  _openHelpDeskDialogDet(e){
      e.stopPropagation();
      this.set("infoHelpdesk", this.activeGridItem)
      this.set("isCompleteHelpDesk",true)
      this.set("infoHelpdeskDet",JSON.parse(e.target.dataset.item))
      this.set("mobile",this.hcp.addresses[0].telecoms.find(tel => tel.telecomType==='mobile').telecomNumber)

      this.$["helpdeskInfoDialog"].open()
  }

  receiveInvoices() {
      this.set('_isLoading', true );
      this._setLoadingMessage({ message: "Réception des messages efact", icon:"arrow-forward"});
      const LastGet = parseInt(localStorage.getItem('lastInvoicesGet')) ? parseInt(localStorage.getItem('lastInvoicesGet')) : -1
      const mayGet = (LastGet < Date.now() + 60*60000 || LastGet===-1)
      if (mayGet) {
          this.set('cannotGet',true)
          localStorage.setItem('lastInvoicesGet', Date.now())
          this.api.fhc().Efactcontroller().loadMessagesUsingGET(this.hcp.nihii, this.language, this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, this.hcp.ssin, this.hcp.firstName, this.hcp.lastName).then( x => this.api.logMcn(x, this.user, this.hcp.id, "eFact", "loadMessages") ).then(response => {
              let prom = Promise.resolve()
              this._setLoadingMessage({ message: "Traitement des messages efacts", icon:"arrow-forward"});

              response.forEach(message => {
                  // console.log(message)
                  prom = prom.then(messages =>
                      new Promise((resolve) => {
                          if (message.detail) {
                              this.api.message().processEfactMessage(this.user, this.hcp, message, null, (iv, hcpId) =>
                                  iv.recipientId && this.api.insurance().getInsurance(iv.recipientId)
                                      .then(ins => this.api.insurance().getInsurance(ins.parent))
                                      .then(ins => `invoice:${hcpId}:${ins.code || '000'}:`)
                                  || Promise.resolve(`invoice:${hcpId}:000:`)
                              ).then(msg => {
                                  msg ? resolve(_.concat(messages, message)) : resolve(messages)
                              })
                                  .catch(e => {
                                      console.log('Erreur lors de la reception des messages efact',e)
                                      resolve(messages)
                                  })
                          } else if (message.tack) {
                              this.api.message().processTack(this.user, this.hcp, message)
                                  .then(rcpt => {
                                      rcpt ? resolve(_.concat(messages, message)) : resolve(messages)
                                  })
                                  .catch(e => {
                                      console.log('Erreur lors de la reception des tacks efact',e)
                                      resolve(messages)
                                  })
                          }
                      })
                  )

              })

              prom = prom.then(treatedMessages => {
                  console.log(treatedMessages)

                  let sprom = Promise.resolve()
                  _.chunk(treatedMessages, 20).forEach(chunk => {
                      const tacks = chunk.filter(x => x && x.tack)
                      const responses = chunk.filter(x => x && x.detail)

                      sprom = sprom
                          .then(() =>this.api.fhc().Efactcontroller().confirmAcksUsingPUT(this.hcp.nihii, this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, this.hcp.ssin, this.hcp.firstName, this.hcp.lastName, tacks.map(t => t.hashValue)))
                          .then(() => this.api.fhc().Efactcontroller().confirmMessagesUsingPUT(this.hcp.nihii, this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, this.hcp.ssin, this.hcp.firstName, this.hcp.lastName, responses.map(t => t.hashValue)))

                  })
                  return sprom

              })

              return prom.then(() => {
                  this.set('isReceiving',false)
                  this.set("isMessagesLoaded",false)
                  this.set('_isLoading', false);
                  this.getMessage()
              })
          })
      }
  }

  _dateFormat(date) {
      return date ? this.api.moment(date).format('DD/MM/YYYY') : '';
  }

  isProcess(){
      return this.invoicesStatus === "process"
  }

  isReject(){
      return (this.invoicesStatus === "reject")
  }

  isArchived(){
      return (this.invoicesStatus === "archive")
  }


  isArchOrAcc(){
      return !(this.invoicesStatus === "reject" || this.invoicesStatus === "process" || this.invoicesStatus === "toBeCorrected")

  }

  isToBeCorrected(){
      return (this.invoicesStatus === "toBeCorrected")
  }

  initializeBatchCounter(toBeSend, toBeCorrected, processedCounter, acceptedCounter, rejectedCounter, archivedCounter){
      this.dispatchEvent(new CustomEvent('initialize-batch-counter', { bubbles: true, composed: true, detail: { toBeSend: toBeSend, toBeCorrected: toBeCorrected,  processing: processedCounter, rejected: rejectedCounter, accepted: acceptedCounter, archived: archivedCounter} }));
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

  _isEqual(a,b) {console.log('a',a);return (a === b)}
  _isPartiallyAccepted(test) { return (test === this.localize('inv_par_acc','Partially accepted',this.language))}
  _isMoreThen(a,b,so) {return (a>b)? so : 'false'}

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

  _openInvoicingDialog(e){
      if(e && e.target && e.target.id){
          this.$.invoicingForm.open({invoicingCodeId:e.target.id})
      }
  }

  _openArchiveDialogForBatch(){
      if(this.activeGridItem && this.activeGridItem.message && this.activeGridItem.message.id){
          this.$["archiveDialog"].open()
      }
  }

  _archiveBatch(){
      if(this.activeGridItem && this.activeGridItem.message && this.activeGridItem.message.id){
          const newStatus = (this.activeGridItem.message.status | (1 << 21))
          this.set("activeGridItem.message.status", newStatus)
          this.api.message().modifyMessage(this.activeGridItem.message)
              .then(msg => this.api.register(msg, 'message'))
              .then(msg => this.api.invoice().getInvoices(new models.ListOfIdsDto({ids: msg.invoiceIds.map(i => i)})))
              .then(invoices => invoices.map(inv => {
                  inv.invoicingCodes.map(ic => ic.archived = true)
                  this.api.invoice().modifyInvoice(inv).then(inv => this.api.register(inv,'invoice'))
              })).finally(() => {
                  this.$["archiveDialog"].close()
                  this.fetchMessageToBeSendOrToBeCorrected()
          })
      }
  }

  _getPaidStatus(paidStatus){
      return (paidStatus && paidStatus === true) ? "Oui" : "Non"
  }

  _isBatchCanBeAutoArchived(){
      return this.messageIdsCanBeAutoArchived.length > 0 && this.invoicesStatus === "reject"
  }

  _getNbMsgToArchive(){
      return this.messageIdsCanBeAutoArchived && this.messageIdsCanBeAutoArchived.length
  }

  _archiveBatchAuto(){
      if(this.messageIdsCanBeAutoArchived && this.messageIdsCanBeAutoArchived.length > 0){
          this.api.setPreventLogging()
          Promise.all(this.messageIdsCanBeAutoArchived.map(id =>
              this.api.message().getMessage(id).then(msg => {
                  msg.status = (msg.status | (1 << 21))
                  this.api.message().modifyMessage(msg)
                      .then(msg => this.api.register(msg, 'message'))
                      .then(msg => this.api.invoice().getInvoices(new models.ListOfIdsDto({ids: msg.invoiceIds.map(i => i)})))
                      .then(invoices => invoices.map(inv => {
                          inv.invoicingCodes.map(ic => ic.archived = true)
                          this.api.invoice().modifyInvoice(inv).then(inv => this.api.register(inv,'invoice'))
                      }))
              }))).then(() => this.fetchMessageToBeSendOrToBeCorrected())
              .finally(()=>this.api.setPreventLogging(false))
      }
  }

  reset(){
      this.set("isMessagesLoaded",false)
  }


  _transferInvoicesForResending(){
      if(this.activeGridItem && this.activeGridItem.message && this.activeGridItem.message.id && this.activeGridItem.message.invoiceIds.length){
          this.set('_isLoading', true );
          this._setLoadingMessage({ message:this.localize('tran-inv',this.language), icon:"arrow-forward"});

          let prom = Promise.resolve({})
          this.api.setPreventLogging()
          this.api.invoice().getInvoices(new models.ListOfIdsDto({ids: this.activeGridItem.message.invoiceIds.map(id => id)}))
            .then(invs => {
                invs.map(inv => {
                    inv.invoicingCodes.map(ic => ic.pending = false)
                    inv.sentDate = null
                    prom = prom.then(invs => this.api.invoice().modifyInvoice(inv)
                        .then(() => _.concat(invs, [inv]))
                        .catch(e => console.log('Erreur lors du traitement de la facture', inv, e))
                    )
                })

                return prom.then(() => {
                    return this.api.message().getMessage(this.activeGridItem.message.id).then(msg => {
                        this._setLoadingMessage({ message:this.localize('arch_mess',this.language), icon:"arrow-forward"});
                        msg.status = (msg.status | (1 << 21))
                        this.api.message().modifyMessage(msg)
                            .then(msg => this.api.register(msg, 'message'))
                            .then(msg => {
                                console.log(msg)
                                this.fetchMessageToBeSendOrToBeCorrected()
                                this.set('_isLoading', false );
                            })
                            .catch(e => console.log("Erreur lors de l'archivage du message", msg, e))
                    })
                })
            })
              .finally(()=>this.api.setPreventLogging(false))
      }
  }

  _loadingStatusChanged() {
      if(!this._isLoading) this._resetLoadingMessage();
  }

  _setLoadingMessage( messageData ) {
      if( messageData.updateLastMessage ) { this._loadingMessages.pop(); }
      this._loadingMessages.push( messageData );
      let loadingContentTarget = this.shadowRoot.querySelectorAll('#loadingContent')[0];
      if(loadingContentTarget) { loadingContentTarget.innerHTML = ''; _.each(this._loadingMessages, (v)=>{ loadingContentTarget.innerHTML += "<p><iron-icon icon='"+v.icon+"' class='"+(v.done?"loadingIcon done":"loadingIcon")+"'></iron-icon>" + v.message + "</p>"; }); }
  }

  _resetLoadingMessage() {
      this._loadingMessages = [];
  }

  _flagInvoiceAsLostConfirmationDialog(e) {
      this.flagInvoiceAsLostId = _.get(e, "target.dataset.invoiceId", "")
      this.set("_bodyOverlay", true);
      this.$["flagInvoiceAsLostConfirmationDialog"].open()
  }

  _flagInvoiceAsLost() {

      this.set('_isLoadingSmall', true );

      this.api.invoice().getInvoice(this.flagInvoiceAsLostId)
          .then(invoice => {
              invoice.invoicingCodes.map(ic => {
                  ic.canceled = true;
                  ic.lost = true;
                  ic.accepted = false;
                  ic.pending = false;
                  ic.resent = false;
                  ic.archived = false;
                  return ic;
              })
              invoice.error = "Flagged as lost"
              return this.api.invoice().modifyInvoice(invoice).then(invoice => this.api.register(invoice,'invoice'))
          })
          .catch((e)=>{console.log(e)})
          .finally(() => {
              this.flagInvoiceAsLostId = "";
              this._closeDialogs()
              this.set('_isLoadingSmall', false );
              this.fetchMessageToBeSendOrToBeCorrected()
          })

  }

  _closeDialogs() {
      this.set("_bodyOverlay", false);
      _.map( this.shadowRoot.querySelectorAll('.modalDialog'), i=> i && typeof i.close === "function" && i.close() )
  }
}

customElements.define(HtMsgInvoice.is, HtMsgInvoice);
