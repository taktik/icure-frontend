import '../../dynamic-form/dynamic-link.js';
import '../../dynamic-form/dynamic-pills.js';
import '../../../styles/dialog-style.js';
import '../../../styles/paper-tabs-style.js';
import '../../ht-spinner/ht-spinner.js';

import {TkLocalizerMixin} from "../../tk-localizer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior";
import {PolymerElement, html} from '@polymer/polymer';
class HtPatEdmgDialog extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
        <style include="dialog-style paper-tabs-style">
            #dialog .ch4-cons{
                display: flex;
                flex-flow: row wrap;
                align-items: center;
                justify-content: flex-start;
                width: 100%;
                box-sizing: border-box;
            }

            paper-tabs{
                width: 50%;
                max-width: 400px;
            }

            .dmg-cons{
                padding: 0 12px;
            }

            .dmg-cons > div {
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
            }

            #dialog .dmg-cons vaadin-date-picker {
                margin-right: 8px;
            }

            #dialog a {
                text-decoration: none;
                color:	var(--app-secondary-color);
            }

            #dialog{
                min-height: 600px;
                min-width: 800px;
            }

            .links {
                position: absolute;
                right: 0;
            }

            .pills {
                float: right;
            }

            dynamic-link {
                float: right;
                top:4px;
            }

            vaadin-combo-box {
                width: 100%;
            }

            vaadin-text-area {
                width: 100%;
            }

            .containerCH4Cons {
                height: 58px;
                display: flex;
            }

            #par-search {
                flex: 1;
            }

            #dialog .edmg-info{
                margin-top:0;
                display:flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: flex-start;
            }

            #dialog .edmg-info div{
                margin-right: 24px;
            }

            #dialog .edmg-info div p{
                margin: 8px 0;
            }

            #dialog .edmg-info div b{
                margin-right: 8px;
            }
            ht-spinner {
                position: relative;
                height: 42px;
                width: 42px;
            }

            .content {
                height: 496px;
            }
        </style>

        <paper-dialog id="dialog" opened="{{opened}}">
            <h2 class="modal-title">
                [[localize('e_dmg','e-Dmg',language)]]
                <paper-tabs class="tab-selector" selected="{{tabs}}">
                    <paper-tab>[[localize('dmg-con','Dmg Consultation',language)]]</paper-tab>
                    <paper-tab>[[localize('dmg_not','Dmg Notification',language)]]</paper-tab>
                    <!--<paper-tab>[[localize('dmg_tst','Dmg Test',language)]]</paper-tab>-->
                </paper-tabs>
            </h2>
            <iron-pages selected="[[tabs]]" class="content">
                <page>
                    <div class="dmg-cons">
                        <div>
                            <vaadin-date-picker label="[[localize('req_dat','Request date',language)]]" value="{{consultStart}}" i18n="[[i18n]]"></vaadin-date-picker>
                            <!--<vaadin-date-picker label="[[localize('endDate','End date',language)]]" value="{{consultEnd}}" i18n="[[i18n]]"></vaadin-date-picker>-->
                            <paper-button class="button button--other" on-tap="_consultDmg" disabled="[[isLoading]]">[[localize('refresh','Refresh',language)]]</paper-button>
                        </div>
                        <!-- Show consultation result/errors -->
                        <div class="edmg-info">
                            <template is="dom-if" if="{{consultDmgResp}}">
                                <template is="dom-if" if="{{_hasErrors(consultDmgResp.errors)}}">
                                    <p><b>[[localize('err','Error',language)]]:</b><br>
                                        <template is="dom-repeat" items="[[consultDmgResp.errors]]" as="error">
                                            <b>[[error.code]]</b> [[_formatError(error)]]<br>
                                        </template>
                                    </p>
                                </template>
                                <template is="dom-if" if="{{!_hasErrors(curGenInsResp.errors)}}">
                                    <template is="dom-if" if="{{consultDmgResp.faultMessage}}"><p><b>[[localize('faultMessage','faultMessage',language)]]:</b>[[consultDmgResp.faultMessage]]</p></template>
                                    <template is="dom-if" if="{{consultDmgResp.faultSource}}"><p><b>[[localize('faultSource','faultSource',language)]]:</b>[[consultDmgResp.faultSource]]</p></template>
                                    <template is="dom-if" if="{{consultDmgResp.faultCode}}"><p><b>[[localize('faultCode','faultCode',language)]]:</b>[[consultDmgResp.faultCode]]</p></template>
                                </template>
                                <template is="dom-if" if="{{_hasNoDmg(consultDmgResp)}}">
                                    <div><p><b>[[localize('nam','Name',language)]]:</b> [[patient.firstName]] [[patient.lastName]]</p></div>
                                    <div><p><b>[[localize('no_dmg','No Dmg',language)]]</b></p></div>
                                </template>
                                <template is="dom-if" if="{{_hasDmg(consultDmgResp)}}">
                                    <div>
                                        <p><b>[[localize('nam','Name',language)]]:</b> [[consultDmgResp.firstName]] [[consultDmgResp.lastName]]</p>
                                        <p><b>[[localize('sex','Gender',language)]]:</b> [[localize(consultDmgResp.sex,consultDmgResp.sex,language)]]</p>
                                        <p><b>[[localize('dat_of_bir','Birthdate',language)]]:</b> [[_dateFormat(consultDmgResp.birthday,'DD/MM/YYYY')]]</p>
                                        <template is="dom-if" if="{{consultDmgResp.deceased}}"><p><b>[[localize('deceased','Deceased',language)]]:</b>[[_dateFormat(consultDmgResp.deceased,'DD/MM/YYYY')]]</p></template>
                                        <p><b>[[localize('ssin','SSIN',language)]]:</b> [[consultDmgResp.inss]]</p>
                                        <p><b>[[localize('mut','Mut',language)]]:</b> [[consultDmgResp.mutuality]]</p>
                                        <p><b>[[localize('regNrWithMut','Membership',language)]]:</b> [[consultDmgResp.regNrWithMut]]</p>
                                    </div>
                                    <div>
                                        <p><b>[[localize('dmg_holder','Dmg Holder',language)]]:</b></p>
                                        <template is="dom-if" if="{{consultDmgResp.hcParty.familyname}}"><p><b>[[localize('nam','Name',language)]]:</b>[[consultDmgResp.hcParty.firstname]] [[consultDmgResp.hcParty.familyname]]</p></template>
                                        <template is="dom-if" if="{{consultDmgResp.hcParty.name}}"><p><b>[[localize('nam','Name',language)]]:</b>[[consultDmgResp.hcParty.name]]</p></template>
                                        <p><b>[[_getHcpTypeDesc(consultDmgResp)]]:</b> [[_getHcpNihii(consultDmgResp)]]</p>
                                        <p><b>[[localize('from','From',language)]]:</b> [[_dateFormat(consultDmgResp.from, 'DD/MM/YYYY')]]
                                            <b>[[localize('to','To',language)]]:</b> [[_dateFormat(consultDmgResp.to, 'DD/MM/YYYY')]]</p>
                                        <p><b>[[localize('pay_dmg','Payment',language)]]:</b> [[_yesOrNo(consultDmgResp.payment)]]</p>
                                        <!--<p><b>[[localize('cpl','Complete',language)]]:</b> [[_yesOrNo(consultDmgResp.complete)]]</p>-->
                                    </div>
                                </template>
                            </template>
                        </div>
                    </div>
                </page>
                <page>
                    <div class="dmg-cons"> <!-- Notification input -->
                        <div class="edmg-info">
                            <template is="dom-if" if="[[!_enableNotification(allEDmgregistered, asSupervisor)]]">
                                <p>[[localize('dmg_reg_incpl','e-Dmg registration not yet completed',language)]]</p>
                            </template>
                            <!--<template is="dom-if" if="{{_eDmgRegComplete()}}">-->
                                <!--<p>localize('dmg_reg_cpl','e-Dmg registration completed',language)</p>-->
                            <!--</template>-->
                        </div>
                        <template is="dom-if" if="[[_enableNotification(allEDmgregistered, asSupervisor)]]">
                        <paper-input label="[[localize('nomen','Prestation code',language)]]" value="{{nomenclature}}"></paper-input>
                        <vaadin-date-picker label="[[localize('prest-dat','Encounter date',language)]]" value="{{encounterDate}}" i18n="[[i18n]]"></vaadin-date-picker>
                            <vaadin-checkbox checked="{{asSupervisor}}">[[localize('in_name_sup','In the name of the supervisor',language)]]</vaadin-checkbox>
                            <paper-button class="action" on-tap="_dmgNotify" disabled="[[isLoading]]">[[localize('dmg_not','Notify',language)]]</paper-button>

                            <template is="dom-if" if="{{notifyDmgResp}}">
                                <template is="dom-if" if="{{_hasErrors(notifyDmgResp.errors)}}">
                                    <p><b>[[localize('err','Error',language)]]:</b><br>
                                        <template is="dom-repeat" items="[[notifyDmgResp.errors]]" as="error">
                                            <b>[[error.code]]</b> [[_formatError(error)]]<br>
                                        </template>
                                    </p>
                                </template>
                                <template is="dom-if" if="{{!_hasErrors(notifyDmgResp.errors)}}">
                                    <template is="dom-if" if="{{notifyDmgResp.hcParty.familyname}}"><p><b>[[localize('nam','Name',language)]]:</b>[[notifyDmgResp.hcParty.firstname]] [[notifyDmgResp.hcParty.familyname]]</p></template>
                                    <template is="dom-if" if="{{notifyDmgResp.hcParty.name}}"><p><b>[[localize('nam','Name',language)]]:</b>[[notifyDmgResp.hcParty.name]]</p></template>
                                    <p><b>[[localize('ssin','SSIN',language)]]:</b> [[_getHcpSinn(notifyDmgResp)]]</p>
                                    <p><b>[[_getHcpTypeDesc(notifyDmgResp)]]:</b> [[_getHcpNihii(notifyDmgResp)]]</p>
                                    <p><b>[[localize('from','From',language)]]:</b> [[_dateFormat(notifyDmgResp.from, 'DD/MM/YYYY')]]</p>
                                    <p><b>[[localize('pay_dmg','Payment',language)]]:</b> [[_yesOrNo(notifyDmgResp.payment)]]</p>
                                    <!--<p><b>[[localize('cpl','Complete',language)]]:</b> [[_yesOrNo(notifyDmgResp.complete)]]</p>-->
                                </template>
                            </template>
                        </template>
                    </div>
                </page>
            </iron-pages>
            <div class="buttons">
                <ht-spinner active="[[isLoading]]"></ht-spinner>
                <paper-button class="button" dialog-dismiss="">[[localize('clo','Close',language)]]</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-pat-edmg-dialog';
  }

  static get properties() {
      return {
          dmgAction:{
            type: String,
            value: 'dmgConsultation'
          },
          api: {
              type: Object,
              value: null
          },
          parListItem: {
              type: Array,
              value: () => []
          },
          parFilterValue: {
              type: String
          },
          user: {
              type: Object,
              value: null
          },
          userHcp: {
              type:Object,
              value: {"supervisorId" : null}
          },
          language: {
              type: String
          },
          comboStatus: {
              type: Array,
              value : () => [
                  {
                      "id"       : "aborted",
                      "label": {"fr": "Abandonné / Contre-indiqué", "nl": "Verlaten / Niet aangegeven", "en": "Abandoned / Against indicated"}
                  },
                  {
                      "id"       : "aborted",
                      "label": {"fr": "Abandonné / Décès", "nl": "Verlaten / ", "en": "Abandoned / Death"}
                  },
                  {
                      "id"       : "aborted",
                      "label": {"fr": "Abandonné / Désabonné", "nl": "Verlaten / Afgemeld", "en": "Abandoned / Unsubscribed"}
                  },
                  {
                      "id"       : "error",
                      "label": {"fr": "Abandonné / Erreur", "nl": "Verlaten /", "en": "Abandoned / Error"}
                  },
                  {
                      "id"       : "aborted",
                      "label": {"fr": "Abandonné / Non pertient", "nl": "Verlaten / Irrelevant", "en": "Abandoned / Not relevant"}
                  },
                  {
                      "id"       : "refused",
                      "label": {"fr": "Abandonné / Refus patient", "nl": "Verlaten / Weigering van de patiënt", "en": "Abandoned / Patient refusal"}
                  },
                  {
                      "id"       : "aborted",
                      "label": {"fr": "Abandonné / Trop tard", "nl": "Verlaten / ", "en": "Abandoned / Too late"}
                  },
                  {
                      "id"       : "aborted",
                      "label": {"fr": "Abandonné par le patient", "nl": "Verlaten / erwachting", "en": "Abandoned by patient"}
                  },
                  {
                      "id"       : "pending",
                      "label": {"fr": "En attente", "nl": "Verwachting", "en": "Waiting"}
                  },
                  {
                      "id"       : "planned",
                      "label": {"fr": "En attente planifié", "nl": "Gepland wachten", "en": "Scheduled waiting"}
                  },
                  {
                      "id"       : "completed",
                      "label": {"fr": "Fait", "nl": "Geëxecuteerd", "en": "Done"}
                  },
                  {
                      "id"       : "proposed",
                      "label": {"fr": "Rappel envoyé", "nl": "Herinnering verzonden", "en": "Reminder sent"}
                  }
              ]
          },
          selectedItem: {
              type: Object,
              value: null
          },
          opened: {
              type: Boolean,
              value: false
          },
          consultDmgResp:{
              type: Object,
              value: null
          },
          notifyDmgResp:{
              type: Object,
              value: null
          },
          consultStart:{
              type: Date,
              value: null
          },
          consultEnd:{
              type: Date,
              value: null
          },
          nomenclature:{
              type: String,
              value: null
          },
          encounterDate:{
              type: Date,
              value: null
          },
          edmgNiss:{
              type: String,
              value: null
          },
          edmgOA:{
              type: String,
              value: null
          },
          edmgAFF:{
              type: String,
              value: null
          },
          listOAs: {
              type: Array,
              value: ['100','200','300','400','500','600','900']
          },
          regStatus:{
              type: Object,
              value: null
          },
          allEDmgRegistered:{
              type: Boolean,
              value: false
          },
          asSupervisor:{
            type: Boolean,
            value: false
          },
          currentRegs:{
              type: Object,
              value : null
          },
          userIBAN: {
              type: String,
              value: null
          },
          userBIC: {
              type: String,
              value: null
          },
          tabs: {
              type:  Number,
              value: 0
          },
          listRequestDate: {
              type: Date,
              value:null
          },
          listIO:{
              type: String,
              value: null
          },
          getListResp:{
              type: Object,
              value: null
          },
          isLoading:{
              type: Boolean,
              value: false
          }
      };
  }

  static get observers() {
      return ['apiReady(api,user,opened)', 'hcpSupervisorChanged(userHcp.supervisorId)'];
  }

  ready() {
      super.ready();
      this.addEventListener('iron-resize', () => this.onWidthChange());
  }

  _dateFormat(date) {
      return date ? this.api.moment(date).format('DD/MM/YYYY') : '';
  }

  onWidthChange() {
      const offsetWidth = this.$.dialog.offsetWidth;
      const offsetHeight = this.$.dialog.offsetHeight;
      if (!offsetWidth || !offsetHeight) {
          return;
      }
      // this.set('qrCodeWidth', Math.min(offsetWidth - 32, offsetHeight - 160));
  }

  getBankInfo()
  {
      const propBIC = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.BIC') ||
          (this.user.properties[this.user.properties.length] = {
              type: {identifier: 'org.taktik.icure.user.BIC'},
              typedValue: {type: 'STRING', stringValue: ''}
          });
      this.set('userBIC', propBIC.typedValue.stringValue);

      const propIBAN = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.IBAN') ||
          (this.user.properties[this.user.properties.length] = {
              type: {identifier: 'org.taktik.icure.user.IBAN'},
              typedValue: {type: 'STRING', stringValue: ''}
          });
      this.set('userIBAN', propIBAN.typedValue.stringValue);
  }

  _showDmgAction(action){
      return this.dmgAction === action;
  }

  _hasErrors(errs){
      return errs && errs.length > 0;
      //return true;
  }

  _formatError(error){
      return `[${this.language === 'nl' ? error.locNl : error.locFr}] - ${error.value ? error.value + ' : ' : ""} - ${this.language === 'nl' ? error.msgNl : error.msgFr}`;
  }

  _hasDmg(edmgConsult){
      return edmgConsult && edmgConsult.from
  }

  _hasNoDmg(edmgConsult){
      return !this._hasDmg(edmgConsult) && !this._hasErrors(edmgConsult.errors)
  }


  _yesOrNo(b){
      return b ? this.localize('yes','yes',this.language) : this.localize('no','no',this.language)
  }

  _getHcpTypeDesc(edmgConsult){
      return this.localize(this._getHcpType(edmgConsult),this._getHcpType(edmgConsult),this.language);
  }

  _getHcpType(edmgConsult){
      if(edmgConsult && edmgConsult.hcParty && edmgConsult.hcParty.cds && edmgConsult.hcParty.cds[0]) {
          return edmgConsult.hcParty.cds[0].value;
      } else {
          return '';
      }
  }

  _getHcpNihii(edmgConsult){
      if(edmgConsult && edmgConsult.hcParty && edmgConsult.hcParty.ids && edmgConsult.hcParty.ids[0]) {
          return  edmgConsult.hcParty.ids.find(id => id.s === 'ID_HCPARTY') ? edmgConsult.hcParty.ids.find(id => id.s === 'ID_HCPARTY').value : '';
      } else {
          return '';
      }
  }

  _getHcpSinn(edmgConsult){
      if(edmgConsult && edmgConsult.hcParty && edmgConsult.hcParty.ids && edmgConsult.hcParty.ids[0]) {
          return  edmgConsult.hcParty.ids.find(id => id.s === 'INSS') ? edmgConsult.hcParty.ids.find(id => id.s === 'INSS').value : '';
      } else {
          return '';
      }
  }

  _getOARegStatus(reg){
      if (reg) {
          return reg.registered ? reg.OA + ':OK ' : reg.OA + ':NOK ';
      } else {
          return ''
      }
  }

  _registerToEDMG(){
      //100,200,300,400,500,600,900
      let regs = this.getRegistrationStatus();
      regs.rs.map(reg =>{
          if(!reg.registered) {
              this.registerToEDMGbyOA(reg).then(reg =>{
                  const idx = regs.rs.findIndex(r => r.OA === reg.OA);
                  if(idx >= 0){
                      regs.rs.splice(idx, 1, reg);
                  } else {
                      regs.rs.push(reg);
                  }
                  this.set('regStatus',JSON.stringify(regs));
              })
          }
      })
  }

  getRegistrationStatus(){
      const propRegStatus = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.eDMG.RegistrationStatus') ||
          (this.user.properties[this.user.properties.length] = {
              type: {identifier: 'org.taktik.icure.user.eDMG.RegistrationStatus'},
              typedValue: {type: 'JSON', stringValue: '{\"rs\":[]}'}
          });
      //'{"rs":[{"OA":"100","Comment":"","ErrorCode":""}]}'

      let OAStatus = {};
      if(propRegStatus && propRegStatus.typedValue) {
          OAStatus = JSON.parse(propRegStatus.typedValue.stringValue);
      }
      let regs = {rs: (OAStatus.rs||[]).map(r => r)}
      this.listOAs.map(itOA => {
          let reg = regs.rs.find(r => r.OA === itOA) || {OA : itOA, registered: false, lastExecution: null, Comment : '', ErrorCode :  '', iban :'', bic: '' };
          const idx = regs.rs.findIndex(r => r.OA === itOA);
          if(idx >= 0){
              regs.rs.splice(idx, 1, reg);
          } else {
              regs.rs.push(reg);
          }
      })
      this.set('allEDmgregistered', regs.rs.every(r => !!r.registered));
      this.set('currentRegs', regs);

      return regs;
  }

  _enableNotification(allReg, superv){
      return allReg || superv;
  }

  _eDmgRegComplete(){
      return this.allEDmgregistered;
  }

  isEven(n) {
      return n % 2 == 0;
  }

  getGender(niss){
      if(niss && niss.length === 11){
          const c9 = niss.substring(8,9);
          const even = this.isEven(parseInt(c9));
          if(even){
              return 'female';
          }
          else{
              return 'male';
          }
      }
      else{
          return '';
      }

  }

  _dmgNotify(){
      this.getDmgNotifyResult().then(edmgresp => this.set('notifyDmgResp', edmgresp))
  }

  //xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
  // hcpNihii: string, hcpSsin: string, hcpFirstName: string, hcpLastName: string,
  // nomenclature: string,
  // patientSsin?: string, oa?: string, regNrWithMut?: string, patientFirstName?: string, patientLastName?: string, patientGender?:
  // string, requestDate?: number
  getDmgNotifyResult(){
      const requestDate = Date.parse(this.encounterDate);
      if (this.api.tokenId) {
          this.set('isLoading',true)
          //if(this.genInsOA && this.genInsOA !=='' && this.genInsAFF && this.genInsAFF !== ''){
          if(((this.edmgNiss && this.edmgNiss !=='') || (this.patient.ssin && this.patient.ssin !== '')) && !(this.edmgOA && this.edmgOA !=='')){
              return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
                  .then(hcp => {
                          return (this.asSupervisor && hcp.supervisorId ?
                              this.api.hcparty().getHealthcareParty(hcp.supervisorId).then(sup =>
                                  this.api.fhc().Dmgcontroller().notifyDmgUsingPOST(
                                      this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                                      hcp.nihii, hcp.ssin, hcp.firstName, hcp.lastName, this.nomenclature,
                                      this.edmgNiss ? this.edmgNiss.trim() : this.patient.ssin, null, null,
                                      this.patient.firstName, this.patient.lastName,
                                      this.getGender(this.patient.ssin),
                                      requestDate, sup.ssin, sup.nihii, sup.firstName, sup.lastName))
                              :
                              this.api.fhc().Dmgcontroller().notifyDmgUsingPOST(
                                  this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                                  hcp.nihii, hcp.ssin, hcp.firstName, hcp.lastName, this.nomenclature,
                                  this.edmgNiss ? this.edmgNiss.trim() : this.patient.ssin, null, null,
                                  this.patient.firstName, this.patient.lastName,
                                  this.getGender(this.patient.ssin),
                                  requestDate)).then(dmgNotif => this.api.logMcn(dmgNotif, this.user, this.patient.id, "DMG", "notify"))
                      }
                  ).then(edmgResp => {
                          if (edmgResp) {
                              this.set('isLoading',false)
                              return edmgResp;
                          } else {
                              this.set('isLoading',false)
                              return null;
                          }
                      }
                  )
          }else{
              //return Promise.resolve(null)
              //there is no niss
              let oa = this.genInsOA;
              let aff = this.genInsAFF;
              const pi = this.patient.insurabilities && _.assign({}, this.patient.insurabilities[0] || {});
              this.api.insurance().getInsurance(pi.insuranceId).then(insu => {
                  return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
                      .then(hcp => {
                              return this.api.fhc().Dmgcontroller().notifyDmgUsingPOST(
                                  this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                                  hcp.nihii, hcp.ssin, hcp.firstName, hcp.lastName,
                                  null, null, (this.genInsOA && this.genInsOA != '') ? this.genInsOA.trim() : insu.code,
                                  (this.genInsAFF && this.genInsAFF != '') ? this.genInsAFF.trim() : pi.identificationNumber,
                                  requestDate).then(dmgNotif => this.api.logMcn(dmgNotif, this.user, this.patient.id, "DMG", "notify"))
                          }
                      ).then(edmgResp => {
                              if (edmgResp) {
                                  this.set('isLoading',false)
                                  return edmgResp;
                              } else {
                                  this.set('isLoading',false)
                                  return null;
                              }
                          }
                      )
              });
          }
      } else {
          this.set('isLoading',false)
          return Promise.resolve(null)
      }

  }



  _consultDmg(){
      if (!this.api.tokenId || this.isLoading) return;
      this.set('isLoading', true);
      this.api.getUpdatedEdmgStatus(
          this.user,
          this.patient,
          Date.parse(this.consultStart),
          this.edmgNiss,
          this.edmgOA,
          this.genInsOA,
          this.genInsAFF                    ,
          true    // Bypass cache, force hit on fhc().Dmgcontroller().consultDmgUsingGET()
      ).then(edmgResp => {
          this.set('isLoading',false)
          this.set('consultDmgResp', edmgResp);
      });
  }


  hcpSupervisorChanged(supervisorId){
      if(supervisorId && supervisorId !== '') {
          this.set('asSupervisor', true);
      }
      else
      {
          this.set('asSupervisor', false);
      }
  }


  apiReady() {
      if (!this.api || !this.user || !this.user.id || !this.opened) return;

      try {
      } catch (e) {
          console.log(e);
      }
  }

  attached() {
      super.attached();
      this.async(this.notifyResize, 1);
  }


  open() {
      this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
          this.set('userHcp', hcp);
      })
      this.set('edmgNiss', null);
      this.set('edmgOA', null);
      this.set('edmgAFF', null);
      this.set('consultStart', null);
      this.set('consultEnd', null);
      this.set('consultDmgResp', null);
      this.set('notifyDmgResp', null);
      this.getRegistrationStatus();
      this.$.dialog.open();
      this.getBankInfo();
      this._consultDmg();
  }

  close() {
      this.$.dialog.close();
  }
}
customElements.define(HtPatEdmgDialog.is, HtPatEdmgDialog);
