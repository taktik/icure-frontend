import '../../../dynamic-form/dynamic-link.js';
import '../../../dynamic-form/dynamic-pills.js';
import '../../../ht-spinner/ht-spinner.js';
import '../../../../styles/dialog-style.js';
import '../../../../styles/buttons-style.js';
import * as models from 'icc-api/dist/icc-api/model/models';
import moment from 'moment/src/moment';
import _ from 'lodash/lodash';
import promiseLimit from 'promise-limit';


import {TkLocalizerMixin} from "../../../tk-localizer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior";
import {PolymerElement, html} from '@polymer/polymer';
class HtPatFlatRateUtils extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`

`;
  }

  static get is() {
      return 'ht-pat-flatrate-utils';
  }

  static get properties() {
      return {
          api: {
              type: Object,
              value: null
          },
          user: {
              type: Object,
              value: null
          },
          patient: {
              type: Object,
              notify: true
          },
          language: {
              type: String
          },
          opened: {
              type: Boolean,
              value: false
          },
          tabs: {
              type:  Number,
              value: 0
          },
          isLoading:{
              type: Boolean,
              value: false
          },
          insList:{
              type: Object,
              value: null
          },
          invoicedMonth:{
              type: Number,
              value: 201901
          }
      };
  }

  static get observers() {
      return ['apiReady(api,user,opened)'];
  }

  ready() {
      super.ready();
      // this.addEventListener('iron-resize', () => this.onWidthChange());
      document.addEventListener('xmlHubUpdated', () => this.xmlHubListener() );
  }

  _dateFormat(date) {
      return date ? this.api.moment(date).format('DD/MM/YYYY') : '';
  }

  _timeFormat(date) {
      return date ? this.api.moment(date).format(date > 99991231 ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY') : '';
  }

  _ageFormat(date) {
      return date ? this.api.getCurrentAgeFromBirthDate(date,( e , s ) => this.localize(e, s, this.language)) : '';
  }

  _dateFormat2(date, fFrom, fTo){
      return date ? this.api.moment(date, fFrom).format(fTo) : '';
  }

  _shortDateFormat(date, altDate) {
      return (date || altDate) && "'"+this.api.moment((date || altDate)).format('YY') || '';
  }

  _isElevated(CT){
      return CT && CT.substring(2) !== '0' ? this._yesOrNo(true) : this._yesOrNo(false);
  }

  _trueOrUnknown(b){
      return b ? this.localize('yes','yes',this.language) : '?'
  }

  _yesOrNo(b){
      return b ? this.localize('yes','yes',this.language) : this.localize('no','no',this.language)
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

  checkGenins(resList){
      let limit = promiseLimit(100);

      return Promise.all(resList.map(res => {
          return limit(() => {
              const dStart = this.getRequestDateFromRes(res);
              //TODO: only check patients where needed: niss-ok, mh-contract-ok
              console.log("utils.getGeneralInsurabilityUsingGET on date", dStart);
              return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => this.api.fhc().Geninscontroller().getGeneralInsurabilityUsingGET(
                  this.cleanNiss(res.pat.ssin),
                  this.api.tokenId ? this.api.tokenId : this.api.tokenIdMH, this.api.tokenId ? this.api.keystoreId : this.api.keystoreIdMH, this.api.tokenId ? this.api.credentials.ehpassword : this.api.credentials.ehpasswordMH,
                  this.api.tokenId ? hcp.nihii : this.api.nihiiMH, this.api.isMH ? this.api.MHContactPersonSsin : hcp.ssin, this.api.isMH ? this.api.MHContactPersonName : hcp.lastName + ' ' + hcp.firstName, this.api.tokenId ? "doctor" : "medicalhouse", dStart, null
              ).then(gi => {
                  res.genIns = gi;
                  //TODO: check if gi differs from assu in res
                  res.genInsMatch = true;
                  return res;
              }))
          })

      }))
  }

  getRequestDateFromRes(res){
      const date = new Date(), y = Number(res.invoicedMonth.toString().substr(0,4)), m = Number(res.invoicedMonth.toString().substr(4,2));
      return new Date(y,m,1).getTime();
  }

  checkFlatrateData(pat, invoicedMonth){
      //TODO: if multiple MHcontracts exist, check for overlap/validity of all
      //TODO: if multiple insurabilities extist, check for overlap/validity of all
      //Check if hcp or hcpParrent is flatrateInvoicing
      return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then( hcp =>
          hcp.parentId ? this.api.hcparty().getHealthcareParty(hcp.parentId) : hcp).then(hcp2 => {
          let res = {};
          res.hcp = hcp2;
          res.pat = pat;
          res.invoicedMonth = invoicedMonth;
          //console.log("hcp flatrate ?", hcp2);
          if(hcp2.billingType && hcp2.billingType.toLowerCase() === "flatrate") {
              //PatientData:
              //  NISS
              res.nissCheck = this.checkNissValid(pat);
              //  Gender
              res.genderCheck = this.checkGender(pat);
              //  GenderNissMatch
              res.genderNissCheck = this.checkGenderNiss(pat, res.genderCheck, res.nissCheck);
              //  DeathDate
              res.aliveCheck = this.checkAlive(pat, invoicedMonth);
              //Insurability:
              res.insurabilityCheck = this.checkInsurability(pat, invoicedMonth);
              //  MUT
              res.mutCheck = this.checkMut(res.insurabilityCheck);
              //  CT12
              res.ct12Check = this.checkCT12(res.insurabilityCheck);
              //all contracts have startOfCoverage
              res.mhContractStart = this.checkMHContractStart(pat);
              //all contracts have end after start (or no end)
              res.mhContractEndBeforeStart = this.checkMHContractEndBeforeStart(pat);
              //MH Contract:
              res.mhContractCheck = this.checkMHContract(pat, invoicedMonth);
              //  MM NIHII
              res.mhCheck = this.checkMH(res.mhContractCheck);
              //  No Suspension
              res.mhSuspensionCheck = this.checkSuspension(res.mhContractCheck, invoicedMonth);
              //  Disciplines
              res.mhDisciplineCheck = this.checkMHDiscipline(res.mhContractCheck);
              // oveview
              res.flatrateStatus = this.checkMHStatus(res);
              //console.log("res", res, JSON.stringify(res));
          } else {
              // non flatrate
              res.flatrateStatus = {status: "ok-no-flatrate-mh", errors: []}
          }
          return res;
      })
  }

  //This method is faster since no reload of HCP is done
  checkFlatrateDataWithHcp(hcp, pat, invoicedMonth){
      //TODO: if multiple MHcontracts exist, check for overlap/validity of all
      //TODO: if multiple insurabilities extist, check for overlap/validity of all
      //Check if hcp or hcpParrent is flatrateInvoicing
      let res = {};
      res.hcp = hcp;
      res.pat = pat;
      res.invoicedMonth = invoicedMonth;
      //console.log("hcp flatrate ?", hcp);
      if(hcp.billingType && hcp.billingType.toLowerCase() === "flatrate") {
          //PatientData:
          //  NISS
          res.nissCheck = this.checkNissValid(pat);
          //  Gender
          res.genderCheck = this.checkGender(pat);
          //  GenderNissMatch
          res.genderNissCheck = this.checkGenderNiss(pat, res.genderCheck, res.nissCheck);
          //  DeathDate
          res.aliveCheck = this.checkAlive(pat, invoicedMonth);
          //Insurability:
          res.insurabilityCheck = this.checkInsurability(pat, invoicedMonth);
          //  MUT
          res.mutCheck = this.checkMut(res.insurabilityCheck);
          //  CT12
          res.ct12Check = this.checkCT12(res.insurabilityCheck);
          //all contracts have startOfCoverage
          res.mhContractStart = this.checkMHContractStart(pat);
          //all contracts have end after start (or no end)
          res.mhContractEndBeforeStart = this.checkMHContractEndBeforeStart(pat);
          //MH Contract:
          res.mhContractCheck = this.checkMHContract(pat, invoicedMonth);
          //  MM NIHII
          res.mhCheck = this.checkMH(res.mhContractCheck);
          //  No Suspension
          res.mhSuspensionCheck = this.checkSuspension(res.mhContractCheck, invoicedMonth);
          //  Disciplines
          res.mhDisciplineCheck = this.checkMHDiscipline(res.mhContractCheck);
          // oveview
          res.flatrateStatus = this.checkMHStatus(res);
          //console.log("res", res, JSON.stringify(res));
      } else {
          // non flatrate
          res.flatrateStatus = {status: "ok-no-flatrate-mh", errors: []}
      }
      return res;
  }

  checkMHStatus(res){
      return res.mhContractCheck.valid || !res.mhContractStart.valid || !res.mhContractEndBeforeStart.valid ? (
          res.insurabilityCheck && res.mutCheck.valid && res.ct12Check.valid && res.mhCheck.valid
          && res.mhContractStart.valid && res.mhContractEndBeforeStart.valid && res.mhSuspensionCheck.valid
          && res.mhDisciplineCheck.valid && res.nissCheck.valid &&
          res.genderCheck.valid && res.genderNissCheck.valid && res.aliveCheck.valid
              ? {status: "ok-flatrate-patient", errors: []} : {status: "nok-flatrate-patient", errors: this.mhStatusErrors(res)}
      ) : {status: "ok-no-flatrate-patient", errors: []};
  }

  mhStatusErrors(res){
      let err = [];
      if(!res.insurabilityCheck.valid) err.push(res.insurabilityCheck.error);
      if(res.insurabilityCheck.valid && !res.mutCheck.valid) err.push(res.mutCheck.error);
      if(res.insurabilityCheck.valid && !res.ct12Check.valid) err.push(res.ct12Check.error);
      if(!res.mhContractStart.valid) err.push(res.mhContractStart.error);
      if(!res.mhContractEndBeforeStart.valid) err.push(res.mhContractEndBeforeStart.error);
      if(!res.mhCheck.valid) err.push(res.mhCheck.error);
      if(res.mhCheck.valid && !res.mhSuspensionCheck.valid) err.push(res.mhSuspensionCheck.error);
      if(res.mhCheck.valid && !res.mhDisciplineCheck.valid) err.push(res.mhDisciplineCheck.error);
      if(!res.nissCheck.valid) err.push(res.nissCheck.error);
      if(!res.genderCheck.valid)  err.push(res.genderCheck.error);
      if(res.genderCheck.valid && res.nissCheck.valid && !res.genderNissCheck.valid) err.push(res.genderNissCheck.error);
      if(!res.aliveCheck.valid) err.push(res.aliveCheck.error);
      return err;
  }

  checkMHDiscipline(mhcCheck){
      return mhcCheck.valid ?
          ((mhcCheck.medicalHouseContract.kine || mhcCheck.medicalHouseContract.gp || mhcCheck.medicalHouseContract.nurse ) ?
                  {valid: true, discipline: (mhcCheck.medicalHouseContract.gp ? "1" : "0")+(mhcCheck.medicalHouseContract.kine ? "1" : "0")+(mhcCheck.medicalHouseContract.nurse ? "1" : "0"), error: ''}
                  : {valid: false, discipline: "000", error: 'no-discipline'}
          )
          : {valid: false, discipline:"", error: 'no-contract-for-period'}
  }

  checkSuspension(mhcCheck, invoicedMonth){
      const month = (invoicedMonth * 100) + 1;
      return mhcCheck.valid ?
          (mhcCheck.medicalHouseContract.startOfSuspension && mhcCheck.medicalHouseContract.startOfSuspension <= month
              && (!mhcCheck.medicalHouseContract.endOfSuspension || (mhcCheck.medicalHouseContract.endOfSuspension >= month)) ?
                  {valid: false, suspension: mhcCheck.medicalHouseContract, error: 'contract-suspended'}
                  : {valid: true, suspension:{}, error: ''}
          )
          : {valid: false, suspension:{}, error: 'no-contract-for-period'}
  }

  checkMH(mhcCheck){
      return mhcCheck.valid ?
          (mhcCheck.medicalHouseContract.hcpId && mhcCheck.medicalHouseContract.hcpId !== '' ?
                  {valid: true, hcpId: mhcCheck.medicalHouseContract.hcpId, error: ''}
                  : {valid: false, hcpId:'', error: 'mh-hcpId-absent-or-invalid'}
          )
          : {valid: false, hcpId:'', error: 'no-contract-for-period'}
  }

  checkMHContractStart(pat){
      if(pat.medicalHouseContracts && pat.medicalHouseContracts.length > 0){
          const mhcList = pat.medicalHouseContracts.filter(mhc => !mhc.startOfCoverage);
          if(mhcList && mhcList.length > 0){
              return {valid: false, error: 'contract-missing-start'};
          }else{
              return {valid: true, error: ''};
          }
      } else {
          return {valid: true, error: ''};
      }
  }

  checkMHContractEndBeforeStart(pat){
      if(pat.medicalHouseContracts && pat.medicalHouseContracts.length > 0){
          const mhcList = pat.medicalHouseContracts.filter(mhc => mhc.startOfCoverage && mhc.endOfCoverage && (mhc.endOfCoverage < mhc.startOfCoverage));
          if(mhcList && mhcList.length > 0){
              return {valid: false, error: 'contract-end-before-start'};
          }else{
              return {valid: true, error: ''};
          }
      } else {
          return {valid: true, error: ''};
      }
  }

  checkMHContract(pat, invoicedMonth){
      //invoicedmonth => yyyyMM => 201909 => (201909 * 100) + 1 = 20190901
      const month = (invoicedMonth * 100) + 1;
      if(pat.medicalHouseContracts && pat.medicalHouseContracts.length > 0){
          const mhcList = pat.medicalHouseContracts.filter(mhc =>
              mhc.startOfCoverage && mhc.startOfCoverage <= month && (!mhc.endOfCoverage || (mhc.endOfCoverage >=month)));
          if(mhcList && mhcList.length > 0){
              return {valid: true, medicalHouseContract: mhcList[0], error: ''};
          }else{
              return {valid: false, medicalHouseContract: null, error: 'no-contract-for-period'};
          }
      }
      else {
          return {valid: false, medicalHouseContract: null, error: 'no-contracts'};
      }
  }

  checkMut(insCheck){
      return insCheck.valid ?
          (insCheck.insurability.insuranceId && insCheck.insurability.insuranceId !== '' ?
                  {valid: true, insuranceId: insCheck.insurability.insuranceId, error: ''}
                  : {valid: false, insuranceId:'', error: 'insuranceId-absent-or-invalid'}
          )
          : {valid: false, ct12:'', error: 'no-ins-for-period'}
  }

  checkCT12(insCheck){
      return insCheck.valid ?
          (insCheck.insurability.parameters && insCheck.insurability.parameters.tc1
              && insCheck.insurability.parameters.tc1.length === 3  && insCheck.insurability.parameters.tc2 && insCheck.insurability.parameters.tc2.length === 3 ?
                  {valid: true, ct12:insCheck.insurability.parameters.tc1 + insCheck.insurability.parameters.tc2, error: ''}
                  : {valid: false, ct12:'', error: 'tc1-tc2-absent-or-invalid'}
          )
          : {valid: false, ct12:'', error: 'no-ins-for-period'}
  }

  checkInsurability(pat, invoicedMonth){
      //invoicedmonth => yyyyMM => 201909 => (201909 * 100) + 1 = 20190901
      const month = (invoicedMonth * 100) + 1;
      if(pat.insurabilities && pat.insurabilities.length > 0){
          const insList = pat.insurabilities.filter(ins =>
              ins.startDate && ins.startDate <= month && (!ins.endDate || (ins.endDate >=month)));
          if(insList && insList.length > 0){
              return {valid: true, insurability: insList[0], error: ''};
          }else{
              return {valid: false, insurability: null, error: 'no-ins-for-period'};
          }
      }
      else {
          return {valid: false, insurability: null, error: 'no-insurabilities'};
      }
  }

  checkAlive(pat, invoicedMonth){
      const month = (invoicedMonth * 100) + 1;
      return pat.dateOfDeath && (pat.dateOfDeath <= month) ? {valid: false, dateOfDeath : pat.dateOfDeath, error: 'patient-deceased'} : {valid: true, dateOfDeath : 0, error: ''};
  }

  checkGender(pat){
      return pat.gender && (pat.gender === 'male' || pat.gender === 'female') ? {valid:true, error: ''} : {valid: false, error: 'gender-invalid'}
  }

  checkNissValid(pat){
      return (pat.ssin && pat.ssin !== "") ? (pat.ssin.length === 11 ? {valid: true, error: ''} : {valid: false, error: 'niss-invalid'}) : {valid: false, error: 'niss-absent'};
  }

  checkGenderNiss(pat, genderCheck, nissCheck){
      if(genderCheck.valid && nissCheck.valid) {
          const genderDigit = pat.ssin.substr(8, 1);
          return (genderDigit % 2 === 0 && pat.gender === 'female') || (genderDigit % 2 !== 0 && pat.gender === 'male') ? {valid: true, error: ''} : {valid: false, error: 'gender-or-niss-not-match'}
      }else{
          return {valid: false, error: 'gender-or-niss-invalid'};
      }
  }

  _getGeninsHistory(){
      this.set("isLoading", true);
      let aMonths  = [];
      let i;
      for (i = 0; i < 24; i++) {
          aMonths.push(moment().startOf('month').subtract(i, 'month'));
      }
      this.set("insList", null);
      let insList = [];
      Promise.all(aMonths.map(m => this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => this.api.fhc().Geninscontroller().getGeneralInsurabilityUsingGET(
          this.cleanNiss(this.patient.ssin),
          this.api.tokenId ? this.api.tokenId : this.api.tokenIdMH, this.api.tokenId ? this.api.keystoreId : this.api.keystoreIdMH, this.api.tokenId ? this.api.credentials.ehpassword : this.api.credentials.ehpasswordMH,
          this.api.tokenId ? hcp.nihii : this.api.nihiiMH, this.api.isMH ? this.api.MHContactPersonSsin : hcp.ssin, this.api.isMH ? this.api.MHContactPersonName : hcp.lastName + ' ' + hcp.firstName, this.api.tokenId ? "doctor" : "medicalhouse", m.format('x'), null
          ))
      )).then(aRes => {
          aRes.map(res => {
              insList.push(res);
              //console.log(res);
          })
          this.set("insList",insList);
          console.log("insList", JSON.stringify(insList));
          this.set("isLoading", false);
      }).finally(this.set("isLoading", false))
  }

  cleanNiss(niss){
      return niss.replace(/ /g, "").replace(/-/g,"").replace(/\./g,"").replace(/_/g,"").replace(/\//g,"")
  }

  // _runTest(){
  //     let mhcs = this.patient.medicalHouseContracts
  //     mhcs.map(
  //         mhc =>{
  //             let tmp = mhc.suspensionSource;
  //         }
  //     )
  //     const amounts = this.getForfaitAmounts();
  //     const amount = this.getForfaitAmountOnDate(20161101);
  //     const amount1 = this.getForfaitAmountOnDate(20171101);
  //     const amount2 = this.getForfaitAmountOnDate(20181101);
  // }


  getForfaitAmountOnDate(date){
      const amounts = this.getForfaitAmounts();
      let amount = amounts.find(am => am.startDate <= date && (!am.endDate || am.endDate >= date ));

      return amount;
  }

  getForfaitAmounts(){
      const propRegStatus = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.Forfait.Amounts') ||
          (this.user.properties[this.user.properties.length] = {
              type: {identifier: 'org.taktik.icure.user.Forfait.Amounts'},
              typedValue: {type: 'JSON', stringValue: '{\"amounts\":[]}'}
          });
      let amounts = {};
      if(propRegStatus && propRegStatus.typedValue) {
          amounts = JSON.parse(propRegStatus.typedValue.stringValue);
      }
      return amounts.amounts ? amounts.amounts : null;
  }
}
customElements.define(HtPatFlatRateUtils.is, HtPatFlatRateUtils);
