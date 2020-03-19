import '../../../dynamic-form/ckmeans-grouping.js';
import '../../../../styles/vaadin-icure-theme';
import '../../../../styles/spinner-style';
import '../../../../styles/scrollbar-style';
import '../../../../styles/shared-styles';
import '../../../../styles/buttons-style';
import '../../../../styles/dialog-style';
import '../../../../styles/invoicing-style';
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
class HtMsgInvoiceToBeCorrected extends TkLocalizerMixin(PolymerElement) {
    static get template() {
        return html`

        <style include="shared-styles spinner-style scrollbar-style buttons-style dialog-style invoicing-style">
            .panel{
                margin: 0.5%;
                background-color: red;
                height: calc(100% - 20px);
                width: auto;
            }
            
            .panel-title{
                height: 40px;
                width: auto;
                background-color: green;
            }
            
            .panel-search{
                height: 40px;
                width: auto;
                background-color: gray;
            }
            
            .panel-content{
                height: calc(100% - 120px);
                width: auto;
                background-color: blue;
            }
            
            .panel-button{
                height: 40px;
                width: auto;
                background-color: yellow;
            }
            
            .table{         
                width: auto;
                overflow: auto;
            }
            
            .tr{
                display: flex;
            }
            
            .td{
            
            }
            
        </style>
        
        <div class="panel">
            <div class="panel-title">
                [[localize('', 'To be corrected', language)]] <span class="batchNumber batchToBeCorrected">{{_forceZeroNum(messagesToBeCorrected.length)}}</span>
            </div>
            <div class="panel-search">
                
            </div>
            <div class="panel-content">
                <div class="table">
                    <div class="tr">
                        <div class="td">[[localize('inv_type','Type',language)]]</div>
                        <div class="td">[[localize('inv_mut','Mutual',language)]]</div>
                        <div class="td">[[localize('inv_num_fac','Invoice number',language)]]</div>
                        <div class="td">[[localize('inv_pat','Patient',language)]]</div>
                        <div class="td">[[localize('inv_niss','Inss',language)]]</div>
                        <div class="td">[[localize('inv_date','Invoice date',language)]]</div>
                        <div class="td">[[localize('inv_oa','Oa',language)]]</div>
                        <div class="td">[[localize('inv_pat','Patient',language)]]</div>
                        <div class="td">[[localize('inv_supp','Extra',language)]]</div>
                        <div class="td">[[localize('inv_tot','Total',language)]]</div>
                        <div class="td">[[localize('inv_stat','Status',language)]]</div>
                        <div class="td"></div>                    
                    </div>
                    <template is="dom-repeat" items="[[]]">
                        <div class="tr">
                            <div class="td">[[localize('inv_type','Type',language)]]</div>
                            <div class="td">[[localize('inv_mut','Mutual',language)]]</div>
                            <div class="td">[[localize('inv_num_fac','Invoice number',language)]]</div>
                            <div class="td">[[localize('inv_pat','Patient',language)]]</div>
                            <div class="td">[[localize('inv_niss','Inss',language)]]</div>
                            <div class="td">[[localize('inv_date','Invoice date',language)]]</div>
                            <div class="td">[[localize('inv_oa','Oa',language)]]</div>
                            <div class="td">[[localize('inv_pat','Patient',language)]]</div>
                            <div class="td">[[localize('inv_supp','Extra',language)]]</div>
                            <div class="td">[[localize('inv_tot','Total',language)]]</div>
                            <div class="td">[[localize('inv_stat','Status',language)]]</div>
                            <div class="td"></div>                    
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
        return 'ht-msg-invoice-to-be-corrected';
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
            listOfInvoice:{
                type: Array,
                value: () => []
            }
        };
    }

    constructor() {
        super();
    }

    static get observers() {
        return [];
    }

    _forceZeroNum(num) {
        return (!num) ? '0' : num.toString()
    }

}

customElements.define(HtMsgInvoiceToBeCorrected.is, HtMsgInvoiceToBeCorrected);
