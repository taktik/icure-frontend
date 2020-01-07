import '../filter-panel/filter-panel.js';
import '../dynamic-form/dynamically-loaded-form.js';
import './dialogs/ht-pat-invoicing-dialog.js';
import './dialogs/ht-pat-prescription-dialog.js';
import './ht-pat-detail-table.js';
import '../dynamic-form/ht-services-list.js';
import '../dynamic-form/dynamic-doc.js';
import '../dynamic-form/entity-selector.js';
import '../ht-spinner/ht-spinner.js';
import '../../styles/scrollbar-style.js';
import '../../styles/buttons-style.js';
import '../../styles/dialog-style.js';
import './dialogs/ht-pat-outgoing-document.js';
import '../../styles/shared-styles.js';
import '../dynamic-form/dynamic-subcontact-type-selector.js';
import '../dynamic-form/dynamic-confidentiality-selector.js';
import '../dynamic-form/dynamic-visibility-selector.js';
import '../ht-msg/ht-msg-new.js';

import _ from 'lodash/lodash';
import moment from 'moment/src/moment';
import '../prose-editor/prose-editor/prose-editor';
import * as evaljs from "evaljs";
import mustache from "mustache/mustache.js"
import * as models from 'icc-api/dist/icc-api/model/models';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="my-date-picker" theme-for="vaadin-date-picker">
	<template>
		<style>
			:host {
				width: 160px;
				max-width: 100%;
				padding-top: 16px;
				margin-bottom: 8px;
				/* Align nicely with vaadin-text-field */
				vertical-align: 3px;
				-webkit-tap-highlight-color: transparent;
			}

			[part="text-field"] {
				max-width: 100%;
				/* Text field margin is moved to the host */
				padding-top: 0;
				margin-bottom: 0;
			}

			[part="clear-button"],
			[part="toggle-button"] {
				width: 24px;
				height: 24px;
				box-sizing: border-box;
				margin-left: 4px;
				margin-bottom: 2px;
				color: var(--material-disabled-text-color);
				font-size: var(--material-icon-font-size);
				line-height: 24px;
				text-align: center;
				cursor: pointer;
			}

			[part="clear-button"]:hover,
			[part="toggle-button"]:hover {
				color: inherit;
			}

			[part="clear-button"] {
				border-radius: 50%;
				background-color: var(--material-divider-color);
				font-size: calc(var(--material-icon-font-size) - 8px);
			}
		</style>
	</template>
</dom-module><dom-module id="my-date-picker-styles" theme-for="vaadin-date-picker-overlay">
	<template>
		<style>
			:host {
				max-height: 400px;
				margin-top: 0px;
			}
		</style>
	</template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class HtPatDetailCtcDetailPanel extends TkLocalizerMixin(PolymerElement) {

    static get is() {
				return 'ht-pat-detail-ctc-detail-panel';
    }

    static get properties() {
				return {
            contacts: {
                // contacts is ht-pat-detail.selectedContacts
                type: Array,
                value: function () {
                    return [];
                },
                observer: '_servicesFilter'
            },
            allContacts: {
                // allContacts is ht-pat-detail.contacts
                type: Array,
                value: function () {
                    return [];
                }
            },
            comments: {
                type: Object,
                value: null
            },
            servicesMap: {
                type: Object,
                value: null
            },
            api: {
                type: Object
            },
            list: {
                type: Boolean,
                value: false
            },
            table: {
                type: Boolean,
                value: false
            },
            graphique: {
                type: Boolean,
                value: false
            },
            doc: {
                type: Boolean,
                value: true
            },
            user: {
                type: Object
            },
            patient: {
                type: Object
            },
            currentContact: {
                type: Object,
                value: null
            },
            contactTypeList: {
                type: Array,
                value: function () {
                    return [];
                }
            },
            contactsFormsAndDocuments: {
                type: Array,
                value: function () {
                    return [];
                }
            },
            healthElements: {
                type: Array,
                value: function () {
                    return [];
                }
            },
            outGoingDocumentTemplates: {
                type: Array,
                value: () => []
            },
            showDetailsFiltersPanel: {
                type: Boolean,
                value: false
            },
            detailPanelItems: {
                type: Array,
                value: function () {
                    return [{ icon: "icure-svg-icons:laboratory",filter:[{type:'CD-ITEM',code:['parameter']}], title: {en: "Lab Results", fr:"Résultats de laboratoire", nl:"Lab Results"}, id: "LabResults" },
                        { icon: "icure-svg-icons:prescription", filter:[{type:'CD-ITEM',code:['treatment']}],  title: {en: "Prescription", fr:"Prescription", nl:"Prescription"}, id: "Prescription" },
                        { icon: "icure-svg-icons:blood-sugar", filter:[{type:'CD-PARAMETER',code:['bloodsugar']}],  title: {en: "BloodSugar", fr:"Analyse de sang", nl:"BloodSugar"}, id: "BloodSugar" },
                        { icon: "icure-svg-icons:blood-pressure", filter:[{type:'CD-PARAMETER',code:['sbp','dbp']}],  title: {en: "BloodPressure", fr:"Pression sanguine", nl:"BloodPressure"}, id: "BloodPressure" },
                        { icon: "icure-svg-icons:blood-pressure", filter:[{type:'CD-PARAMETER',code:['weight','height','bmi']}],  title: {en: "Biometries", fr:"Biométries", nl:"Biometries"}, id: "Biometry" }];
                }
            },
            showAddFormsContainer: {
                type: Boolean,
                value: false
            },
            showAddEvaFormsContainer: {
                type: Boolean,
                value: false
            },
            showOutGoingDocContainer: {
                type: Boolean,
                value: false
            },
            showPrintFormsContainer: {
                type: Boolean,
                value: false
            },
            _drugsRefresher: {
                type: Number,
                value: 0
            },
            hiddenSubContactsId: {
                type: Object,
                value: {}
            },
            isLoadingDoc: {
                type: Boolean,
                value: false
            },
            globalHcp: {
                type: Object,
                value: null
            },
            documentMetas: {
                type: Object,
                value: null
            },
            selectedFormat: {
                type: String,
                value: 'presc'
            },
            subcontactType: {
                type: Array,
                value: ()=>[]
            },
            savedDocTemplateId: {
                type: String,
                value: ""
            },
            busySpinner: {
                type: Boolean,
                value: false
            },
            ehealthSession: {
                type: Boolean,
                value: false
            },
            fullProfile: {
                type: Boolean,
                value: false
            },
            proseEditorLinkingLetterTemplateAlreadyApplied: {
                type: Boolean,
                value: false
            },
            linkingLetterDataProvider :{
                type: Object
            },
            linkingLetterDpData :{
                type: Object,
                value: {}
            },
            confirmDateChange :{
                type: Object,
                value: {}
            },
            serviceFilters: {
                type: Array,
                value: () => ([])
            },
            filteredServiceIds: {
                type: Array,
                value: () => ([])
            },
            sizePrintSubForm :{
                type : Number,
                value : 0,
                observer: 'sizePrintSubFormChanged'
            },
            credentials:{
                type: Object,
                noReset: true
            },
            _bodyOverlay: {
                type: Boolean,
                value: false
            },
            linkingLetterDialog: {
                type: HTMLElement
            },
            servicesRefresher :{
                type : Number,
                value : 0
            },
            allHealthElements :{
                type : Object,
                value : {}
            },
            editLabelAndTransactionData :{
                type : Object,
                value : () => { return {
                    ctc: {
                        type: Object,
                        value: {}
                    },
                    docId: {
                        type: String,
                        value: ""
                    },
                    isServices: {
                        type: Boolean,
                        value: false
                    },
                    label: {
                        type: String,
                        value: ""
                    },
                    transactionCode:{
                        type: String,
                        value: ""
                    },
                }}
            },
            listType:{
                type: Array,
                value: ()=>[]
            },
            _deleteServicesData :{
                type : Object,
                value : () => { return {
                    ctc: {
                        type: Object,
                        value: {}
                    },
                    isFromServices: {
                        type: Boolean,
                        value: false
                    },
                    docId: {
                        type: String,
                        value: ""
                    },
                    documentSvc: {
                        type: Object,
                        value: {}
                    },
                    sourceSubContact: {
                        type: Object,
                        value: {}
                    },
                    sourceServiceIds:{
                        type: Array,
                        value: () => []
                    },
                }}
            },
				};
    }

    static get observers() {
				return [
				    'ifRecipeAvailable(user)',
				    '_servicesFilter(serviceFilters)',
				    '_allContactsChanged(allContacts.*, currentContact, currentContact._rev, servicesRefresher)',
            '_resetPatient(patient)',
            '_isConnectedToEhbox(api.tokenId)',
            '_apiReady(api)'
				];
    }

    constructor() {
				super();
    }

    ready() {
        super.ready();
        this._getOutGoingDocumentTemplates()
    }

    _apiReady() {
        return !!_.size(_.get(this,"listType",[])) ? null : this.api.getDocumentTypes(this.resources, this.language).then(documentTypes => this.set("listType", documentTypes))
    }

    _resetPatient() {
        this.proseEditorLinkingLetterTemplateAlreadyApplied = false;
        this.dispatchEvent(new CustomEvent("reset-patient", {composed: true, bubbles: true, detail: {}}))

        // this.$['prose-editor-dialog-linking-letter'].close()
    }

    _servicesFilter() {
        if(!this.contacts) {
            return;
        }

        if(!this.serviceFilters || !this.serviceFilters.length) {
            this.set('filteredServiceIds',[]);
            this._contactsChanged()
            return
        }

        const filterCodesByType = {}
        _.flatten(this.serviceFilters).forEach( filter => {
            const codesArray = filterCodesByType[filter.type] || []
            filterCodesByType[filter.type] = codesArray.concat(filter.code)
        })

        this.set('filteredServiceIds',_.flatten(this.contacts.map( contact =>
            (contact.services.filter( service =>
                service.tags.some( tag => filterCodesByType[tag.type] && filterCodesByType[tag.type].includes(tag.code) ) &&
                Object.values( this.api.contact().preferredContent(service, this.language) || {} ).some(value => value)
            ) || []).map(service =>
                service.id
            )
        )))

        this._contactsChanged()
    }

    ifRecipeAvailable(){
        this.user && this.user.healthcarePartyId && this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
            this.set("ehealthSession", this.api.tokenId ? true : false)
            if(hcp.addresses && hcp.addresses.length > 0){

                const addresses = hcp && hcp.addresses || null
                const workAddresses = addresses.find(adr => adr.addressType === "work") || null
                const telecoms = workAddresses && workAddresses.telecoms
                const workMobile = telecoms && telecoms.find(tel => tel.telecomType === "mobile" || tel.telecomType === "phone") || null
                const workEmail = telecoms && telecoms.find(tel => tel.telecomType === "email") || null

                this.set('fullProfile', workMobile && workMobile.telecomNumber !== "" && workEmail && workEmail.telecomNumber !== "" ? true : false)
            }
        })

    }

    _activeIconClass(selected) {
				return selected ? 'icn-selected' : ''
    }

    _setPrintSize() {
				localStorage.setItem('prefillFormat', this.selectedFormat)
    }

    _onDrag(e) {
				if (this._hasCurrentContact(this.contacts) && e && e.dataTransfer && e.dataTransfer.items && _.find(e.dataTransfer.items, i => i.kind === 'file')) {
            this.addDocument();
				}
    }

    _myProfile() { // open profile
        this.dispatchEvent(new CustomEvent("open-utility", {composed: true, bubbles: true, detail: {panel:'my-profile', tab:1}}))
    }

    _importKeychain() { // open keychain importation window
        this.$.prescriptionDialog.close()
        this.dispatchEvent(new CustomEvent("open-utility", {composed: true, bubbles: true, detail: {panel:'import-keychain'}}))
    }

    _toggleAddActions() {
				this.showAddFormsContainer = !this.showAddFormsContainer;
    }

    _toggleAddEvaActions() {
				this.showAddEvaFormsContainer = !this.showAddEvaFormsContainer;
    }

    _toggleOutGoingDocActions() {
				this.showOutGoingDocContainer = !this.showOutGoingDocContainer;
    }

    _togglePrintActions() {
				this.showPrintFormsContainer = !this.showPrintFormsContainer;
    }

    _refreshFromServices() {
				this.set('_drugsRefresher', this._drugsRefresher + 1)
    }

    _actionIcon(showAddFormsContainer) {
				return showAddFormsContainer ? 'icons:close' : 'icons:more-vert';
    }

    shouldSave() {
				const dynamicallyLoadedForm = this.shadowRoot.querySelector('#dynamicallyLoadedForm');
				return dynamicallyLoadedForm && dynamicallyLoadedForm.shouldSave();
    }

    flushSave() {
				const dynamicallyLoadedForm = this.shadowRoot.querySelector('#dynamicallyLoadedForm');
				return dynamicallyLoadedForm && dynamicallyLoadedForm.flushSave();
    }

    _dateFormat(date) {
        return date ? this.api.moment(date).format('DD/MM/YYYY') : '';
    }

    // _decryptComment(subContact, encryptedComment) {
    // 	const uaEncryptedComment = this.api.crypto().utils.text2ua(Base64.decode(encryptedComment));
    // 	this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("decrypt", this.user, subContact, uaEncryptedComment)
    // 		.then(uaDecryptedComment => {
    // 			const decryptedComment = this.api.crypto().utils.ua2text(uaDecryptedComment);
    // 			return decryptedComment;
    // 		})
    // 		.catch(e => {
    // 			console.log(e);
    // 		});
    // }

    // _promDecryptComment(folder) {
    // 	return new Promise(() => this._decryptComment(folder));
    // }

    // _decryptComments() {
    // 	this.currentContact.subContacts.forEach(item => {
    // 		this._decryptComment(item);
    // 	});
    // }

    _testEncrypt(docId) {
        try {
            let decrypted = "test";
            this.api.document().getDocument(docId)
                .then(doc => {
                    this._doc = doc;
                    return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, this._doc, this.api.crypto().utils.ua2ArrayBuffer(this.api.crypto().utils.text2ua(decrypted)))
                })
                .then(uaEncryptedComment => {
                    const encoded = Base64.encode(this.api.crypto().utils.ua2text(uaEncryptedComment));
                    const decoded = Base64.decode(encoded)
                    return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("decrypt", this.user, this._doc, this.api.crypto().utils.text2ua(decoded))
                })
                .then(uaDecryptedComment => {
                    const decryptedComment = this.api.crypto().utils.ua2text(uaDecryptedComment);
                    return decryptedComment;
                });

        } catch (error) {
            return Promise.reject(error);
        }
    }

    _documentId(svc) {
				const content = this.api.contact().preferredContent(svc, this.language)
				return content && content.documentId;
    }

    // _getComment(svc) {
    // 	const comment = this._comments[svc.id] || "";
    // 	console.log("getComment[" + svc.id + "]=" + comment);
    // 	return comment;
    // }

    _decryptComments(contact) {
				return Promise.all(contact.subContacts
            .filter(sc => sc.status === 64)
            .reduce((scSvcs, sc) => scSvcs.concat(sc.services), [])
            .map(scSvc => {
                const service = contact.services.find(svc => svc.id === scSvc.serviceId);
                const docId = service && this._documentId(service);
                if (!docId) Promise.resolve();
                return this.api.document().getDocument(docId)
                        .then(doc => {
                            const ua = this.api.crypto().utils.text2ua(Base64.decode(service.comment));
                            return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("decrypt", this.user, doc, ua);
                        })
                        .then(ua => {
                            service.clearComment = this.api.crypto().utils.ua2text(ua)
                            console.log("document id:" + docId + " -> comment:" + service.clearComment);
                        })
                        .catch(error => {
                            console.log(error);
                            Promise.resolve();
                        })
            }))
    }


    // _setComments(contact) {
    // 	try {
    // 		contact.subContacts.filter(sc => sc.status == 64).forEach(sc => {
    // 			let encryptedComment = sc.descr;
    // 			if (encryptedComment == null)
    // 				return;
    // 			const id = sc.services[0].serviceId;
    // 			const services = contact.services.filter(s => s.id == id);
    // 			const service = services[0];
    // 			const uaEncryptedComment = this.api.crypto().utils.text2ua(Base64.decode(encryptedComment));
    // 			const docId = this._documentId(service);
    // 			this.api.document().getDocument(docId)
    // 					.then(doc => {
    // 						return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("decrypt", this.user, doc, uaEncryptedComment);
    // 					})
    // 					.then(uaDecryptedComment => {
    // 						const decryptedComment = this.api.crypto().utils.ua2text(uaDecryptedComment);
    // 						this._comments[id] = decryptedComment;
    // 						this.set("comments", this._comments);
    // 						console.log("setComment[" + id + "]=" + decryptedComment);
    // 					});
    //
    // 		});
    // 	} catch (e) {
    // 		console.log("Error", e);
    // 	}
    // }

    _planAction() {
				this.dispatchEvent(new CustomEvent("plan-action", {composed: true, bubbles: true,detail: this.currentContact.services.filter(svc => svc.label==="Actes")[0]}))
    }

    _invoicing(){
				this.$.invoicingForm.open()
    }

    _ch4(){
				this.$.ch4Form.open()
    }

    addForm(templateGuid) {
				this.set('showAddFormsContainer', false);
				this.set('showAddEvaFormsContainer', false);
				this.api.hcparty().getCurrentHealthcareParty().then(hcp => this.api.form().getFormTemplatesByGuid(templateGuid, ((hcp.specialityCodes||[])[0] && hcp.specialityCodes[0].code || 'deptgeneralpractice').replace(/persphysician/, 'deptgeneralpractice'))).then(formTemplates => {
            console.log("FTs: " + formTemplates.size + " FTs loaded");
            const activeFormTemplates = formTemplates.filter(f => f.disabled !== "true")
            if (activeFormTemplates[0] && activeFormTemplates[0].id) {
                //Create a new form and link it to the currentContact
                this.api.form().newInstance(this.user, this.patient, { contactId: this.currentContact.id, formTemplateId: activeFormTemplates[0].id, descr: activeFormTemplates[0].name }).then(f => this.api.form().createForm(f)).then(f => {
                    this.currentContact.subContacts.push({ formId: f.id, services: [] });
                    return this.saveCurrentContact();
                }).then(c => this._contactsChanged());
            }
				}).catch(e => console.log("FTs: error " + e));
    }

    addConsultation() {
				this.set('showAddFormsContainer', false);
				this.set('showAddEvaFormsContainer', false);
				const prefForms = this.user.properties.find(p => p.type.identifier === 'org.taktik.icure.preferred.forms');
				if (prefForms && prefForms.typedValue) {
            const formsMap = JSON.parse(prefForms.typedValue.stringValue);
            this.addForm(formsMap['org.taktik.icure.form.standard.consultation']);
				} else {
            this.addForm("FFFFFFFF-FFFF-FFFF-FFFF-CONSULTATION");
				}
    }

    addChads(){
				this.set('showAddEvaFormsContainer', false);
				this.addForm("0e889da4-4bcf-4469-a4ea-6f8114181646");
    }

    openKatz(){
				this.set('showAddEvaFormsContainer', false);
				this.addForm("c68418b2-4dd5-466e-baad-04954304ac49");
    }

    openBackPain(){
        this.set('showAddEvaFormsContainer', false);
				this.addForm("ccc8dc13-869d-4ab6-858a-9e3d783563d6");
    }

    openPain(){
        this.set('showAddEvaFormsContainer', false);
        this.addForm("d908eeb8-1d25-4240-9671-bdb614ab5bab");
    }

    openGold(){
        this.set('showAddEvaFormsContainer', false);
        this.addForm("12e05917-33fe-430b-9023-b45685591561");
    }

    addPrescriptionForm() {
        this.set('showAddFormsContainer', false);
        // TODO: maybe check prefForms before
        this.addForm("FFFFFFFF-FFFF-FFFF-FFFF-PRESCRIPTION");
    }

    addFirstContact(){
        this.set('showAddFormsContainer', false);
				this.addForm("FFFFFFFF-FFFF-FFFF-FFFF-DOSSMED00000");
    }

    addMedicalHistory() {
				this.set('showAddFormsContainer', false);
				const prefForms = this.user.properties.find(p => p.type.identifier === 'org.taktik.icure.preferred.forms');
				if (prefForms && prefForms.typedValue) {
            const formsMap = JSON.parse(prefForms.typedValue.stringValue);
            this.addForm(formsMap['org.taktik.icure.form.standard.medicalhistory']);
				}
    }

    addOther() {
				this.set('showAddFormsContainer', false);
				// this.$['add-form-dialog'].open();
        this.dispatchEvent(new CustomEvent("add-other", {composed: true, bubbles: true}))
    }

    addDocument() {
				this.set('showAddFormsContainer', false);
        this.dispatchEvent(new CustomEvent('add-document', {detail: {currentContact: this.currentContact}, composed: true, bubbles: true}))
    }

    _validSsin(ssin) {
				return ssin && ssin.length > 9;
    }

    _hasDrugsToBePrescribed(ssin) {
				return this._drugsToBePrescribed().length > 0;
    }

    _hasDrugsAlreadyPrescribed(ssin) {
				return this._drugsAlreadyPrescribed().length > 0;
    }

    _canPrescribe(tokenId, ssin) {
				return tokenId && this._validSsin(ssin) && this._hasDrugsToBePrescribed();
    }

    _canReprint(tokenId, ssin) {
				return this._validSsin(ssin) && this._hasDrugsAlreadyPrescribed();
    }

    _drugsToBePrescribed() {

				let tbp = this.api && this.currentContact && this.currentContact.services && this.currentContact.services.filter(s => s.tags && s.tags.find(t => (t.type === 'CD-ITEM' && t.code ==='treatment') || (t.type === 'ICURE' && t.code ==='PRESC')) && !s.endOfLife && !s.tags.find(t => t.type === 'CD-LIFECYCLE' && ['ordered', 'completed', 'delivered'].includes(t.code)) && this.api.contact().medicationValue(s, this.language)) || [];
				return tbp.length > 0 ? tbp : this._drugsAlreadyPrescribed();
    }

    _drugsAlreadyPrescribed() {
				return this.api && this.currentContact && this.currentContact.services && this.currentContact.services.filter(s => s.tags && s.tags.find(t => (t.type === 'CD-ITEM' && t.code ==='treatment') || (t.type === 'ICURE' && t.code ==='PRESC')) && !s.endOfLife && s.tags.find(t => t.type === 'CD-LIFECYCLE' && ['ordered', 'completed', 'delivered'].includes(t.code)) && this.api.contact().medicationValue(s, this.language)) || [];
    }

    _prescribe(e) {
				e.stopPropagation();
				// this.$.prescriptionDialog.open();
        this.dispatchEvent(new CustomEvent("prescribe", {detail:{currentContact: this.currentContact, servicesMaps: this.servicesMap, globalHcp: this.globalHcp}, composed: true, bubbles: true}))
    }

    _handlePdfReport(e) {
        if(!e.detail) {
            if(e.detail.loading) {
                this.busySpinner = true;
            }else if(e.detail.success) {
                this.saveCurrentContact().then(() => { // event here
                    this._refreshFromServices()
                    this.busySpinner=false;
                })
            }
        }

    }

    hideAll() {
				this.set('list', false);
				this.set('table', false);
				this.set('doc', false);
				this.set('graphique', false);
    }

    _list(e) {
				this.hideAll();
				this.set('list', true);
    }

    _table(e) {
				this.hideAll();
				this.set('table', true);
    }

    _graphique(e) {
				this.hideAll();
				this.set('graphique', true);
    }

    _openChartsDialog(e) {
				this.dispatchEvent(new CustomEvent('open-charts-dialog', {bubbles: true}))
    }

    _default(e) {
				this.hideAll();
				this.set('doc', true);

				setTimeout(()=>this._setPdfSizes(),2000)
    }

    _setPdfSizes() {
        if (this.doc) this.root.querySelectorAll('.contact-card-container').forEach(card=>{ // get contact cards
            card.querySelectorAll('dynamic-doc').forEach(dynas=>{ // get dynamic-doc
                dynas.root.querySelectorAll('pdf-element').forEach(pdf=>pdf.dispatchEvent(new CustomEvent('iron-resize', {detail: {}}))) // force resize
            })
        })
    }

    _displayPrescriptionError() {
				this.$.prescriptionError.classList.add("notification");
				setTimeout(() => this.$.prescriptionError.classList.remove("notification"), 8000);
    }

    isAuth() {
				return (this.patient.ssin && this.api.tokenId)
    }

    saveCurrentContact() {
				return this.flushSave() || (this.currentContact.rev ? this.api.contact().modifyContactWithUser(this.user, this.currentContact) : this.api.contact().createContactWithUser(this.user, this.currentContact)).then(c=>this.api.register(c,'contact')).then(c => (this.currentContact.rev = c.rev) && c);
    }

    forceSaveCtc() {
        this.flushSave()
    }

    _reportTemplateSelected(e, reportTemplate) {
        this.savedDocTemplateId = reportTemplate.id;
        this.$.templateDescription.value = _.trim( _.get(reportTemplate,"descr", _.get(reportTemplate, "name", this.localize('rep',this.language) ) ) )

        this.api.doctemplate().getAttachmentText(reportTemplate.id, reportTemplate.attachmentId).then(attach => {
            const prose = this.root.querySelector("#prose-editor")
            prose.setJSONContent(this.api.crypto().utils.ua2utf8(attach))
            this._applyContext(prose, this.editedReportDataProvider)
        })
    }

    confirmSaved(event) {
        setTimeout(() => this.$.templateSavedIndicator.classList.remove("templateSaved"), 4000);
        this.$.templateSavedIndicator.classList.add("templateSaved");
    }

    _addedFormSelected(e, formTemplate) {
        formTemplate && this.addForm(e.detail.guid);
    }

    edit(e, form) {
				if (!this.currentContact.subContacts.find(sc => sc.formId === form.id)) {
            this.push('currentContact.subContacts',{ formId: form.id, services: [], healthElementId: form.healthElementId, planOfActionId: form.planOfActionId });
				}
    }

    _selectedContactsHeaderLabel(contacts, currentContactTags) {

        if(this.contacts.length > 1) {
            return this.contacts.length.toString() + " " + this.localize("selected_contacts", "contacts sélectionnés", this.language)
				} else {
            if(this.contacts.length === 1) {
                // return this._contactHeaderLabel(this.currentContact)
                return this._contactHeaderLabel(_.head(this.contacts))
            } else {
                return "no contact selected" // should not happen
            }
				}
    }

    _contactHeaderLabel(ctc) {
        if(ctc) {
            const cod = this._isCurrentContact(ctc) && (this.localize('contact_of_the_day', "contact du jour", this.language) + ": ") || ""
            return cod + this.contactTypeLabel(ctc) + " " + (ctc.descr || "") + " (" + this._dateFormat(ctc.openingDate) + ")"
				} else {
            return ""
				}
    }

    _contactHeaderDate(ctc) {
				return ctc ? "(" + this._dateFormat(ctc.openingDate) + ")" : "";
    }

    contactTypeLabel(ctc) {

        if(!ctc) return

				const tag = ctc.tags && ctc.tags.find(tag=> tag.type == "BE-CONTACT-TYPE")
				const code = tag && this.contactTypeList.find(sct => sct.code == tag.code)

				const isFile = ctc.subContacts && ctc.subContacts.some(sctc => !!(parseInt(_.get(sctc, "status", 0)) & (1 << 6)))
				const fileTransactionCode = !isFile ? "" : _.trim(_.get(_.find(_.flatMap(_.get(ctc,"services",[]),svc => _.get(svc,"tags",[])), {type:"CD-TRANSACTION"}),"code",""))
				const fileType = !_.trim(fileTransactionCode) ? "" : this.localize('cd-transaction-' + fileTransactionCode, fileTransactionCode, this.language) + ": "
				const fileDescription = !isFile || !!_.trim(_.get(ctc,"descr","")) ? "" : _.get(_.find(_.get(ctc, "services",[]), {id:_.get(ctc.subContacts.find(sctc => !!(parseInt(_.get(sctc, "status", 0)) & (1 << 6))), "services[0].serviceId")}),"content." + this.language + ".stringValue","")

				const isLabOrProtocol = !isFile && ctc.subContacts && ctc.subContacts.some(sctc => !!(parseInt(_.get(sctc, "status", 0)) & (1 << 0)) || !!(parseInt(_.get(sctc, "status", 0)) & (1 << 5)))
				const contactTransactionCode = _.trim(_.get(_.find(_.get(ctc, "tags",[]), {type:"CD-TRANSACTION"}), "code",""))
				const subContactTransactionCode = _.trim(_.get(_.find(_.flatMap(_.get(ctc,"subContacts",[]),sctc => _.get(sctc,"tags",[])), {type:"CD-TRANSACTION"}), "code",""))
				const labOrProtocolTransactionCode = !!_.trim(subContactTransactionCode) ? _.trim(subContactTransactionCode) : !!_.trim(contactTransactionCode) ? _.trim(contactTransactionCode) : ""
				const labOrProtocolType = (!isLabOrProtocol || !_.trim(labOrProtocolTransactionCode)) ? "" : this.localize('cd-transaction-' + labOrProtocolTransactionCode, labOrProtocolTransactionCode, this.language) + ": "

				return !!(code && code.label) ? code.label[this.language || "fr"] : "" + fileType + fileDescription + labOrProtocolType

    }

    _contactTypeChange(e){
        if(e.detail){
            const idx = this.currentContact.tags.indexOf(this.currentContact.tags.find(t => t.type === "BE-CONTACT-TYPE"))
            if(idx != -1){
                this.currentContact.tags.splice(idx, 1);
            }
            this.currentContact.tags.push(e.detail.type);
            this.notifyPath('currentContact.tags')
            this.saveCurrentContact()
                    .then(ctc => this.dispatchEvent(new CustomEvent('contact-saved', { detail: {contact :ctc} , bubbles:true })))
        }
    }

    formDeleted(e, form) {
				this.saveCurrentContact().then(c => this._contactsChanged());
    }

    _hasCurrentContact() {
        //console.log("_hasCurrentContact: ", this.contacts.find(c => !c.closingDate) && true);
				return this.contacts.find(c => !c.closingDate) && true;
    }

    _isCurrentContact(ctc) {
        return !ctc.closingDate && true;
    }

    _newService(event, detail) {
				if (detail && detail.svc) {
            if (this.servicesMap[detail.svc.label]) {
                this.push(`servicesMap.${detail.svc.label}`, detail);
            } else {
                this.set(`servicesMap.${detail.svc.label}`, [detail]);
            }
				}
    }

    _allContactsChanged() {
				this.set('servicesMap', (this.currentContact && !this.allContacts.find(c => c === this.currentContact) ? this.allContacts.concat(this.currentContact) : this.allContacts).reduce((map, ctc) => {
            const svcMap = ctc.subContacts.reduce((svcMap, subContact) => {
                subContact.services.reduce((svcMap, svcLink) => {
                    ;(svcMap[svcLink.serviceId] || (svcMap[svcLink.serviceId] = [])).push(subContact);
                    return svcMap;
                }, svcMap);
                return svcMap;
            }, {});

            ctc.services.reduce((map, svc) => {
                ;(map[svc.label] || (map[svc.label] = [])).push({ svc: svc, scs: svcMap[svc.id] || [], ctc: ctc });
                return map;
            }, map);

            Object.values(map).forEach(arr => arr.sort((a, b) => b.svc.modified - a.svc.modified));

            return map;
				}, {}));
    }

    _virtualForm(services) {
        return {id: null, template: {name: this.localize('service_mod_del','Modified or deleted service',this.language)}}
    }

    _contactsChanged() {
        this.set('contactsFormsAndDocuments', [])
        if (!this.contacts || (this.serviceFilters && this.serviceFilters.length && !(this.filteredServiceIds && this.filteredServiceIds.length))) {
            return
        }

        this.set('isLoadingDoc', true)

        const seenForms = {}
        const formGroups = this.contacts.reduce((contacts, contact) => {
            const subContacts = contact.subContacts.map(x=>x)

            const orphanedServices = contact.services.filter(s => !subContacts.some(sc => sc.services.some(lnk => (lnk.serviceId === s.id))))
            if (orphanedServices.length) {
                subContacts.push({services:orphanedServices.map(s=>({serviceId:s.id}))})
            }
            const forms = ((this.serviceFilters && this.serviceFilters.length ?
            subContacts.filter(sc => !(sc.formId && seenForms[sc.formId]) && sc.services.some( s => this.filteredServiceIds.find(fsId => fsId === s.serviceId))) :
            subContacts.filter(sc => !(sc.formId && seenForms[sc.formId]) )) || [])
            .map(sc => {
                const serviceIds = sc.services.map(s => s.serviceId)
                return {
                    id: sc.formId,
                    docs: contact.services.filter(s => serviceIds.includes(s.id) && ((this.api.contact().preferredContent(s,this.language)|| {}).documentId || []).length)
                }
            })

            const docIds = _.flatMap(forms, f => f.docs.map(d => d.id))

            const unmappedServices = this.serviceFilters && this.serviceFilters.length ?
            _.sortBy(contact.services.filter(svc => !docIds.includes(svc.id) && !subContacts.some(sc => sc.formId && sc.services.some(ssc => ssc.serviceId === svc.id)) && this.filteredServiceIds.some(fsId => fsId === svc.id) ), 'created'):
            _.sortBy(contact.services.filter(svc => !docIds.includes(svc.id) && !subContacts.some(sc => sc.formId && sc.services.some(ssc => ssc.serviceId === svc.id)) ), 'created')

            if((forms && forms.length) || (unmappedServices && unmappedServices.length)) {
                contacts.push({
                    ctc: contact,
                    forms: _.sortBy(forms, f => -f.created),
                    unmappedServices
                })
            }

            return contacts

        }, [])

				// // TODO (LDE) : Build comments here
				//
				// this._comments = {};
				//
				// let promises = [];
				// this.contacts.forEach(contact => {
				// 	promises.push(new Promise(() => this._setComments(contact)));
				// });
				//
				// //let prom = Promise.resolve();
				// //this.contacts.forEach(contact => {
				// //	prom.then(() => this._setComments(contact))
				// //});
				//
				const climbFormHierarchy = function (formIds, formsCache) {
            return (formIds.length ? this.api.form().getForms({ ids: formIds }) : Promise.resolve([])).then(forms => {
                forms.forEach(f => {
                    formsCache[f.id] = f;
                });
                const formIds = _.uniq(_.flatten(formGroups.map(fg => fg.forms.filter(f => f.id).map(f => {
                    const theForm = formsCache[f.id];
                    if (theForm.parent) {
                        f.id = theForm.parent;
                    } else {
                        f.form = formsCache[f.id];
                    }
                    return f;
                }).filter(f => !f.form).map(f => f.id))));

                return formIds.length ? climbFormHierarchy(formIds.filter(id => !formsCache[id]), formsCache) : formsCache;
            });
				}.bind(this);

				Promise.all(this.contacts.map(contact => this._decryptComments(contact)))
            .then(() => climbFormHierarchy(_.chain(formGroups).map(fg => fg.forms.filter(f => f.id).map(f => f.id)).flatten().uniq().value(), {}).then(() => {
                formGroups.forEach(fg => {
                    fg.forms = _.chain(fg.forms.reduce((acc, form) => {
                        let slot = acc.find(f => f.id === form.id);
                        if (slot) {
                            // _.concat(slot.docs, form.docs);
                            slot.docs = _.uniqBy(_.concat( slot.docs, form.docs), 'id')
                        } else {
                            acc.push(form);
                        }
                        return acc;
                    }, [])).sortBy(f=>-f.created).value()
                });
                this.set('contactsFormsAndDocuments', _.sortBy(formGroups, fg => -fg.ctc.openingDate));
            }))
            .finally(() => {
                console.log('contactsFormsAndDocuments',this.contactsFormsAndDocuments)
                if (!this.contactsFormsAndDocuments.some(c => c.forms && c.forms.some(f => f.form && f.form.formTemplateId))
                    && (!this.contactsFormsAndDocuments.some(f => f.ctc && f.ctc.services && f.ctc.services.some(s => _.values(s.content).some(c => c.documentId))))
                    && (this.contactsFormsAndDocuments.some(f => f.ctc && f.ctc.services && f.ctc.services.length) || this.contactsFormsAndDocuments.some(f => f.unmappedServices && f.unmappedServices.length))
                    && (!this.contactsFormsAndDocuments.some(f => f.ctc === this.currentContact)) && (this.contactsFormsAndDocuments.some(f => f.ctc && f.ctc.services && f.ctc.services.length) || this.contactsFormsAndDocuments.some(f => f.unmappedServices && f.unmappedServices.length))) {
                    this._list()
                } else {
                    this._default()
                }
                this.set('isLoadingDoc',false)
            });
    }

    toggleDetailsFiltersPanel() {
				this.showDetailsFiltersPanel = !this.showDetailsFiltersPanel;
				this.root.querySelector('#detailsFiltersPanel').classList.toggle('filters-panel--collapsed');
    }

    loadTemplate() {
        this.$['load-template-dialog'].open(); this.$['load-template-dialog'].filterValue = "  "; this.$['load-template-dialog'].refresh(); window.setTimeout(()=>{this.$['load-template-dialog'].filterValue = ""},1000);
    }

    reportTemplatesSelectorColumns() {
        return [{ key: 'name', title: this.localize('name',this.language) }, { key: 'descr', title: this.localize('des',this.language) }, { key: 'createdHr', title: this.localize('creation',this.language) }];
    }

    reportCustomTemplatesSelectorDataProvider() {
        return {
            filter: function (filterValue, limit, offset, sortKey, descending) {
                const regExp = _.trim(filterValue) && new RegExp(_.trim(filterValue), "i");

                const all = this.allTemplates || (this.allTemplates = Promise.all([
                    this.api.doctemplate().findDocumentTemplatesByDocumentType('template'),
                ]).then( res => _.chain(res[0]).uniqBy(x=>x.id).sortBy(['name','descr']).value()))

                return all
                    .then(fts => {
                        _.map( fts, (ft)=>{ ft.createdHr = moment(ft.created).format('DD/MM/YYYY - HH:mm:ss'); return ft })
                        const filtered = fts.filter(ft => ft.mainUti === "prose.template.json" && (!regExp || ft.name && ft.name.match(regExp) || ft.descr && ft.descr.match(regExp) || ft.id && ft.id.match(regExp)));
                        return { totalSize: filtered.length, rows: (descending ? _.reverse(_.sortBy(filtered, sortKey)) : _.sortBy(filtered, sortKey)).slice(0, limit) };
                    });
            }.bind(this)
        };
    }

    reportTemplatesSelectorDataProvider() {
        return {
            filter: function (filterValue, limit, offset, sortKey, descending) {
                const regExp = filterValue && new RegExp(filterValue, "i");

                const all = this.allTemplates || (this.allTemplates = Promise.all([
                    this.api.doctemplate().findDocumentTemplatesBySpeciality('deptgeneralpractice'),
                    this.api.doctemplate().findDocumentTemplates()
                ]).then( res => _.chain(res[0].concat(res[1])).uniqBy(x=>x.id).sortBy(['group','name']).value()))

                return all
                    .then(fts => {
                        const filtered = fts.filter(ft => !regExp || ft.name && ft.name.match(regExp) || ft.group && ft.group.name && ft.group.name.match(regExp) || ft.guid && ft.guid.match(regExp));
                        return { totalSize: filtered.length, rows: (descending ? _.reverse(_.sortBy(filtered, sortKey)) : _.sortBy(filtered, sortKey)).slice(0, limit) };
                    });
            }.bind(this)
        };
    }

    refreshIcons() {
        Polymer.dom(this.root).querySelector("#serviceFilterPanel").refreshIcons();
    }

    dropVarsFromProseJsonContent(proseJsonContent, variablesPath) {
        if(!_.size(variablesPath)) return proseJsonContent;
        _.map(variablesPath,(v)=>{_.set( proseJsonContent, v + ".content", [])})
        return proseJsonContent;
    }

    saveTemplate(e) {

        const prose = this.root.querySelector("#prose-editor");
        const proseJsonContent = prose.editorView.state.doc.toJSON();
        const variablesPath = this.api.findJsonObjectPathByPropNameAndPropValue( proseJsonContent, "type", "variable" );
        const proseJsonContentWithoutVars = this.dropVarsFromProseJsonContent(proseJsonContent, variablesPath);

        const reportData = {
            "title" : this.localize('rep',this.language) + " " + _.get( _.head( _.filter( _.get( this.contactsFormsAndDocuments, "[0].forms", [] ), { "id" : this.editedReportDataProvider.getId() } ) ), "form.descr", "" ),
            "description" : _.trim( this.$.templateDescription.value ),
            "formId" : this.editedReportDataProvider.getId(),
            "totalForms": _.size( _.get( this.contactsFormsAndDocuments, "[0].forms", [] ) ),
            "totalVars": _.size(variablesPath),
            "totalPages": _.size(proseJsonContent.content),
            "created": ""+ +new Date(),
        }
        reportData.description = _.get(reportData, "description", _.trim(reportData.title))

        if( !_.trim(this.savedDocTemplateId) || _.get(e, "target.dataset.version", "") === "new" ) {

            this.api.doctemplate().createDocumentTemplate({
                created: reportData.created,
                documentType: "template",
                mainUti:"prose.template.json",
                name: reportData.title,
                descr: reportData.description||reportData.title
            }).then(createDocTemplate => {
                this.api.doctemplate().setAttachment(createDocTemplate.id, JSON.stringify(proseJsonContentWithoutVars)).then(setAttachment => {
                    this.confirmSaved();
                    this.savedDocTemplateId = _.trim(createDocTemplate.id)
                })
            });

        }else {

            this.api.doctemplate().getDocumentTemplate(this.savedDocTemplateId).then(docTemplateLastDefinition => {
                this.api.doctemplate().updateDocumentTemplate(
                    _.trim(this.savedDocTemplateId),{
                        created: reportData.created,
                        documentType: "template",
                        mainUti:"prose.template.json",
                        name: reportData.title,
                        descr: reportData.description||reportData.title,
                        rev:docTemplateLastDefinition.rev
                }).then(updateDocTemplate => {
                    this.api.doctemplate().setAttachment(_.trim(this.savedDocTemplateId), JSON.stringify(proseJsonContentWithoutVars)).then(setAttachment => { this.confirmSaved(); })
                });
            });

        }

    }

    _refreshContext() {
        const prose = this.root.querySelector("#prose-editor")
        this._applyContext(prose, this.editedReportDataProvider)
    }

    _applyContext(prose, dataProvider) {
        //This fn creates the function that return the subContexts (like the context but corresponding to a subForm)
        const makeSubContexts = (ctx) => ((key) =>
                ctx.dataProvider.getSubForms(key).map(sf => {
                        const subCtx = _.assign({}, ctx, {dataProvider: sf.dataProvider})
                        subCtx.subContexts = makeSubContexts(subCtx)
                        return subCtx
                    }
                )
        )

				const ctx = {
            formatDate: (date) => this.api.moment(date).format('DD/MM/YYYY'),
            patient: this.patient,
            user: this.user,
            hcp: this.globalHcp,
            contact: this.currentContact,
            contacts: this.contacts,
            healthElements: this.healthElements,
            servicesMap: this.servicesMap,
            language: this.language,
            dataProvider: dataProvider
        }
        ctx.subContexts = makeSubContexts(ctx)

        prose.applyContext((expr, ctx) => {
            return new Promise(function (resolve, reject) {
                try {
                    const env = new evaljs.Environment(_.assign(ctx, {resolve, reject}));

                    const gen = (env.gen(expr)())
                    let status = {done: false}
                    while (!status.done) {
                        try {
                            status = gen.next() //Execute lines one by one
                        } catch (e) {
                            reject(e)
                            return
                        }
                    }

                    if (status.value && status.value.asynchronous) {
                        //Wait for internal resolution... it is the responsibility of the js to call resolve
                        // TODO: manage some timeout
                    } else {
                        resolve(status.value)
                    }
                } catch (e) {
                    reject(e)
                }
            })
        }, ctx)
    }

    _refreshContextLinkingLetter(e,eventDetails) {
        if(!_.size(this.linkingLetterDataProvider)) this._getLinkingLetterDataProvider();

        // Something is really wrong here...
        if(!this.linkingLetterDataProvider && !_.size(this.linkingLetterDataProvider)) return

        // const prose = this.root.querySelector("#prose-editor-linking-letter")
        const prose = this.get('linkingLetterDialog')
        this._applyContext(prose, this.linkingLetterDataProvider||{})
    }

    _openTemplateDescriptionDialog() {
        this.$['template-description-dialog'].open();
    }

    printSubForm(e) {
        const subFormDataProvider = _.get(e.detail, "dataProvider", false );
        const subFormid = subFormDataProvider && _.trim(subFormDataProvider.getId())
        this.api.form().getForm(subFormid).then(subFormObject=>{
            this.api.form().getFormTemplate(_.trim(subFormObject.formTemplateId)).then(subFormTemplateObject=>{

                // Todo: continue here and print other subforms. Assign default pdf render template ?
                // Todo: Make sure we have all subFormTemplateObject.guid / works for everyone

                // Hard coded, work incapacity
                if( ["FFFFFFFF-FFFF-FFFF-FFFF-INCAPACITY00"].indexOf(subFormTemplateObject.guid) >-1 ) this.printIncapacityForm(subFormDataProvider, subFormObject, subFormTemplateObject);
                // if( ["FFFFFFFF-FFFF-FFFF-FFFF-INCAPACITY00"].indexOf(subFormTemplateObject.guid) >-1 ) this.printIncapacityForm_v2(subFormDataProvider, subFormObject, subFormTemplateObject);

                // Hard coded, imaging
                if( ["0AAC53CF-793F-45D2-ACA9-E0B79E1A1376", "B4F2B274-10FF-4018-BC48-3ED3CADCED57"].indexOf(subFormTemplateObject.guid) >-1 ) this.printImagingPrescriptionForm_v2(subFormDataProvider, subFormObject, subFormTemplateObject);

                // Hard coded, Kine
                if( ["AEFED10A-9A72-4B40-981B-1D79ADB05516"].indexOf(subFormTemplateObject.guid) >-1 ) this.printKinePrescriptionForm(subFormDataProvider, subFormObject, subFormTemplateObject);

                // Hard coded, Nurse prescription
                if( ["64DAB551-B007-4B5C-BD64-F886301F5326"].indexOf(subFormTemplateObject.guid) >-1 ) this.printNursePrescriptionForm(subFormDataProvider, subFormObject, subFormTemplateObject);

                // Hard coded, echelle Katz
                if( ["c68418b2-4dd5-466e-baad-04954304ac49"].indexOf(subFormTemplateObject.guid) >-1 ) this.printEvalKatz(subFormDataProvider, subFormObject, subFormTemplateObject);
            })
        })
    }

    _getA5PdfHeader() {

        // <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">

        return `
            <html>
                <head>

                    <style>
                        @page{size:A5;margin:0;padding:0;}
                        html {margin:0;padding:0;box-sizing:border-box;}
                        body {margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif;box-sizing:border-box; }
                        .page {width:148mm;height:209mm; overflow:hidden; color:#000000; font-size:12px; padding: 4mm; margin:0; box-sizing: border-box; }

                        p {margin-top:0}
                        p.title {font-weight: bold;font-size: 18px;}
                        p.comment {height: 20mm;}

                        .alignCenter {text-align: center;}
                        .alignLeft {text-align: left;}
                        .alignRight {text-align: right;}

                        .bold { font-weight:700 }
                        .italic { font-style: italic }
                        .fs1em { font-size:1em; } .fs11em { font-size:1.1em; } .fs12em { font-size:1.2em; } .fs13em { font-size:1.3em; } .fs14em { font-size:1.4em; } .fs15em { font-size:1.5em; } .fs16em { font-size:1.6em; } .fs17em { font-size:1.7em; } .fs18em { font-size:1.8em; } .fs19em { font-size:1.9em; } .fs2em { font-size:2em; }

                        .mt0 {margin-top: 0px!important;} .mt1 {margin-top: 1px!important;} .mt2 {margin-top: 2px!important;} .mt3 {margin-top: 3px!important;} .mt4 {margin-top: 4px!important;} .mt5 {margin-top: 5px!important;} .mt10 {margin-top: 10px!important;} .mt15 {margin-top: 15px!important;} .mt20 {margin-top: 20px!important;}
                        .mr0 {margin-right: 0px!important;} .mr1 {margin-right: 1px!important;} .mr2 {margin-right: 2px!important;} .mr3 {margin-right: 3px!important;} .mr4 {margin-right: 4px!important;} .mr5 {margin-right: 5px!important;} .mr10 {margin-right: 10px!important;} .mr15 {margin-right: 15px!important;} .mr20 {margin-right: 20px!important;}
                        .mb0 {margin-bottom: 0px!important;} .mb1 {margin-bottom: 1px!important;} .mb2 {margin-bottom: 2px!important;} .mb3 {margin-bottom: 3px!important;} .mb4 {margin-bottom: 4px!important;} .mb5 {margin-bottom: 5px!important;} .mb10 {margin-bottom: 10px!important;} .mb15 {margin-bottom: 15px!important;} .mb20 {margin-bottom: 20px!important;}
                        .ml0 {margin-left: 0px!important;} .ml1 {margin-left: 1px!important;} .ml2 {margin-left: 2px!important;} .ml3 {margin-left: 3px!important;} .ml4 {margin-left: 4px!important;} .ml5 {margin-left: 5px!important;} .ml10 {margin-left: 10px!important;} .ml15 {margin-left: 15px!important;} .ml20 {margin-left: 20px!important;}

                        .pt0 {padding-top: 0px!important;} .pt1 {padding-top: 1px!important;} .pt2 {padding-top: 2px!important;} .pt3 {padding-top: 3px!important;} .pt4 {padding-top: 4px!important;} .pt5 {padding-top: 5px!important;} .pt10 {padding-top: 10px!important;} .pt15 {padding-top: 15px!important;} .pt20 {padding-top: 20px!important;}
                        .pr0 {padding-right: 0px!important;} .pr1 {padding-right: 1px!important;} .pr2 {padding-right: 2px!important;} .pr3 {padding-right: 3px!important;} .pr4 {padding-right: 4px!important;} .pr5 {padding-right: 5px!important;} .pr10 {padding-right: 10px!important;} .pr15 {padding-right: 15px!important;} .pr20 {padding-right: 20px!important;}
                        .pb0 {padding-bottom: 0px!important;} .pb1 {padding-bottom: 1px!important;} .pb2 {padding-bottom: 2px!important;} .pb3 {padding-bottom: 3px!important;} .pb4 {padding-bottom: 4px!important;} .pb5 {padding-bottom: 5px!important;} .pb10 {padding-bottom: 10px!important;} .pb15 {padding-bottom: 15px!important;} .pb20 {padding-bottom: 20px!important;}
                        .pl0 {padding-left: 0px!important;} .pl1 {padding-left: 1px!important;} .pl2 {padding-left: 2px!important;} .pl3 {padding-left: 3px!important;} .pl4 {padding-left: 4px!important;} .pl5 {padding-left: 5px!important;} .pl10 {padding-left: 10px!important;} .pl15 {padding-left: 15px!important;} .pl20 {padding-left: 20px!important;}

                        .doctorDetails { padding-left:15px; padding-right:15px; border:1px solid #000000;}

                    </style>
                    </head>
                    <body>
        `
    }

    _getDLPdfHeader() {
				//{width: 10cm;height: 21cm;
				// <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
				return `
            <html>
                <head>

                    <style>
                        @page { size: 100mm 210mm; margin: 0; padding: 0; }
                        html {margin:0;padding:0;box-sizing:border-box;}
                        body {margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif;box-sizing:border-box; max-width: 500px!important;}
                        .page {margin:5%;overflow:hidden; color:#000000; font-size:12px;  box-sizing: border-box;}
                        p {margin-top:0;}
                        p.title {font-weight: bold;font-size: 18px;}
                        p.comment {height: 20mm;}

                        .alignCenter {text-align: center;}
                        .alignLeft {text-align: left;}
                        .alignRight {text-align: right;}

                        .bold { font-weight:700 }
                        .italic { font-style: italic }
                        .fs1em { font-size:1em; } .fs11em { font-size:1.1em; } .fs12em { font-size:1.2em; } .fs13em { font-size:1.3em; } .fs14em { font-size:1.4em; } .fs15em { font-size:1.5em; } .fs16em { font-size:1.6em; } .fs17em { font-size:1.7em; } .fs18em { font-size:1.8em; } .fs19em { font-size:1.9em; } .fs2em { font-size:2em; }

                        .mt0 {margin-top: 0px!important;} .mt1 {margin-top: 1px!important;} .mt2 {margin-top: 2px!important;} .mt3 {margin-top: 3px!important;} .mt4 {margin-top: 4px!important;} .mt5 {margin-top: 5px!important;} .mt10 {margin-top: 10px!important;} .mt15 {margin-top: 15px!important;} .mt20 {margin-top: 20px!important;}
                        .mr0 {margin-right: 0px!important;} .mr1 {margin-right: 1px!important;} .mr2 {margin-right: 2px!important;} .mr3 {margin-right: 3px!important;} .mr4 {margin-right: 4px!important;} .mr5 {margin-right: 5px!important;} .mr10 {margin-right: 10px!important;} .mr15 {margin-right: 15px!important;} .mr20 {margin-right: 20px!important;}
                        .mb0 {margin-bottom: 0px!important;} .mb1 {margin-bottom: 1px!important;} .mb2 {margin-bottom: 2px!important;} .mb3 {margin-bottom: 3px!important;} .mb4 {margin-bottom: 4px!important;} .mb5 {margin-bottom: 5px!important;} .mb10 {margin-bottom: 10px!important;} .mb15 {margin-bottom: 15px!important;} .mb20 {margin-bottom: 20px!important;}
                        .ml0 {margin-left: 0px!important;} .ml1 {margin-left: 1px!important;} .ml2 {margin-left: 2px!important;} .ml3 {margin-left: 3px!important;} .ml4 {margin-left: 4px!important;} .ml5 {margin-left: 5px!important;} .ml10 {margin-left: 10px!important;} .ml15 {margin-left: 15px!important;} .ml20 {margin-left: 20px!important;}

                        .pt0 {padding-top: 0px!important;} .pt1 {padding-top: 1px!important;} .pt2 {padding-top: 2px!important;} .pt3 {padding-top: 3px!important;} .pt4 {padding-top: 4px!important;} .pt5 {padding-top: 5px!important;} .pt10 {padding-top: 10px!important;} .pt15 {padding-top: 15px!important;} .pt20 {padding-top: 20px!important;}
                        .pr0 {padding-right: 0px!important;} .pr1 {padding-right: 1px!important;} .pr2 {padding-right: 2px!important;} .pr3 {padding-right: 3px!important;} .pr4 {padding-right: 4px!important;} .pr5 {padding-right: 5px!important;} .pr10 {padding-right: 10px!important;} .pr15 {padding-right: 15px!important;} .pr20 {padding-right: 20px!important;}
                        .pb0 {padding-bottom: 0px!important;} .pb1 {padding-bottom: 1px!important;} .pb2 {padding-bottom: 2px!important;} .pb3 {padding-bottom: 3px!important;} .pb4 {padding-bottom: 4px!important;} .pb5 {padding-bottom: 5px!important;} .pb10 {padding-bottom: 10px!important;} .pb15 {padding-bottom: 15px!important;} .pb20 {padding-bottom: 20px!important;}
                        .pl0 {padding-left: 0px!important;} .pl1 {padding-left: 1px!important;} .pl2 {padding-left: 2px!important;} .pl3 {padding-left: 3px!important;} .pl4 {padding-left: 4px!important;} .pl5 {padding-left: 5px!important;} .pl10 {padding-left: 10px!important;} .pl15 {padding-left: 15px!important;} .pl20 {padding-left: 20px!important;}

                        .doctorDetails { padding-left:15px; padding-right:15px; border:1px solid #000000;}

                    </style>
                    </head>
                    <body>
        `
    }

    _saveReport() {

        this.busySpinner = true;

        let resourcesObject = {}
        const prose = this.root.querySelector("#prose-editor");
        const proseJsonContent = prose.editorView.state.doc.toJSON();
        const proseHtmlContent = prose.$.container.innerHTML;
        const variablesPath = this.api.findJsonObjectPathByPropNameAndPropValue( proseJsonContent, "type", "variable" );
        const reportData = {
            "title" : this.localize('rep',this.language) + " " + _.get( _.head( _.filter( _.get( this.contactsFormsAndDocuments, "[0].forms", [] ), { "id" : this.editedReportDataProvider.getId() } ) ), "form.descr", "" ),
            "description" : _.trim( this.$.templateDescription.value ),
            "formId" : this.editedReportDataProvider.getId(),
            "totalForms": _.size( _.get( this.contactsFormsAndDocuments, "[0].forms", [] ) ),
            "totalVars": _.size(variablesPath),
            "totalPages": _.size(proseJsonContent.content),
            "created": ""+ +new Date(),
        }
        reportData.description = _.get(reportData, "description", _.trim(reportData.title))

        this.api.message().newInstanceWithPatient(this.user, this.patient)
            .then(newMessageInstance=>_.assign({newMessageInstance: newMessageInstance}, resourcesObject))
            .then(resourcesObject=>this.api.message().createMessage(
                    _.merge(
                        resourcesObject.newMessageInstance,
                        {
                            transportGuid: "DOC:REPORT:ARCHIVE",
                            recipients: [_.get(this.user, 'healthcarePartyId', _.trim(this.user.id))],
                            metas: reportData,
                            toAddresses: [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', _.trim(this.user.id)))],
                            subject: reportData.title + " " + reportData.description
                        }
                    )
                ).then(createMessageResponse=>_.assign({createMessageResponse: createMessageResponse}, resourcesObject)))
            .then(resourcesObject=>this.api.document().newInstance(
                    this.user,resourcesObject.createMessageResponse,
                    {
                        documentType: 'report',
                        mainUti: this.api.document().uti("application/pdf"),
                        name: reportData.title + " " + reportData.description + ".pdf"
                    }
                ).then(newDocumentInstance=>_.assign({newDocumentInstance:newDocumentInstance},resourcesObject))
            )
            .then(resourcesObject=>this.api.document().createDocument(resourcesObject.newDocumentInstance).then(createDocumentResponse=>_.assign({createDocumentResponse:createDocumentResponse},resourcesObject)))
            .then(resourcesObject=>this.api.pdfReport(this._getProsePdfHeader() + this.api.rewriteTableColumnsWidth(proseHtmlContent) + this._getPdfFooter()).then(pdfFileContent=>_.assign({pdfFileContent:pdfFileContent},resourcesObject)))
            .then(resourcesObject=>this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, resourcesObject.createDocumentResponse, resourcesObject.pdfFileContent).then(encryptedFileContent=>_.assign({encryptedFileContent:encryptedFileContent},resourcesObject)))
            .then(resourcesObject=>this.api.document().setAttachment(resourcesObject.createDocumentResponse.id, null, resourcesObject.encryptedFileContent).then(setAttachmentResponse=>_.assign({setAttachmentResponse:setAttachmentResponse},resourcesObject)))
            .then(resourcesObject=>this._saveDocumentAsService({
                documentId: _.trim(_.get(resourcesObject, "createDocumentResponse.id", "")),
                stringValue: _.trim(reportData.title) + " " + _.trim(reportData.description),
                formId: reportData.formId,
                contactId: _.trim(this.currentContact.id)
            }))
            .catch((e)=>{console.log(e)})
            .finally(()=>{ this.busySpinner = false; this._closeReportMenu(); this.confirmSaved(); })

    }

    _handleSaveDocumentAsService(e) {
        if(e.detail) {
            this._saveDocumentAsService(e.detail)
        }
    }

    _saveDocumentAsService(inputConfig) {

        const svc = this.api.contact().service().newInstance(
            this.user,
            {
                content: _.fromPairs([[this.language, { documentId: inputConfig.documentId, stringValue: inputConfig.stringValue }]]),
                label: 'document',
                formId: inputConfig.formId,
                contactId: inputConfig.contactId
            }
        )

        let newServiceData = {
            ctc: this.currentContact,
            svc: svc,
            scs: this.currentContact.subContacts.filter(sc => sc.formId === inputConfig.formId)
        }

        if( Array.isArray(_.get(newServiceData, "scs.services", false)) ) {
            newServiceData.scs.services.push({ serviceId: svc.id });
        } else {
            newServiceData.scs["services"] = [{ serviceId: svc.id }];
        }

        this._newService({},newServiceData)

        this.currentContact.services.push(svc);

        this.saveCurrentContact().then(() => this._contactsChanged());

    }

    _getProsePdfHeader( additionalCssStyles = "" ) {

                return `<html>
                            <head>
                                <style>

                                    body {margin: 0;}
                                    @page {size: A4; margin: 0; }

                                    :host {
                                        background:#ffffff;
                                        height: 100%;
                                        width: 100%;
                                        font-family: 'Roboto', sans-serif;
                                        font-size: 11px;
                                        min-height: 100vw;

                                    }

                                    .container {
                                        left: 50%;
                                        transform: translateX(-50%);
                                        position: absolute;
                                    }

                                    .page {
                                        padding: 40px;
                                        outline: 0;
                                        background: #ffffff;
                                        font-family: 'Roboto', sans-serif;
                                        font-size: 14px;
                                        line-height: 2em;
                                        width: 210mm;
                                        height: calc(297mm - 40px);
                                        overflow:hidden;
                                    }

                                    h1 { font-size: 1.8em; font-weight: bold; }
                                    h2 { font-size: 1.5em; font-weight: bold; }
                                    h3 { font-size: 1.3em; font-weight: bold; }
                                    h4 { font-size: 1em; font-weight: bold; text-decoration: underline; }
                                    h5 { font-size: 1em; text-decoration: underline; }

                                    .ProseMirror {
                                        outline: 0;
                                        position: relative;
                                        word-wrap: break-word;
                                        white-space: pre-wrap;
                                        -webkit-font-variant-ligatures: none;
                                        font-variant-ligatures: none;
                                    }

                                    .ProseMirror pre { white-space: pre-wrap; }
                                    .ProseMirror li { position: relative; }
                                    .ProseMirror .tableWrapper { overflow-x: auto; }

                                    .ProseMirror table {
                                        border-collapse: collapse;
                                        table-layout: fixed;
                                        width: 100%;
                                        overflow: hidden;
                                        margin: 0;
                                        font-size: 11px;
                                    }

                                    .ProseMirror td, .ProseMirror th {
                                        vertical-align: top;
                                        box-sizing: border-box;
                                        position: relative;
                                        font-size: 11px;
                                    }

                                    /* Give selected cells a blue overlay */
                                    .ProseMirror .selectedCell:after {
                                        z-index: 2;
                                        position: absolute;
                                        content: "";
                                        left: 0; right: 0; top: 0; bottom: 0;
                                        background: rgba(200, 200, 255, 0.4);
                                        pointer-events: none;
                                    }

                                    .ProseMirror th, .ProseMirror td {
                                        min-width: 1em;
                                        border: 1px solid #ddd;
                                        padding: 3px 5px;
                                        font-size: 11px;
                                    }

                                    .ProseMirror-hideselection *::selection { background: transparent; }
                                    .ProseMirror-hideselection *::-moz-selection { background: transparent; }
                                    .ProseMirror-hideselection { caret-color: transparent; }
                                    .ProseMirror-selectednode { outline: 2px solid #8cf; }
                                    li.ProseMirror-selectednode { outline: none; }

                                    li.ProseMirror-selectednode:after {
                                        content: "";
                                        position: absolute;
                                        left: -32px;
                                        right: -2px;
                                        top: -2px;
                                        bottom: -2px;
                                        border: 2px solid #8cf;
                                        pointer-events: none;
                                    }

                                    .divider{
                                        display: block;
                                        border-left: 1px solid #e0e0e0;
                                        height: 100%;
                                        margin: 0 4px;
                                        padding: 0;
                                    }

                                    .ProseMirror table { margin: 0; }
                                    .ProseMirror th, .ProseMirror td {
                                        min-width: 1em;
                                        border: 1px solid #ddd;
                                        padding: 15px 10px;
                                    }
                                    .ProseMirror .tableWrapper { margin: 1em 0; }

                                    ` + _.trim(additionalCssStyles) + `

                                </style>
                                </head>
                                <body>`
            }

    _getPdfFooter() {
        return "</body></html>";
    }

    _closeReportMenu() {
        try{this.shadowRoot.querySelector('#dynamicallyLoadedForm').shadowRoot.querySelector('#dynamic-form').reportsListDisplayed=false}catch(e){}
    }

    printDocument() {
        this.busySpinner = true;
        const prose = this.root.querySelector("#prose-editor");
        const proseHtmlContent = prose.$.container.innerHTML;
        this.api.pdfReport(this._getProsePdfHeader() + this.api.rewriteTableColumnsWidth(proseHtmlContent) + this._getPdfFooter() ).then(({pdf:pdfFileContent, printed:printed}) =>
            !printed && this.api.triggerFileDownload( pdfFileContent, "application/pdf", this.localize('rep',this.language) + '-' + this.user.healthcarePartyId + "-" + +new Date()+".pdf")
        ).finally(() =>{
            this.busySpinner = false
            this.$['prose-editor-dialog'].close()
            this._closeReportMenu();
        });
    }

    printIncapacityForm(subFormDataProvider,subFormObject,subFormTemplateObject) {
        this.busySpinner = true;

        const patientName = _.compact([
            (_.trim(_.get(this.patient, "gender", "")) ? _.trim( this.localize("abrv_" + _.trim(_.get(this.patient, "gender", ""),this.language) ) ) ? _.trim( this.localize("abrv_" + _.trim(_.get(this.patient, "gender", ""),this.language) ) ) : "" : "" ),
            _.get(this.patient, "lastName", ""),
            _.get(this.patient, "firstName", "")
        ]).join(" ");

        const downloadFileName = _.kebabCase(_.compact([this.localize("certificate_stop_activity",this.language),patientName,+new Date()]).join(" ")) + ".pdf"
        const hcpAddress = _.chain(this.globalHcp.addresses).filter({"addressType":"work"}).head().value()

        const subFormServiceNameAndValues = _.compact(
            _.map(
                (subFormDataProvider && subFormDataProvider.servicesMap ? subFormDataProvider.servicesMap : []), (v,k)=>{
                    return _.size(v) && {
                        name: k,
                        value: subFormDataProvider.getValue(k),
                        valueObject: _.get(v, "[0][0].svc.content." + this.language, "") ? _.get(v, "[0][0].svc.content." + this.language, "") : _.get(v, "[0][0].svc.content." + "fr", "")
                    }
                }
            )
        )||[]

        const incapacityStart = _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, { name:"du" })), "valueObject.fuzzyDateValue", ""))+""
        const incapacityEnd = _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, { name:"au" })), "valueObject.fuzzyDateValue", ""))+""
        let incapacityDuration = incapacityStart && incapacityEnd ? this.api.moment(incapacityEnd).diff(this.api.moment(incapacityStart), "days") : "-"
        const incapacityPartiallyFinished = _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, { name:"reprise d'activité partielle" })), "valueObject.fuzzyDateValue", ""))+""
        const incapacityCompletelyFinished = _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, { name:"totale" })), "valueObject.fuzzyDateValue", ""))+""
        const includedExcludedLabel = _.get(_.head(_.filter(subFormServiceNameAndValues, { name:"inclus/exclus" })), "value", this.localize("included",this.language)) !== "null" ? _.get(_.head(_.filter(subFormServiceNameAndValues, { name:"inclus/exclus" })), "value", this.localize("included",this.language)) : this.localize("included",this.language)
        const doctorComment = _.trim( _.get(_.head(_.filter(subFormServiceNameAndValues, { name:"Commentaire" })), "value", "") )
        const precentageValue = _.get(_.head(_.filter(subFormServiceNameAndValues, { name:"pourcentage" })), "valueObject.measureValue.value", "100");
        const precentageUnit = _.trim( _.get(_.head(_.filter(subFormServiceNameAndValues, { name:"pourcentage" })), "valueObject.measureValue.unit", "%")) ? _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, { name:"pourcentage" })), "valueObject.measureValue.unit", "%")) : "%";
        const precentageValueAndUnit = precentageValue + " " + precentageUnit
				const prolong =  _.get(_.head(_.filter(subFormServiceNameAndValues, { name:"extension" })), "valueObject.booleanValue", false)

        this.documentMetas = {
            title : _.trim(this.localize("certificate_stop_activity",this.language)),
            formId : _.trim(_.get(subFormObject, "id", "")),
            created: ""+ +new Date(),
            patientId : _.trim(_.get(this.patient, "id", "")),
            patientName : _.trim(patientName),
        }


        this.api.code().findCodes("be", "CD-INCAPACITY").then(incapacityCodes=>{return{incapacityCodes: incapacityCodes}})
            .then(resourcesObject => this.api.code().findCodes("be", "CD-INCAPACITYREASON").then(incapacityReasons=>_.assign({incapacityReasons:incapacityReasons},resourcesObject)))
            .then(resourcesObject => {

                let incapacityValue = _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, { name:"incapacité de" })), "value", "")).toLowerCase()==="ok"?"":_.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, { name:"incapacité de" })), "value", ""));
                let incapacityReason = _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, { name:"pour cause de" })), "value", "")).toLowerCase()==="ok"?"":_.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, { name:"pour cause de" })), "value", ""));

                if(_.trim(incapacityValue)) incapacityValue = _.trim(_.get(_.head(_.filter(resourcesObject.incapacityCodes, {id:incapacityValue})), "label." + this.language, incapacityValue)) || _.trim(_.get(_.head(_.filter(resourcesObject.incapacityCodes, {id:incapacityValue})), "label.fr", incapacityValue))
                if(_.trim(incapacityReason)) incapacityReason = _.trim(_.get(_.head(_.filter(resourcesObject.incapacityReasons, {id:incapacityReason})), "label." + this.language, incapacityReason)) || _.trim(_.get(_.head(_.filter(resourcesObject.incapacityReasons, {id:incapacityReason})), "label.fr", incapacityReason )) || _.trim(_.get(_.head(_.filter(subFormServiceNameAndValues, { name:"autres" })), "value", incapacityReason))

                if(includedExcludedLabel.toLowerCase() === "inclus" || includedExcludedLabel.toLowerCase() === "included" || includedExcludedLabel.toLowerCase() === "inbegrepen" ) incapacityDuration = parseInt(incapacityDuration) ? incapacityDuration+1 : 1;

                const pdfContent = `
                <div class="page">
                    <p class="title">${this.localize("certificate_stop_activity",this.language)}</p>
                    <p>` + this.localize("date",this.language) + `: ` + moment().format('DD/MM/YYYY') + `</p>
                    <p class="italic notSolong">` + this.localize("csa_txt001",this.language) + `:</p>
                    <p class="bold fs15em mt15 mb20">` + patientName + `</p>
                    <p><span class="italic">` + this.localize("csa_txt002",this.language) + `:</span><br />` + incapacityValue + `</p>
                    <p><span class="italic">` + this.localize("csa_txt003",this.language) + `:</span><br />` + incapacityReason + (!prolong ? "" : this.localize("csa_txt011",this.language)) +`</p>
                    <p>
                        <span class="italic">` + this.localize("csa_txt004",this.language) + `:</span> ` + incapacityDuration + ` ` + this.localize("days",this.language) + `<br />
                        ` +
                    this.localize("from2",this.language) + ` ` +
                    ( incapacityStart ? this.api.moment(incapacityStart).format("DD/MM/YYYY") : "-" ) + ` ` +
                    this.localize("till",this.language) + ` ` +
                    ( incapacityEnd ? this.api.moment(incapacityEnd).format("DD/MM/YYYY") : "-" ) + ` ` +
                    includedExcludedLabel + `
                    </p>
                    <p><span class="italic">` + this.localize("csa_txt005",this.language) + `:</span> ` + _.get(_.head(_.filter(subFormServiceNameAndValues, { name:"Sortie" })), "value", "-") + `</p>
                    <p>` +
                    `<span class="italic">` + this.localize("csa_txt006",this.language) + `:</span> ` +
                    ( incapacityPartiallyFinished ? this.api.moment(incapacityPartiallyFinished).format("DD/MM/YYYY") : "-" ) + ` ` +
                    this.localize("csa_txt007",this.language) + ` ` + precentageValueAndUnit + `
                            ` + ( incapacityCompletelyFinished ? "<br /><span class='italic'>" + this.localize("csa_txt010",this.language) + ":</span> " + this.api.moment(incapacityCompletelyFinished).format("DD/MM/YYYY") : "" ) + `
                    </p>` +
                    ( doctorComment ? `<p class="comment"><span class="italic">${doctorComment}</span></p>`  : "" ) +
                    `<p class="mb5">${this.localize("csa_txt008",this.language)}</p>
                    <div class="doctorDetails ml5 mr5">
                        <p class="mb3 mt5">` + this.localize("csa_txt009",this.language) + ` ` + _.trim( _.get(this.globalHcp, "lastName", "") ).toUpperCase() + ` ` + _.trim( _.get(this.globalHcp, "firstName", "") ) + `</p>
                        <p class="mb3">`+ _.trim( _.get(hcpAddress, "street", "") ) +`` + (_.trim( _.get(hcpAddress, "houseNumber", "") ) ? ", " + _.trim( _.get(hcpAddress, "houseNumber", "") ) : "" ) + `` + (_.trim( _.get(hcpAddress, "postboxNumber", "") ) ? "/" + _.trim( _.get(hcpAddress, "postboxNumber", "") ) : "" ) + `</p>
                        <p class="mb3">`+ _.trim( _.get(hcpAddress, "postalCode", "") ) +` `+ _.trim( _.get(hcpAddress, "city", "") ) +`</p>
                        <p class="mb5">`+ this.localize("inami",this.language) + `: ` + this.api.formatInamiNumber(_.trim(_.get(this.globalHcp, "nihii", ""))) +`</p>
                    </div>
                </div>
            ` +
                    '<'+'script'+'>'+'document.fonts.ready.then(() => { setInterval(() => {document.body.dispatchEvent(new CustomEvent("pdfDoneRenderingEvent"))}, 500); }); <'+'/script'+'>'

                return _.assign({pdfContent:pdfContent},resourcesObject)

            })
            .then(resourcesObject => this.api.isElectronAvailable().then(isElectron => _.assign({isElectron:isElectron}, resourcesObject)))
            .then(resourcesObject => resourcesObject.isElectron ? fetch('http://localhost:16042/getPrinterSetting', {method: "POST",headers: {"Content-Type": "application/json; charset=utf-8"},body: JSON.stringify({userId: this.user.id})}).then(response => response && response.status===200 ? response.json() : Promise.resolve({})).then( data => _.assign({printFormat : data && data.data && JSON.parse(data.data) && JSON.parse(data.data).find(x => x.type==="recipe") ?JSON.parse(data.data).find(x => x.type==="recipe").format : "A4"}, resourcesObject) ) : resourcesObject)
            .then(resourcesObject => this.api.pdfReport((resourcesObject.isElectron && resourcesObject.printFormat!=="A4" ? this._getDLPdfHeader() : this._getA5PdfHeader())+ _.trim(resourcesObject.pdfContent) + this._getPdfFooter(), {type:"recipe",completionEvent:"pdfDoneRenderingEvent", option:'a5',paperWidth:148,paperHeight:210,marginLeft: 0,marginRight: 0,marginTop: 0,marginBottom: 0}).then(({pdf:pdfFileContent, printed:printed}) => _.assign({pdfFileContent:pdfFileContent, printed: printed}, resourcesObject)))
            .then(resourcesObject => this.api.message().newInstanceWithPatient(this.user, this.patient)
                .then(newMessageInstance=>_.assign({newMessageInstance: newMessageInstance}, resourcesObject))
                .then(resourcesObject=>this.api.message().createMessage(
                        _.merge(
                            resourcesObject.newMessageInstance,
                            {
                                transportGuid: "PRESCRIPTION:ITT:ARCHIVE",
                                recipients: [_.get(this.user, 'healthcarePartyId', _.trim(this.user.id))],
                                metas: this.documentMetas,
                                toAddresses: [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', _.trim(this.user.id)))],
                                subject: this.documentMetas.title
                            }
                        )
                    ).then(createMessageResponse=>_.assign({createMessageResponse: createMessageResponse}, resourcesObject))
                )
            )
            .then(resourcesObject=>this.api.document().newInstance(
                    this.user,resourcesObject.createMessageResponse,
                    {
                        documentType: 'report',
                        mainUti: this.api.document().uti("application/pdf"),
                        name: this.documentMetas.title + " - " + this.documentMetas.patientName + ".pdf"
                    }
                ).then(newDocumentInstance=>_.assign({newDocumentInstance:newDocumentInstance},resourcesObject))
            )
            .then(resourcesObject=>this.api.document().createDocument(resourcesObject.newDocumentInstance).then(createDocumentResponse=>_.assign({createDocumentResponse:createDocumentResponse},resourcesObject)))
            .then(resourcesObject=>this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, resourcesObject.createDocumentResponse, resourcesObject.pdfFileContent).then(encryptedFileContent=>_.assign({encryptedFileContent:encryptedFileContent},resourcesObject)))
            .then(resourcesObject=>this.api.document().setAttachment(resourcesObject.createDocumentResponse.id, null, resourcesObject.encryptedFileContent).then(setAttachmentResponse=>_.assign({setAttachmentResponse:setAttachmentResponse},resourcesObject)))
            .then(resourcesObject=>{
                this._saveDocumentAsService({
                    documentId: _.trim(_.get(resourcesObject, "createDocumentResponse.id", "")),
                    stringValue: this.documentMetas.title,
                    formId: this.documentMetas.formId,
                    contactId: _.trim(this.currentContact.id)
                })
                return resourcesObject
            })
            .then(resourcesObject => !resourcesObject.printed && this.api.triggerFileDownload( resourcesObject.pdfFileContent, "application/pdf", downloadFileName ))
            .catch(e=>{console.log(e)})
            .finally(()=>{ this.busySpinner=false; this._closeReportMenu(); })

    }

    printIncapacityForm_v2(subFormDataProvider, subFormObject, subFormTemplateObject) {

        this.busySpinner = true;

        const subFormFieldsAndValues = _.map( _.get(subFormTemplateObject, "layout.sections[0].formColumns[0].formDataList", {}), (v) => {
            return {
                name: _.trim(_.get(v, "name")),
                label: _.trim(_.get(v, "label")),
                type: _.trim(_.get(v, "type")),
                value:
                    v.type==="TKString" ? _.trim(subFormDataProvider.getStringValue( _.trim(_.get(v, "name", "")) )) :
                    v.type==="TKNumber" ? subFormDataProvider.getNumberValue( _.trim(_.get(v, "name", "")) ) :
                    v.type==="TKMeasure" ? _.flatMap(subFormDataProvider.getMeasureValue( _.trim(_.get(v, "name", "")) )).join(" ") :
                    v.type==="TKBoolean" ? !!subFormDataProvider.getBooleanValue( _.trim(_.get(v, "name", "")) ) :
                    v.type==="TKAction" ? subFormDataProvider.getValue( _.trim(_.get(v, "name", "")) ) :
                    v.type==="TKDate" ? subFormDataProvider.getDateValue( _.trim(_.get(v, "name", "")) ) :
                    v.type==="TKHCParty" ? subFormDataProvider.getValue( _.trim(_.get(v, "name", "")) ) :
                    "",
                valueTKMeasure: v.type==="TKMeasure" ? subFormDataProvider.getMeasureValue( _.trim(_.get(v, "name", "")) ) : {}
            }
        })

        this._getPatAndHcpCommonData({
            downloadFileName: _.kebabCase([ this.localize("certificate_stop_activity",this.language), _.get(this.patient, "lastName", ""), _.get(this.patient, "firstName", ""), +new Date()].join(" ")) + ".pdf",
            todayDate: moment().format("DD/MM/YYYY"),
            incapacityStart: _.get(_.filter(subFormFieldsAndValues,{name:"du"}), "[0].value", false),
            incapacityEnd: _.get(_.filter(subFormFieldsAndValues,{name:"au"}), "[0].value", false),
            incapacityPartiallyFinished: _.get(_.filter(subFormFieldsAndValues,{name:"reprise d'activité partielle"}), "[0].value", false),
            incapacityCompletelyFinished: _.get(_.filter(subFormFieldsAndValues,{name:"totale"}), "[0].value", false),
            includedExcludedLabel: _.trim( _.get(_.filter(subFormFieldsAndValues,{name:"inclus/exclus"}), "[0].value", "")) ? _.trim( _.get(_.filter(subFormFieldsAndValues,{name:"inclus/exclus"}), "[0].value", "")) : this.localize("included",this.language),
            precentageValueAndUnits: _.get(_.filter(subFormFieldsAndValues,{name:"pourcentage"}), "[0].valueTKMeasure.value", "100") + " " + ( _.trim(_.get(_.filter(subFormFieldsAndValues,{name:"pourcentage"}), "[0].valueTKMeasure.unit", "")) || "%" ),
            sortie: _.trim( _.get(_.filter(subFormFieldsAndValues,{name:"Sortie"}), "[0].value", "")) || "-",
            comment: _.trim( _.get(_.filter(subFormFieldsAndValues, {name:"Commentaire"}), "[0].value", "") ),
            incapacityData: [],
            incapacityReasonData: [],
            codesToFind: ["CD-INCAPACITY","CD-INCAPACITYREASON"]
        }).then(pdfPrintingData =>{

            const incapacityFormValue = _.get( _.filter(subFormFieldsAndValues, {name: "incapacité de"}), "[0].value", "" )
            _.get( _.filter(pdfPrintingData.foundCodes,{code:"CD-INCAPACITY"}), "[0].values", [] ).map( i=>{
                pdfPrintingData.incapacityData.push({
                    name: _.trim(_.get(i, "label." + this.language, "" )) || _.trim(_.get(i, "label.en", "" )) || _.trim(_.get(i, "label.fr", "" )) || _.trim(_.get(i, "label.nl", "" )),
                    label: _.trim(_.get(i, "label." + this.language, "" )) || _.trim(_.get(i, "label.en", "" )) || _.trim(_.get(i, "label.fr", "" )) || _.trim(_.get(i, "label.nl", "" )),
                    type: "TKBoolean",
                    value: !!(_.trim(i.id) === _.trim(incapacityFormValue))
                })
            })

            const incapacityReasonFormValue = _.get( _.filter(subFormFieldsAndValues, {name: "pour cause de"}), "[0].value", "" )
            _.get( _.filter(pdfPrintingData.foundCodes,{code:"CD-INCAPACITYREASON"}), "[0].values", [] ).map( i=>{
                pdfPrintingData.incapacityReasonData.push({
                    name: _.trim(_.get(i, "label." + this.language, "" )) || _.trim(_.get(i, "label.en", "" )) || _.trim(_.get(i, "label.fr", "" )) || _.trim(_.get(i, "label.nl", "" )),
                    label: _.trim(_.get(i, "label." + this.language, "" )) || _.trim(_.get(i, "label.en", "" )) || _.trim(_.get(i, "label.fr", "" )) || _.trim(_.get(i, "label.nl", "" )),
                    type: "TKBoolean",
                    value: !!(_.trim(i.id) === _.trim(incapacityReasonFormValue))
                })
            })

            pdfPrintingData.incapacityDuration = pdfPrintingData.incapacityStart && pdfPrintingData.incapacityEnd ? moment(pdfPrintingData.incapacityEnd+"").diff(moment(pdfPrintingData.incapacityStart+""), "days") : "X";
            if(pdfPrintingData.includedExcludedLabel.toLowerCase() === "inclus" || pdfPrintingData.includedExcludedLabel.toLowerCase() === "included" || pdfPrintingData.includedExcludedLabel.toLowerCase() === "inbegrepen") pdfPrintingData.incapacityDuration = parseInt(pdfPrintingData.incapacityDuration) ? pdfPrintingData.incapacityDuration+1 : 1;

            const pdfContent = `
                <div class="page">
                    <h1 class="">`+this.localize("certificate_stop_activity",this.language)+`</h1>
                    <h2 class="">`+ pdfPrintingData.todayDate +`</h2>

                    ` + this._getPatientVignetteHtmlCode(pdfPrintingData.patientData) + `

                    <div class="borderedBox">` +
                        `<p class="italic">` + this.localize("csa_txt001",this.language) + `:</p>` +
                        `<p class="bold fs15em mt15 mb20">` + _.trim(_.get(pdfPrintingData, "patientData.lastName", "")) + ` ` + _.trim(_.get(pdfPrintingData, "patientData.firstName", "")) + `</p> ` +
                    `</div>

                    <div class="boxLabel">`+this.localize("csa_txt002",this.language)+`</div>
                    <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.incapacityData, 2) + `</div>

                    <div class="boxLabel">`+this.localize("csa_txt003",this.language)+`</div>
                    <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.incapacityReasonData, 2) + `</div>

                    <div class="boxLabel">`+this.localize("csa_txt004",this.language)+`</div>
                    <div class="borderedBox">` +
                        "<p>" +
                            pdfPrintingData.incapacityDuration + " " + this.localize("days",this.language) + ", " +
                            _.trim(this.localize("from2",this.language)).toLowerCase() + " " + ( pdfPrintingData.incapacityStart ? moment(pdfPrintingData.incapacityStart+"").format("DD/MM/YYYY") : "-" ) + " " +
                            this.localize("till",this.language) + " " + ( pdfPrintingData.incapacityEnd ? moment(pdfPrintingData.incapacityEnd+"").format("DD/MM/YYYY") : "-" ) + " " + pdfPrintingData.includedExcludedLabel + "<br />" +
                            this.localize("csa_txt005",this.language) + ": " + pdfPrintingData.sortie +
                        "</p>" +
                    `</div>

                    <div class="boxLabel">`+this.localize("csa_txt006",this.language)+`</div>
                    <div class="borderedBox"><p>` +
                        ( pdfPrintingData.incapacityPartiallyFinished ? moment(pdfPrintingData.incapacityPartiallyFinished+"").format("DD/MM/YYYY") : "-" ) + " " + this.localize("csa_txt007",this.language) + ` ` + pdfPrintingData.precentageValueAndUnits +
                        ( pdfPrintingData.incapacityCompletelyFinished ? "<br />" + this.localize("csa_txt010",this.language) + ": " + moment(pdfPrintingData.incapacityCompletelyFinished+"").format("DD/MM/YYYY") : "" ) +
                   `</p></div>` +

                   ( _.trim( pdfPrintingData.comment ) ? `<div class="boxLabel">`+this.localize("com",this.language)+`</div><div class="borderedBox"><p>` + _.trim( pdfPrintingData.comment ) + `</p></div>` : "" ) +

                   this._getDoctorDetailsHtmlCode(pdfPrintingData.hcpData) + `
                </div> ` +
                '<'+'script'+'>'+'document.fonts.ready.then(() => { setInterval(() => {document.body.dispatchEvent(new CustomEvent("pdfDoneRenderingEvent"))}, 500); }); <'+'/script'+'>'

            // console.log(this._getPdfHeader() + pdfContent + this._getPdfFooter());

            this.api.pdfReport(this._getPdfHeader() + pdfContent + this._getPdfFooter(), {type: "recipe",completionEvent:"pdfDoneRenderingEvent"} ).then(({pdf:pdfFileContent, printed:printed}) =>
                !printed && this.api.triggerFileDownload( pdfFileContent, "application/pdf", pdfPrintingData.downloadFileName )
            ).finally(()=>{this.busySpinner = false;});

        }).catch((e)=>{console.log(e);this.busySpinner = false;});

    }

    printKinePrescriptionForm(subFormDataProvider, subFormObject, subFormTemplateObject) {

        this.busySpinner = true;

        const subFormFieldsAndValues = _.map( _.get(subFormTemplateObject, "layout.sections[0].formColumns[0].formDataList", {}), (v) => {
            return {
                name: _.trim(_.get(v, "name")),
                label: _.trim(_.get(v, "label")),
                type: _.trim(_.get(v, "type")),
                value:
                    v.type==="TKString" ? _.trim(subFormDataProvider.getStringValue( _.trim(_.get(v, "name", "")) )) :
                    v.type==="TKNumber" ? subFormDataProvider.getNumberValue( _.trim(_.get(v, "name", "")) ) :
                    v.type==="TKMeasure" ? _.flatMap(subFormDataProvider.getMeasureValue( _.trim(_.get(v, "name", "")) )).join(" ") :
                    v.type==="TKBoolean" ? !!subFormDataProvider.getBooleanValue( _.trim(_.get(v, "name", "")) ) :
                    v.type==="TKAction" ? subFormDataProvider.getValue( _.trim(_.get(v, "name", "")) ) :
                    v.type==="TKDate" ? subFormDataProvider.getDateValue( _.trim(_.get(v, "name", "")) ) :
                    v.type==="TKHCParty" ? subFormDataProvider.getValue( _.trim(_.get(v, "name", "")) ) :
                    ""
            }
        })

        this._getPatAndHcpCommonData({
            downloadFileName: _.kebabCase([ this.localize("requestForKineCare_header1",this.language), _.get(this.patient, "lastName", ""), _.get(this.patient, "firstName", ""), +new Date()].join(" ")) + ".pdf",
            healthCarTypeData: [
                _.get(_.filter(subFormFieldsAndValues,{name:"Prescription de kinésithérapie"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Le patient ne peut se déplacer"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Demande d'avis consultatif kiné"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Demande d'avis"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Diagnostic"}), "[0]", {}),
            ],
            treatmentModalityData: [
                _.get(_.filter(subFormFieldsAndValues,{name:"Massage"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Mobilisation"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Genre de séances"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Thermotherapie"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Electrotherapie"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Ultra son"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Ondes courtes"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Tapotage et gymnastique respiratoire"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Rééducation"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Localisation"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Fango"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Kiné respiratoire tapotements"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Drainage lymphatique"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Gymnastique"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Infra-rouge"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Manipulations"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Ionisations"}), "[0]", {})
            ],
            frequencyData: [
                _.get(_.filter(subFormFieldsAndValues,{name:"Nombre de séances"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Fréquence"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Code d'intervention"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Date intervention"}), "[0]", {})
            ],
            complementaryMedicalInfoData: [
                _.get(_.filter(subFormFieldsAndValues,{name:"Imagerie kiné"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Biologie kiné"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Avis spécialisé kiné"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Autre avis kiné"}), "[0]", {})
            ],
            feedbackData: [
                _.get(_.filter(subFormFieldsAndValues,{name:"Evolution pendant tt"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Evolution fin tt"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Communication par courrier"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Communication par téléphone"}), "[0]", {}),
                _.get(_.filter(subFormFieldsAndValues,{name:"Communication autre"}), "[0]", {})
            ],
            documentMetas : {
                title : _.trim(this.localize("requestForKineCare_header1",this.language)),
                formId : _.trim(_.get(subFormObject, "id", "")),
                created: ""+ +new Date(),
                patientId : _.trim(_.get(this.patient, "id", "")),
                patientName : _.compact([ _.get(this.patient, "lastName", ""), _.get(this.patient, "firstName", "") ]).join(" ")
            }
        }).then(pdfPrintingData => {

            const pdfContent = `
                <div class="page">
                    <h1 class="mb40">` + this.localize("requestForKineCare_header1", this.language) + `</h1>

                    ` + this._getPatientVignetteHtmlCode(pdfPrintingData.patientData) + `

                    <div class="boxLabel">` + this.localize("requestForKineCare_box1_title", this.language) + `</div>
                    <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.healthCarTypeData, 3) + `</div>

                    <div class="boxLabel">` + this.localize("requestForKineCare_box2_title", this.language) + `</div>
                    <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.treatmentModalityData, 3) + `</div>

                    <div class="boxLabel">` + this.localize("requestForKineCare_box3_title", this.language) + `</div>
                    <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.frequencyData, 3) + `</div>

                    <div class="boxLabel">` + this.localize("requestForKineCare_box4_title", this.language) + `</div>
                    <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.complementaryMedicalInfoData, 3) + `</div>

                    <div class="boxLabel">` + this.localize("requestForKineCare_box5_title", this.language) + `</div>
                    <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.feedbackData, 1) + `</div>

                    ` + this._getDoctorDetailsHtmlCode(pdfPrintingData.hcpData) + `
                </div> ` +
                '<' + 'script' + '>' + 'document.fonts.ready.then(() => { setInterval(() => {document.body.dispatchEvent(new CustomEvent("pdfDoneRenderingEvent"))}, 500); }); <' + '/script' + '>'

            return _.assign({pdfContent: pdfContent}, pdfPrintingData)

        })
        .then(pdfPrintingData=>this.api.pdfReport(this._getPdfHeader() + pdfPrintingData.pdfContent + this._getPdfFooter(), {type:"recipe-kine-inf",completionEvent:"pdfDoneRenderingEvent"} ).then(({pdf:pdfFileContent, printed:printed})=>_.assign({pdfFileContent:pdfFileContent, printed:printed},pdfPrintingData)))
        .then(pdfPrintingData => this.api.message().newInstanceWithPatient(this.user, this.patient)
            .then(newMessageInstance=>_.assign({newMessageInstance: newMessageInstance}, pdfPrintingData))
            .then(pdfPrintingData=>this.api.message().createMessage(
                    _.merge(
                        pdfPrintingData.newMessageInstance,
                        {
                            transportGuid: "PRESCRIPTION:KINE:ARCHIVE",
                            recipients: [_.get(this.user, 'healthcarePartyId', _.trim(this.user.id))],
                            metas: pdfPrintingData.documentMetas,
                            toAddresses: [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', _.trim(this.user.id)))],
                            subject: pdfPrintingData.documentMetas.title
                        }
                    )
                ).then(createMessageResponse=>_.assign({createMessageResponse: createMessageResponse}, pdfPrintingData))
            )
        )
        .then(pdfPrintingData=>this.api.document().newInstance(
                this.user,pdfPrintingData.createMessageResponse,
                {
                    documentType: 'report',
                    mainUti: this.api.document().uti("application/pdf"),
                    name: pdfPrintingData.documentMetas.title + " - " + pdfPrintingData.documentMetas.patientName + ".pdf"
                }
            ).then(newDocumentInstance=>_.assign({newDocumentInstance:newDocumentInstance},pdfPrintingData))
        )
        .then(pdfPrintingData=>this.api.document().createDocument(pdfPrintingData.newDocumentInstance).then(createDocumentResponse=>_.assign({createDocumentResponse:createDocumentResponse},pdfPrintingData)))
        .then(pdfPrintingData=>this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, pdfPrintingData.createDocumentResponse, pdfPrintingData.pdfFileContent).then(encryptedFileContent=>_.assign({encryptedFileContent:encryptedFileContent},pdfPrintingData)))
        .then(pdfPrintingData=>this.api.document().setAttachment(pdfPrintingData.createDocumentResponse.id, null, pdfPrintingData.encryptedFileContent).then(setAttachmentResponse=>_.assign({setAttachmentResponse:setAttachmentResponse},pdfPrintingData)))
        .then(pdfPrintingData=>{
            this._saveDocumentAsService({
                documentId: _.trim(_.get(pdfPrintingData, "createDocumentResponse.id", "")),
                stringValue: pdfPrintingData.documentMetas.title,
                formId: pdfPrintingData.documentMetas.formId,
                contactId: _.trim(this.currentContact.id)
            })
            return pdfPrintingData
        })
        .then(pdfPrintingData => !pdfPrintingData.printed && this.api.triggerFileDownload( pdfPrintingData.pdfFileContent, "application/pdf", pdfPrintingData.downloadFileName ))
        .catch(e=>{console.log(e)})
        .finally(()=>{ this.busySpinner=false; })

    }

    printNursePrescriptionForm (subFormDataProvider, subFormObject, subFormTemplateObject) {

        this.busySpinner = true;

        const formsData = {
            subForm: {
                id: _.get(subFormObject, "id", "" ),
                name: _.get(subFormTemplateObject, "layout.name", "" ),
                guid: _.get(subFormTemplateObject, "layout.guid", "" ),
                fieldsAndValues: _.map(
                    _.filter(
                        _.get(subFormTemplateObject, "layout.sections[0].formColumns[0].formDataList", []),
                        (singleField=>{ return _.get(singleField, "type", "") !== "TKAction" && _.get(singleField, "type", "") !== "TKSubConsult" })
                    ),
                    (singleField => {
                        return {
                            name: _.trim(_.get(singleField, "name")),
                            label: _.trim(_.get(singleField, "label")),
                            type: _.trim(_.get(singleField, "type")),
                            value:
                                singleField.type==="TKString" ? _.trim(subFormDataProvider.getStringValue( _.trim(_.get(singleField, "name", "")) )) :
                                singleField.type==="TKNumber" ? subFormDataProvider.getNumberValue( _.trim(_.get(singleField, "name", "")) ) :
                                singleField.type==="TKMeasure" ? _.flatMap(subFormDataProvider.getMeasureValue( _.trim(_.get(singleField, "name", "")) )).join(" ") :
                                singleField.type==="TKBoolean" ? !!subFormDataProvider.getBooleanValue( _.trim(_.get(singleField, "name", "")) ) :
                                singleField.type==="TKDate" ? subFormDataProvider.getDateValue( _.trim(_.get(singleField, "name", "")) ) :
                                singleField.type==="TKHCParty" ? subFormDataProvider.getValue( _.trim(_.get(singleField, "name", "")) ) :
                                singleField.type==="TKMedication" ? subFormDataProvider.getValueContainers( _.trim(_.get(singleField, "name", "")) ) :
                                singleField.type==="TKMedicationTable" ? subFormDataProvider.getValueContainers( _.trim(_.get(singleField, "name", "")) ) :
                                ""
                        }
                    })
                ),
                subSubFormsStructure: {
                    label: _.map(
                        _.filter( _.get(subFormTemplateObject, "layout.sections[0].formColumns[0].formDataList", []), { type: "TKSubConsult" } ),
                        (singleTKSubConsult => _.get(singleTKSubConsult, "label") )
                    ).join(" - "),
                    fieldsAndValues: _.head(
                        _.map(
                            _.filter( _.get(subFormTemplateObject, "layout.sections[0].formColumns[0].formDataList", []), { type: "TKSubConsult" } ),
                            (subForm => {
                                return _.map( subFormDataProvider.getSubForms(subForm.name), (singleSubSubForm => {
                                    return {
                                        name: _.get(singleSubSubForm, "template.name", ""),
                                        label: _.get(singleSubSubForm, "template.name", ""),
                                        type: "TKBoolean",
                                        value: true
                                    }
                                }))
                            })
                        )
                    )
                }
            },
            subSubForms: _.head(
                _.map(
                    _.chain(_.get(subFormTemplateObject, "layout.sections[0].formColumns[0].formDataList", [])).filter({type:"TKSubConsult"}).value(),
                    (subForm => {
                        return _.map( subFormDataProvider.getSubForms(subForm.name), (singleSubSubForm => {

                            const subSubFormDataProvider = _.get(singleSubSubForm, "dataProvider", {});
                            const subSubFormDataList = _.get(singleSubSubForm, "template.sections[0].formColumns[0].formDataList", []);

                            return {
                                name: _.get(singleSubSubForm, "template.name", ""),
                                guid: _.get(singleSubSubForm, "template.guid", ""),
                                columnsCount:
                                    _.trim(_.get(singleSubSubForm, "template.guid", "")) === "6B7E72D1-9FE4-4F05-A9AB-42191480D1E4" ? 1 :       // Constipation
                                    _.trim(_.get(singleSubSubForm, "template.guid", "")) === "09BBA6AB-F79C-45AA-BA1C-934D8D7A060A" ? 2 :       // Nutrition entérale
                                    _.trim(_.get(singleSubSubForm, "template.guid", "")) === "6A3B31CF-5350-4A30-8919-065F4382787C" ? 1 :       // Thérapie de compression
                                    _.trim(_.get(singleSubSubForm, "template.guid", "")) === "F25A53D3-31F1-4A51-975C-74DFD70A645B" ? 1 :       // Administration ou application de médicaments
                                    _.trim(_.get(singleSubSubForm, "template.guid", "")) === "6DE82F31-5D4C-41A7-B54B-DAFA00BF30CA" ? 2 :       // Soins de plaie
                                    _.trim(_.get(singleSubSubForm, "template.guid", "")) === "244D262F-6F8C-48C3-8975-B39159AAAB94" ? 2 :       // Sondes
                                    false,
                                fieldsAndValues: _.map(
                                    subSubFormDataList,
                                    (subSubFormSingleField => {
                                        return {
                                            name: _.trim(_.get(subSubFormSingleField, "name")),
                                            label: _.trim(_.get(singleSubSubForm, "template.guid", "")) === "244D262F-6F8C-48C3-8975-B39159AAAB94" && _.trim(_.get(subSubFormSingleField, "name")).slice(0,4) === "Qté " ?
                                                _.trim(_.get(subSubFormSingleField, "name")) :
                                                _.trim(_.get(subSubFormSingleField, "label")),
                                            type: _.trim(_.get(subSubFormSingleField, "type")),
                                            value:
                                                subSubFormSingleField.type==="TKString" ? _.trim(subSubFormDataProvider.getStringValue( _.trim(_.get(subSubFormSingleField, "name", "")) )) :
                                                subSubFormSingleField.type==="TKNumber" ? subSubFormDataProvider.getNumberValue( _.trim(_.get(subSubFormSingleField, "name", "")) ) :
                                                subSubFormSingleField.type==="TKMeasure" ? _.flatMap(subSubFormDataProvider.getMeasureValue( _.trim(_.get(subSubFormSingleField, "name", "")) )).join(" ") :
                                                subSubFormSingleField.type==="TKBoolean" ? !!subSubFormDataProvider.getBooleanValue( _.trim(_.get(subSubFormSingleField, "name", "")) ) :
                                                subSubFormSingleField.type==="TKAction" ? subSubFormDataProvider.getValue( _.trim(_.get(subSubFormSingleField, "name", "")) ) :
                                                subSubFormSingleField.type==="TKDate" ? subSubFormDataProvider.getDateValue( _.trim(_.get(subSubFormSingleField, "name", "")) ) :
                                                subSubFormSingleField.type==="TKHCParty" ? subSubFormDataProvider.getValue( _.trim(_.get(subSubFormSingleField, "name", "")) ) :
                                                subSubFormSingleField.type==="TKMedication" ? subSubFormDataProvider.getValueContainers( _.trim(_.get(subSubFormSingleField, "name", "")) ) :
                                                subSubFormSingleField.type==="TKMedicationTable" ? subSubFormDataProvider.getValueContainers( _.trim(_.get(subSubFormSingleField, "name", "")) ) :
                                                ""
                                        }
                                    })
                                )
                            }
                        }))
                    })
                )
            )
        }

        this._getPatAndHcpCommonData({
            downloadFileName: _.kebabCase([ this.localize("requestForNurseCare_header1",this.language), _.get(this.patient, "lastName", ""), _.get(this.patient, "firstName", ""), +new Date()].join(" ")) + ".pdf",
            formsData: formsData,
            documentMetas : {
                title : _.trim(this.localize("requestForNurseCare_header1",this.language)),
                formId : _.trim(_.get(subFormObject, "id", "")),
                created: ""+ +new Date(),
                patientId : _.trim(_.get(this.patient, "id", "")),
                patientName : _.compact([ _.get(this.patient, "lastName", ""), _.get(this.patient, "firstName", "") ]).join(" ")
            }
        }).then(pdfPrintingData => {
            const pdfContent = `
                <div class="page">
                    <h1 class="mb40">` + this.localize("requestForNurseCare_header1", this.language) + `</h1>

                    ` + this._getPatientVignetteHtmlCode(pdfPrintingData.patientData) + `

                    <div class="boxLabel">` + pdfPrintingData.formsData.subForm.subSubFormsStructure.label + `</div>
                    <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.formsData.subForm.subSubFormsStructure.fieldsAndValues, 2) + `</div>

                    <div class="boxLabel">` + pdfPrintingData.formsData.subForm.name + `</div>
                    <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.formsData.subForm.fieldsAndValues, 1) + "</div>" +

                _.map(pdfPrintingData.formsData.subSubForms, (singleSubSubForm => {
                    return "" +
                        '<div class="boxLabel">' + singleSubSubForm.name + '</div>' +
                        '<div class="borderedBox">' + this._getFormCheckboxesAndLabelHtmlCode(singleSubSubForm.fieldsAndValues, singleSubSubForm.columnsCount) + '</div>'
                })).join(" ") +

                this._getDoctorDetailsHtmlCode(pdfPrintingData.hcpData) + `
                </div>` +
                '<' + 'script' + '>' + 'document.fonts.ready.then(() => { setInterval(() => {document.body.dispatchEvent(new CustomEvent("pdfDoneRenderingEvent"))}, 500); }); <' + '/script' + '>'

            return _.assign({pdfContent:pdfContent}, pdfPrintingData)
        })
        .then(pdfPrintingData => this.api.pdfReport(this._getPdfHeader({ pageOverflowHidden: false }) + pdfPrintingData.pdfContent + this._getPdfFooter(), {type:"recipe-kine-inf",completionEvent:"pdfDoneRenderingEvent"} ).then(({pdf:pdfFileContent, printed:printed})=>_.assign({pdfFileContent:pdfFileContent, printed:printed},pdfPrintingData)))
        .then(pdfPrintingData => this.api.message().newInstanceWithPatient(this.user, this.patient)
            .then(newMessageInstance=>_.assign({newMessageInstance: newMessageInstance}, pdfPrintingData))
            .then(pdfPrintingData=>this.api.message().createMessage(
                    _.merge(
                        pdfPrintingData.newMessageInstance,
                        {
                            transportGuid: "PRESCRIPTION:NURSE:ARCHIVE",
                            recipients: [_.get(this.user, 'healthcarePartyId', _.trim(this.user.id))],
                            metas: pdfPrintingData.documentMetas,
                            toAddresses: [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', _.trim(this.user.id)))],
                            subject: pdfPrintingData.documentMetas.title
                        }
                    )
                ).then(createMessageResponse=>_.assign({createMessageResponse: createMessageResponse}, pdfPrintingData)))
        )
        .then(pdfPrintingData=>this.api.document().newInstance(
                this.user,pdfPrintingData.createMessageResponse,
                {
                    documentType: 'report',
                    mainUti: this.api.document().uti("application/pdf"),
                    name: pdfPrintingData.documentMetas.title + " - " + pdfPrintingData.documentMetas.patientName + ".pdf"
                }
            ).then(newDocumentInstance=>_.assign({newDocumentInstance:newDocumentInstance},pdfPrintingData))
        )
        .then(pdfPrintingData=>this.api.document().createDocument(pdfPrintingData.newDocumentInstance).then(createDocumentResponse=>_.assign({createDocumentResponse:createDocumentResponse},pdfPrintingData)))
        .then(pdfPrintingData=>this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, pdfPrintingData.createDocumentResponse, pdfPrintingData.pdfFileContent).then(encryptedFileContent=>_.assign({encryptedFileContent:encryptedFileContent},pdfPrintingData)))
        .then(pdfPrintingData=>this.api.document().setAttachment(pdfPrintingData.createDocumentResponse.id, null, pdfPrintingData.encryptedFileContent).then(setAttachmentResponse=>_.assign({setAttachmentResponse:setAttachmentResponse},pdfPrintingData)))
        .then(pdfPrintingData=>{
            this._saveDocumentAsService({
                documentId: _.trim(_.get(pdfPrintingData, "createDocumentResponse.id", "")),
                stringValue: pdfPrintingData.documentMetas.title,
                formId: pdfPrintingData.documentMetas.formId,
                contactId: _.trim(this.currentContact.id)
            })
            return pdfPrintingData
        })
        .then(pdfPrintingData => !pdfPrintingData.printed && this.api.triggerFileDownload( pdfPrintingData.pdfFileContent, "application/pdf", pdfPrintingData.downloadFileName ))
        .catch(e=>{console.log(e)})
        .finally(()=>{ this.busySpinner=false; })


    }

    printEvalKatz(subFormDataProvider, subFormObject, subFormTemplateObject){
				const template = require("./rsrc/katz-pdf-template.json")
				const address = this.patient.addresses.length ? this.patient.addresses.find(ad => ad.addressType=="home") || _.first(this.patient.addresses) : null
				const ins= _
                .chain(_.get(this.patient, "insurabilities",{}))
                .filter((i)=>{
                    return i &&
                            !!moment( _.trim(_.get(i, "startDate", "0") ), "YYYYMMDD" ).isBefore(moment()) &&
                            (!!moment( _.trim(_.get(i, "endDate", "0") ), "YYYYMMDD" ).isAfter(moment()) || !_.trim(_.get(i, "endDate", "") ) ) &&
                            !!_.trim( _.get( i, "insuranceId", "" ) )
                })
                .head()
                .value()
				this.api.insurance().getInsurance(ins.insuranceId)
            .then(i => {
                const data = {
                    "info" : {
                        "patient" : {
                            "name" : this.patient.firstName+" "+this.patient.lastName,
                            "mainAddress" : address ? address.postalCode+" "+address.city+", "+address.street+" N°"+address.houseNumber+" "+address.postboxNumber+", "+address.country : "........................",
                            "dateOfBirth" : this.api.formatedMoment(this.patient.dateOfBirth),
                            "ssin": this.patient.ssin,
                            "inscriptOA" : ins.identificationNumber,
                            "oa" : i.code
                        },
                        "hcp":{
                            "name" : this.globalHcp.name || this.globalHcp.firstName+" "+this.globalHcp.lastName,
                            "nihii" : this.globalHcp.nihii || "........................"
                        }
                    },
                    "criteres":[
                        {
                            "name" : "Se laver",
                            "score" : subFormDataProvider.getRawValue("Katz_washing_score"),
                            "values": ["est capable de se laver complètement sans aucune aide",
                                "a besoin d'une aide partielle pour se laver au-dessus ou en-dessous de la ceinture",
                                "a besoin d'une aide partielle pour se laver tant au-dessus qu'en-dessous de la ceinture",
                                "doit être entièrement aidé pour se laver tant au-dessus qu'en-dessous de la ceinture"]
                        },
                        {
                            "name" : "S'habiller",
                            "score" : subFormDataProvider.getRawValue("Katz_wearing_score"),
                            "values": ["est capable de s'habiller et se déshabiller complètement sans aucune aide",
                                "a besoin d'une aide partielle pour s'habiller au-dessus ou en-dessous de la ceinture (sans tenir compte des lacets)",
                                "a besoin d'une aide partielle pour s'habiller tant au-dessus qu'en-dessous de la ceinture",
                                "doit être entièrement aidé pour s'habiller tant au-dessus qu'en-dessous de la ceinture"]
                        },
                        {
                            "name" : "Transfert et déplacement",
                            "score" : subFormDataProvider.getRawValue("Katz_moving_score"),
                            "values": ["est autonome pour le transfert et se déplace de façon entièrement indépendante, sans auxiliaire(s) mécanique(s), ni aide de tiers",
                                "est autonome pour le transfert et ses déplacements moyennant l’utilisation d’auxiliaire(s) mécanique(s) (béquille(s), chaise roulante, …)",
                                "a absolument besoin de l'aide de tiers pour au moins un des transferts et/ou ses déplacements",
                                "est grabataire ou en chaise roulante et dépend entièrement des autres pour se déplacer"]
                        },
                        {
                            "name" : "Aller à la toilette",
                            "score" : subFormDataProvider.getRawValue("Katz_toilet_score"),
                            "values": ["est capable d’aller seul à la toilette, de s’habiller ou de s’essuyer",
                                "a besoin d'aide pour un des trois items : se déplacer ou s’habiller ou s'essuyer",
                                "a besoin d’aide pour deux des trois items : se déplacer et/ou s’habiller et/ou s'essuyer",
                                "a besoin d’aide pour les trois items : se déplacer et s’habiller et s’essuyer"]
                        },
                        {
                            "name" : "Continence",
                            "score" : subFormDataProvider.getRawValue("Katz_continence_score"),
                            "values": ["est continent pour les urines et les selles",
                                "est accidentellement incontinent pour les urines ou les selles (sonde vésicale ou anus artificiel compris)",
                                "Est incontinent pour les urines (y compris exercices de miction) ou les selles",
                                "est incontinent pour les urines et les selles"]
                        },
                        {
                            "name" : "Manger",
                            "score" : subFormDataProvider.getRawValue("Katz_eating_score"),
                            "values": ["est capable de manger et de boire seul",
                                "a besoin d'une aide préalable pour manger ou boire",
                                "a besoin d'une aide partielle pendant qu'il mange ou boit",
                                "le patient est totalement dépendant pour manger et boire"]
                        }
                    ],
                    "checkedYes" : subFormDataProvider.getRawValue("continenceBooleanYes") ? "X" : " ",
                    "checkedNo"  : subFormDataProvider.getRawValue("continenceBooleanNo") ? "X" : " ",
                    "forfait" :  subFormDataProvider.getRawValue("Katz_forfait")
                }

                template.html && Object.keys(template.html).length && this.api.pdfReport(mustache.render(template.html[this.language] || template.html[_.first(Object.keys(template.html))], data), {
                    type: "rapp-mail"
                }).then(({pdf: pdfFileContent, printed: printed}) => !printed && this.api.triggerFileDownload(
                        pdfFileContent,
                        "application/pdf",
                        _.kebabCase(_.compact([
                            "Katz",
                            data.info.patient.name,
                            +new Date()
                        ]).join("_")) + ".pdf"
                ))
            })
    }

    _getPdfHeader( layoutAttributes = false ) {

        layoutAttributes = _.merge(
            {
                pageOverflowHidden: true
            },
            (layoutAttributes||{})
        )

        return `
            <html>
                <head>

                    <style>

                        @page {size: A4; width: 210mm; height: 297mm; margin: 0; padding: 0 }
                        body {margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; line-height:1em; }
                        .page { width: 210mm; ` + (layoutAttributes.pageOverflowHidden ? "height: 297mm; overflow:hidden;" : "") + ` color:#000000; font-size:12px; padding:15mm; }

                        h1 { font-size:18px; text-align: center; margin:0; padding:0; }
                        h2 { font-size:16px; font-weight:400; font-style: italic; text-align: center; padding:0; margin:10px 0 30px 0; }
                        p {}

                        .clear { clear:both; height:0px; line-height:0px; }

                        .alignCenter {text-align: center!important;}
                        .alignLeft {text-align: left;}
                        .alignRight {text-align: right;}

                        .fl {float:left} .fr {float:right} .fn {float:none}

                        .ttn { text-transform:none; }

                        .bold { font-weight:700 }
                        .fw400 { font-weight:400 }
                        .italic { font-style: italic }
                        .fs1em { font-size:1em; } .fs11em { font-size:1.1em; } .fs12em { font-size:1.2em; } .fs13em { font-size:1.3em; } .fs14em { font-size:1.4em; } .fs15em { font-size:1.5em; } .fs16em { font-size:1.6em; } .fs17em { font-size:1.7em; } .fs18em { font-size:1.8em; } .fs19em { font-size:1.9em; } .fs2em { font-size:2em; }

                        .mt0 {margin-top: 0px!important;} .mt1 {margin-top: 1px!important;} .mt2 {margin-top: 2px!important;} .mt3 {margin-top: 3px!important;} .mt4 {margin-top: 4px!important;} .mt5 {margin-top: 5px!important;} .mt10 {margin-top: 10px!important;} .mt15 {margin-top: 15px!important;} .mt20 {margin-top: 20px!important;} .mt25 {margin-top: 25px!important;} .mt30 {margin-top: 30px!important;} .mt35 {margin-top: 35px!important;} .mt40 {margin-top: 40px!important;}
                        .mr0 {margin-right: 0px!important;} .mr1 {margin-right: 1px!important;} .mr2 {margin-right: 2px!important;} .mr3 {margin-right: 3px!important;} .mr4 {margin-right: 4px!important;} .mr5 {margin-right: 5px!important;} .mr10 {margin-right: 10px!important;} .mr15 {margin-right: 15px!important;} .mr20 {margin-right: 20px!important;} .mr25 {margin-right: 25px!important;} .mr30 {margin-right: 30px!important;} .mr35 {margin-right: 35px!important;} .mr40 {margin-right: 40px!important;}
                        .mb0 {margin-bottom: 0px!important;} .mb1 {margin-bottom: 1px!important;} .mb2 {margin-bottom: 2px!important;} .mb3 {margin-bottom: 3px!important;} .mb4 {margin-bottom: 4px!important;} .mb5 {margin-bottom: 5px!important;} .mb10 {margin-bottom: 10px!important;} .mb15 {margin-bottom: 15px!important;} .mb20 {margin-bottom: 20px!important;} .mb25 {margin-bottom: 25px!important;} .mb30 {margin-bottom: 30px!important;} .mb35 {margin-bottom: 35px!important;} .mb40 {margin-bottom: 40px!important;}
                        .ml0 {margin-left: 0px!important;} .ml1 {margin-left: 1px!important;} .ml2 {margin-left: 2px!important;} .ml3 {margin-left: 3px!important;} .ml4 {margin-left: 4px!important;} .ml5 {margin-left: 5px!important;} .ml10 {margin-left: 10px!important;} .ml15 {margin-left: 15px!important;} .ml20 {margin-left: 20px!important;} .ml25 {margin-left: 25px!important;} .ml30 {margin-left: 30px!important;} .ml35 {margin-left: 35px!important;} .ml40 {margin-left: 40px!important;}

                        .pt0 {padding-top: 0px!important;} .pt1 {padding-top: 1px!important;} .pt2 {padding-top: 2px!important;} .pt3 {padding-top: 3px!important;} .pt4 {padding-top: 4px!important;} .pt5 {padding-top: 5px!important;} .pt10 {padding-top: 10px!important;} .pt15 {padding-top: 15px!important;} .pt20 {padding-top: 20px!important;} .pt25 {padding-top: 25px!important;} .pt30 {padding-top: 30px!important;} .pt35 {padding-top: 35px!important;} .pt40 {padding-top: 40px!important;}
                        .pr0 {padding-right: 0px!important;} .pr1 {padding-right: 1px!important;} .pr2 {padding-right: 2px!important;} .pr3 {padding-right: 3px!important;} .pr4 {padding-right: 4px!important;} .pr5 {padding-right: 5px!important;} .pr10 {padding-right: 10px!important;} .pr15 {padding-right: 15px!important;} .pr20 {padding-right: 20px!important;} .pr25 {padding-right: 25px!important;} .pr30 {padding-right: 30px!important;} .pr35 {padding-right: 35px!important;} .pr40 {padding-right: 40px!important;}
                        .pb0 {padding-bottom: 0px!important;} .pb1 {padding-bottom: 1px!important;} .pb2 {padding-bottom: 2px!important;} .pb3 {padding-bottom: 3px!important;} .pb4 {padding-bottom: 4px!important;} .pb5 {padding-bottom: 5px!important;} .pb10 {padding-bottom: 10px!important;} .pb15 {padding-bottom: 15px!important;} .pb20 {padding-bottom: 20px!important;} .pb25 {padding-bottom: 25px!important;} .pb30 {padding-bottom: 30px!important;} .pb35 {padding-bottom: 35px!important;} .pb40 {padding-bottom: 40px!important;}
                        .pl0 {padding-left: 0px!important;} .pl1 {padding-left: 1px!important;} .pl2 {padding-left: 2px!important;} .pl3 {padding-left: 3px!important;} .pl4 {padding-left: 4px!important;} .pl5 {padding-left: 5px!important;} .pl10 {padding-left: 10px!important;} .pl15 {padding-left: 15px!important;} .pl20 {padding-left: 20px!important;} .pl25 {padding-left: 25px!important;} .pl30 {padding-left: 30px!important;} .pl35 {padding-left: 35px!important;} .pl40 {padding-left: 40px!important;}

                        .borderedBox { padding:5px 10px; border:1px solid #000000; margin-bottom:20px; min-height:40px; }
                        .boxLabel { font-weight:700; margin-bottom:5px; text-transform:uppercase; }
                        .boxRemark { margin-top:-10px;font-style:italic; }

                        .checkBoxContainer { padding:0; display:inline-block; margin:3px 30px 3px 0; position:relative; height:25px; min-width:160px; }
                        .checkBoxContainer.columnsCount_1 { min-width:100%; margin-right:0; }
                        .checkBoxContainer.columnsCount_2 { min-width:380px; margin-right:0; }
                        .checkBoxContainer.columnsCount_3 { min-width:255px; margin-right:0; }

                        .singleCheckBox { padding:0; width:10mm; height:6mm; border:1px solid #000000; display:inline-block; margin:0 2mm 0 0; position:absolute; top:0; left:0; text-align:center; line-height:22px; font-size:21px; font-weight:700; color:#000000; }
                        .singleCheckBoxLabel { display: inline-block; position: absolute; top: 4px; left: 12mm; }

                        .medicationTable { margin-top:20px; }
                        .medicationTableHeader { text-transform:uppercase; font-weight:700; margin-bottom:10px; margin-top:20px; }

                        .medicationsContainer {}
                        .singleMedicationContainer { margin-bottom:10px;  border:2px solid #2b4e8d; /* background-color:#f7fbf7; */ }

                        .medicationPosology { border:1px dashed #000; }
                        .posologyHeader { text-transform:uppercase; }
                        .posologyFrequency { text-decoration:underline }

                        .posologyContent {}
                        .posologyTable { width:100%; padding:0; margin:0; font-family: Arial, Helvetica, sans-serif; line-height:1em; font-size:12px; border-collapse: collapse; }
                        .posologyTable tr { padding:0; margin:0 }
                        .posologyTable tr th, .posologyTable tr td { padding:5px; margin:0; vertical-align:top; border:1px solid #000000; }
                        .posologyTable tr th { text-align:left; background-color:#e0e0e0; padding:10px 5px 10px 5px; }

                    </style>
                    </head>
                    <body>
        `
    }

    _getPatAndHcpCommonData( inputData ) {

        let pdfPrintingData = {
            patientData : {
                id: _.trim( _.get(this.patient, "id", "") ),
                lastName: _.get(this.patient, "lastName", ""),
                firstName: _.get(this.patient, "firstName", ""),
                addressData:
                   _.chain(_.get(this.patient, "addresses", {})).filter({addressType:"home"}).head().value() ||
                   _.chain(_.get(this.patient, "addresses", {})).filter({addressType:"work"}).head().value() ||
                   _.chain(_.get(this.patient, "addresses", {})).head().value() ||
                   {},
                ssinRaw: _.trim(_.get(this.patient, "ssin", "")),
                ssin: this.api.formatSsinNumber(_.trim(_.get(this.patient, "ssin", ""))),
                insuranceData: _
                   .chain(_.get(this.patient, "insurabilities",{}))
                   .filter((i)=>{
                       return i &&
                           !!moment( _.trim(_.get(i, "startDate", "0") ), "YYYYMMDD" ).isBefore(moment()) &&
                           (!!moment( _.trim(_.get(i, "endDate", "0") ), "YYYYMMDD" ).isAfter(moment()) || !_.trim(_.get(i, "endDate", "") ) ) &&
                           !!_.trim( _.get( i, "insuranceId", "" ) )
                   })
                   .head()
                   .value(),
                gender: this.localize(_.trim(_.get(this.patient, "gender", "male")) + "GenderLong",this.language),
                birthDate: parseInt(_.get(this.patient, "dateOfBirth", 0)) ? this.api.formatedMoment(_.get(this.patient, "dateOfBirth")) : "-"
           },
           hcpData: {
                id: _.trim( _.get(this.globalHcp, "id", "") ),
                address:
                   _.chain(_.get(this.globalHcp,"addresses",{})).filter({addressType:"work"}).head().value() ||
                   _.chain(_.get(this.globalHcp,"addresses",{})).filter({addressType:"home"}).head().value() ||
                   _.chain(_.get(this.globalHcp,"addresses",{})).head().value() ||
                   {},
                lastName: _.trim( _.get(this.globalHcp, "lastName", "") ).toUpperCase(),
                firstName: _.trim( _.get(this.globalHcp, "firstName", "") ),
                nihiiRaw: _.trim(_.get(this.globalHcp, "nihii", "")),
                nihii: this.api.formatInamiNumber(_.trim(_.get(this.globalHcp, "nihii", ""))),
                telecoms: _.assign(
                   {},
                   _.filter(
                       _
                           .chain(
                               _.chain(_.get(this.globalHcp,"addresses",{})).filter({addressType:"work"}).head().value() ||
                               _.chain(_.get(this.globalHcp,"addresses",{})).filter({addressType:"home"}).head().value() ||
                               _.chain(_.get(this.globalHcp,"addresses",{})).head().value() ||
                               {}
                           )
                           .get( "telecoms", [] )
                       .value(),
                       (telecom) => {return {type:_.get(telecom, "telecomType", ""), value:_.get(telecom, "telecomNumber", "")}}
                   )
               )
           }
        }

        return new Promise((resolve) => {

            return Promise.all(_.map(_.get(inputData, "codesToFind", []),(i)=>this.api.code().findCodes("be", i)))
                .then(codesResults => {
                    pdfPrintingData.foundCodes = _.get(pdfPrintingData,"foundCodes",[]);
                    _.map(codesResults, (nthPromiseResults, k) => {
                        pdfPrintingData.foundCodes.push({ code: _.get(inputData, "codesToFind["+k+"]", false), values: nthPromiseResults })
                    });
                })
                .catch(e => { console.log("CATCH"); console.log(e) })
                .finally(() => {
                    pdfPrintingData = _.assign( inputData, pdfPrintingData )
                    return new Promise((resolve) => {
                        return new Promise((resolve) => {
                            return this.api.insurance().getInsurance(_.get(pdfPrintingData, "patientData.insuranceData.insuranceId", ""))
                                .then(singleInsuranceData => {
                                    pdfPrintingData.patientData.insuranceData = _.assign(
                                        {
                                            code:_.get(singleInsuranceData, "code", "<NA>"),
                                            name:_.get(singleInsuranceData, "name." + this.language, "") || _.trim( _.head( _.filter(_.get(singleInsuranceData, "name", "" ), _.trim) ) ) || "<NA>"
                                        },
                                        pdfPrintingData.patientData.insuranceData
                                    )
                                    return resolve({})
                                })
                                .catch((e)=>{ return resolve({}); });
                        })
                        .then(()=>resolve(_.assign( inputData, pdfPrintingData )))
                        .catch(()=>resolve(_.assign( inputData, pdfPrintingData )));
                    })
                }).then(()=>resolve(pdfPrintingData))
        })

    }

    _getFormCheckboxesAndLabelHtmlCode( inputData, columnsCount = false ) {
        return _.trim(
            _.map( (_.filter(inputData, (i)=>{ return _.trim(_.get(i, "type", "")) !== "TKString" && _.trim(_.get(i, "type", "")) !== "TKMedicationTable" && _.trim(_.get(i, "type", "")) !== "TKMedication" })||[]), (v)=> {
               return '<div class="checkBoxContainer columnsCount_' + parseInt(columnsCount) + '">' +
                        '<span class="singleCheckBox">' +
                            (
                                (
                                    (_.trim(_.get(v, "type", "" ) ) === "TKBoolean" && !!v.value) ? "X" :
                                    ( _.trim(_.get(v, "type", "" ) ) !== "TKBoolean" && _.trim(v.value) && _.trim(v.value)!=='-' && _.trim(v.value)!=='NA' ) ? "X" :
                                    ""
                                )
                            ) +
                        '</span>' +
                        '<span class="singleCheckBoxLabel">'+
                            v.label +
                            ( _.trim(v.type) === "TKNumber" ? ": " + _.trim(_.get(v, "value", "")) : "") +
                            ( _.trim(v.type) === "TKMeasure" ? ": " + _.trim(_.get(v, "value", "")) : "") +
                            ( _.trim(v.type) === "TKDate" ? ": " + moment(_.trim(_.get(v, "value", "")),"YYYYMMDD").format("DD/MM/YYYY") : "") +
                        '</span>'+
                    '</div>'
           }).join("") +
           _.map( (_.filter(inputData, (i)=>{return _.trim(_.get(i, "type", "")) === "TKString"})||[]), (v)=> {
               return ( _.trim(_.get(v, "value", "")) && _.trim(_.get(v, "value", "")) !== '-' ) ? "<p class='otherChoiceFreeText mt5 mb0 pb0'><b>" + ( _.trim(_.get(v, "label", "")) ? _.trim(_.get(v, "label", "")) : _.trim(_.get(v, "name", "")) ) + ":</b> " + _.trim(_.get(v, "value", "")) + "</p>" : ""
           }).join("") +
           _.trim( this._getMedicationTableHtmlCode( _.head((_.filter(inputData, (i)=>{return _.trim(_.get(i, "type", "")) === "TKMedicationTable" || _.trim(_.get(i, "type", "")) === "TKMedication"})||[])) ) )
       )
    }

    _getMedicationTableHtmlCode( inputData ) {

        if( !inputData || !_.size(inputData) || !_.size(_.get(inputData, "value")) ) return;

        let contentToReturn = `
            <div class="medicationTable">
                <div class="medicationTableHeader">` + _.get(inputData,"label","") + `</div>
                <div class="medicationsContainer">
        `;

        contentToReturn += _.compact(
            _.map(
                _.get(inputData,"value",[]),
                (TKMedicationTable=>{

                    const medicationValue = _.get(TKMedicationTable, "content."+this.language+".medicationValue", false) || _.get(TKMedicationTable, "content.en.medicationValue", false) || _.get(TKMedicationTable, "content.fr.medicationValue", false) || _.get(TKMedicationTable, "content.nl.medicationValue", false)
                    const medictionIntendedName = _.get(medicationValue, "medicinalProduct.intendedname", "")
                    const medictionIntendedCdsCode = _.get(medicationValue, "medicinalProduct.intendedcds[0].code", "")
                    const beginMoment = parseInt(_.get(medicationValue, "beginMoment", 0)) ? moment( _.get(medicationValue, "beginMoment")+"" ).format("DD/MM/YYYY") : false;
                    const endMoment = parseInt(_.get(medicationValue, "endMoment", 0)) ? moment( _.get(medicationValue, "endMoment")+"" ).format("DD/MM/YYYY") : false;

                    if(!medicationValue || !medictionIntendedName) return false;

                    const regimenDailyFrequencies = _.filter(_.get(medicationValue, "regimen", []), {frequency:"daily"});
                    const regimenWeeklyFrequencies = _.filter(_.get(medicationValue, "regimen", []), {frequency:"weekly"});
                    const regimenMonthlyFrequencies = _.filter(_.get(medicationValue, "regimen", []), {frequency:"monthly"});

                    return `
                        <div class="singleMedicationContainer pt10 pr10 pb10 pl10">
                            <div class="medicationHeader">
                                <p class="mt0 mb10"><span class="bold">- ` + medictionIntendedName + ` <em class="fw400 ml5">(code: ` + (_.trim(medictionIntendedCdsCode)||"-") + `)</em></span></p>
                                ` + ( ((beginMoment||beginMoment)&&beginMoment!==beginMoment) ? '<p class="mt5 mb10"><span class="bold">- '+this.localize("date",this.language)+':</span> '+this.localize("startingFrom",this.language)+' ' + (beginMoment||'-') + ( endMoment ? ', '+this.localize("endingOn",this.language)+' ' + endMoment : '') + '</p>' : '' ) + `
                                ` + (_.size(_.get(medicationValue, "renewal", [])) ? '<p class="mt5 mb10"><span class="bold">- '+this.localize("renewal",this.language)+':</span> ' + _.get(medicationValue, "renewal.decimal", 1) + 'x / '+ _.get(medicationValue, "renewal.duration.value", 1 ) + ' ' + _.get(medicationValue, "renewal.duration.unit.label."+this.language, _.get(medicationValue, "renewal.duration.unit.label.en", "-" ) ) + '</p>' : '' ) + `
                                <p class="mt5 mb10"><span class="bold">- `+ this.localize("substitution",this.language) +`:</span> ` + ( _.get(medicationValue, "substitutionAllowed", false) ? this.localize("subtitutionForbidden",this.language) : this.localize("subtitutionAllowed",this.language)) + `</p>
                            </div>` +
                            (
                                !_.size(regimenDailyFrequencies) && !_.size(regimenWeeklyFrequencies) && !_.size(regimenMonthlyFrequencies) ?
                                    "" :
                                    '<div class="medicationPosology mt10 pt10 pr10 pb10 pl10 ">' +
                                    (
                                        !_.size(regimenDailyFrequencies) ?
                                            "" :
                                            `
                                                <div class="posologyHeader bold mt10 mb5 fl">`+this.localize("dailyPosology",this.language)+`:</div><div class="fr mt10"><em>` + medictionIntendedName + `</em></div><div class="clear"></div>
                                                <div class="posologyContent mb10">
                                                    <table class="posologyTable" cellspacing="0" cellpadding="0">
                                                        <thead><tr><th style="width:120px" class="alignCenter">`+this.localize("qua",this.language)+`</th><th style="width:120px" class="alignCenter">`+this.localize("uni",this.language)+`</th><th>`+this.localize("momentHour",this.language)+`</th></tr></thead>
                                                        <tbody>` + _.map(
                                                            regimenDailyFrequencies,
                                                            (singleFrequency => {
                                                                return "<tr><td class='alignCenter'>" +
                                                                    ( _.trim(_.get(singleFrequency, "administratedQuantity.quantity", ""))||"-") + "</td><td class='alignCenter'>" +
                                                                    ( _.trim(_.get(singleFrequency, "administratedQuantity.unit", ""))||"-") + "</td><td>" +
                                                                    (
                                                                        _.trim(_.get(singleFrequency, "dayPeriod.code", "")) === "custom" ?
                                                                            _.trim(_.get(singleFrequency, "timeOfDay", "")).slice(0,2)+":"+_.trim(_.get(singleFrequency, "timeOfDay", "")).slice(2,4) :
                                                                            _.trim(this.localize("ms_"+_.trim(_.get(singleFrequency, "dayPeriod.code", "")),this.language))||_.trim(_.get(singleFrequency, "dayPeriod.code", ""))||"-"
                                                                    )+ "</td></tr>"
                                                            })
                                                        ).join(" ") + `
                                                        </tbody>
                                                    </table>
                                                </div>
                                            `
                                    ) + (
                                        !_.size(regimenWeeklyFrequencies) ?
                                            "" :
                                            `
                                                <div class="posologyHeader bold mt10 mb5 fl">`+this.localize("weeklyPosology",this.language)+`:</div><div class="fr mt10"><em>` + medictionIntendedName + `</em></div><div class="clear"></div>
                                                <div class="posologyContent mb10">
                                                    <table class="posologyTable" cellspacing="0" cellpadding="0">
                                                        <thead><tr><th style="width:120px" class="alignCenter">`+this.localize("qua",this.language)+`</th><th style="width:120px" class="alignCenter">`+this.localize("uni",this.language)+`</th><th style="width:140px">`+this.localize("dayOfWeek",this.language)+`</th><th>`+this.localize("momentHour",this.language)+`</th></tr></thead>
                                                        <tbody>` + _.map(
                                                            regimenWeeklyFrequencies,
                                                            (singleFrequency => {
                                                                return "<tr><td class='alignCenter'>" +
                                                                    ( _.trim(_.get(singleFrequency, "administratedQuantity.quantity", ""))||"-") + "</td><td class='alignCenter'>" +
                                                                    ( _.trim(_.get(singleFrequency, "administratedQuantity.unit", ""))||"-") + "</td><td class='alignCenter'>" +
                                                                    ( _.trim(_.get(singleFrequency, "administratedQuantity.day", "")) && this.localize( _.trim(_.get(singleFrequency, "administratedQuantity.day", "")), this.language ) ? this.localize( _.trim(_.get(singleFrequency, "administratedQuantity.day", "")), this.language ) : _.trim(_.get(singleFrequency, "administratedQuantity.day", "")) ) + "</td><td>" +
                                                                    ( _.trim(_.get(singleFrequency, "dayPeriod.code", "")) ? _.trim(this.localize("ms_"+_.trim(_.get(singleFrequency, "dayPeriod.code", "")),this.language)) : _.trim(_.get(singleFrequency, "dayPeriod.code", ""))||"-" ) + "</td></tr>"
                                                            })
                                                        ).join(" ") + `
                                                        </tbody>
                                                    </table>
                                                </div>
                                            `
                                    ) + (
                                        !_.size(regimenMonthlyFrequencies) ?
                                            "" :
                                            `
                                                <div class="posologyHeader bold mt10 mb5 fl">`+this.localize("monthlyPosology",this.language)+`:</div><div class="fr mt10"><em>` + medictionIntendedName + `</em></div><div class="clear"></div>
                                                <div class="posologyContent mb10">
                                                    <table class="posologyTable" cellspacing="0" cellpadding="0">
                                                        <thead><tr><th style="width:120px" class="alignCenter">`+this.localize("qua",this.language)+`</th><th style="width:120px" class="alignCenter">`+this.localize("uni",this.language)+`</th><th style="width:140px" class="alignCenter">`+this.localize("dayOfMonth",this.language)+`</th><th>`+this.localize("momentHour",this.language)+`</th></tr></thead>
                                                        <tbody>` + _.map(
                                                            regimenMonthlyFrequencies,
                                                            (singleFrequency => {
                                                                return "<tr><td class='alignCenter'>" +
                                                                    ( _.trim(_.get(singleFrequency, "administratedQuantity.quantity", ""))||"-") + "</td><td class='alignCenter'>" +
                                                                    ( _.trim(_.get(singleFrequency, "administratedQuantity.unit", ""))||"-") + "</td><td class='alignCenter'>" +
                                                                    ( parseInt(_.get(singleFrequency, "administratedQuantity.time", 0)) ? moment( _.trim(_.get(singleFrequency, "administratedQuantity.time"))+"" ).format("DD") : "-" ) + "</td><td>" +
                                                                    ( _.trim(_.get(singleFrequency, "dayPeriod.code", "")) ? _.trim(this.localize("ms_"+_.trim(_.get(singleFrequency, "dayPeriod.code", "")),this.language)) : _.trim(_.get(singleFrequency, "dayPeriod.code", ""))||"-" ) + "</td></tr>"
                                                            })
                                                        ).join(" ") + `
                                                        </tbody>
                                                    </table>
                                                </div>
                                            `
                                    ) +
                                    '</div>'
                            ) +
                        "</div>"
                })
            )
        ).join(" ")

        contentToReturn += `
                </div>
            </div>
        `;

        return contentToReturn;

    }

    _getPatientVignetteHtmlCode(inputData) {
        return `
            <div class="boxLabel">`+this.localize("idPatient",this.language)+` <span class="fw400">(<i>`+this.localize("fillInOrVignette",this.language)+`</i>)</span></div>
            <div class="borderedBox">
                <b>`+this.localize("lastAndFirstName",this.language)+`:</b> `+inputData.lastName+` `+inputData.firstName+` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <b>`+this.localize("adrAbreviation",this.language)+`:</b> `+
                    _.trim( _.compact([
                        _.get(inputData.addressData, "street", "") + " ",
                        _.get(inputData.addressData, "houseNumber", "") + ( _.trim(_.get(inputData.addressData, "postboxNumber", "")) ? "/" + _.trim(_.get(inputData.addressData, "postboxNumber", "")) : "" ),
                        " - " + _.get(inputData.addressData, "postalCode", "") + " ",
                        _.get(inputData.addressData, "city", "") + " ",
                    ]).join(" "))
                +`<div class="clear mb10"></div>
                <b>`+this.localize("natNumber",this.language)+`:</b> `+ inputData.ssin +` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <b>`+this.localize("ct1ct2",this.language)+`:</b> `+ _.get(inputData.insuranceData, "parameters.tc1","")+_.get(inputData.insuranceData, "parameters.tc2","") +` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <b>`+this.localize("insNumber",this.language)+`:</b> `+ _.get(inputData.insuranceData, "code", "<NA>")+ " - " +_.get(inputData.insuranceData, "name", "<NA>") +`<div class="clear mb10"></div>
                <b>`+this.localize("insMembershipNumber",this.language)+`:</b> `+ _.get(inputData.insuranceData, "identificationNumber")+` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <b>`+this.localize("sexLitteral",this.language)+`:</b> `+ _.get(inputData, "gender")+` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <b>`+this.localize("birthDate",this.language)+`:</b> `+ _.get(inputData, "birthDate")+`
            </div>
        `
    }

    _getDoctorDetailsHtmlCode(inputData) {
        return `
            <div class="boxLabel">`+this.localize("doctorDetails",this.language)+` *</div>
            <div class="borderedBox">
                <div class="fl">
                    <b>`+this.localize("doctorAbreviation",this.language)+`</b> `+inputData.lastName+` `+inputData.firstName+`<div class="clear mb10"></div>
                    <b>`+this.localize("postalAddress",this.language)+`</b>: `+_.get(inputData.address, "street", "")+` `+_.get(inputData.address, "houseNumber", "")+( _.trim(_.get(inputData.address, "postboxNumber", ""))?"/"+_.get(inputData.address, "postboxNumber", "") : "" )+`<div class="clear mb10"></div>
                    <b>`+this.localize("zipHyphenCity",this.language)+`</b>: `+_.get(inputData.address, "postalCode", "")+` - `+_.get(inputData.address, "city", "")+`<div class="clear mb10"></div>
                    <b>`+ this.localize("inami",this.language) + `</b>: ` + _.trim(inputData.nihii) +`<div class="clear mb10"></div>
                    <b>`+ this.localize("date",this.language) + `</b>: ` + moment().format('DD/MM/YYYY') + `
                </div>
                <div class="fr">
                    <b>`+ this.localize("telAbreviation",this.language) + `</b>: ` + _.trim(_.get(_.head(_.filter(inputData.telecoms, {telecomType:"phone"})), "telecomNumber", "-")) +`<div class="clear mb10"></div>
                    <b>`+ this.localize("mobile",this.language) + `</b>: ` + _.trim(_.get(_.head(_.filter(inputData.telecoms, {telecomType:"mobile"})), "telecomNumber", "-")) +`<div class="clear mb10"></div>
                    <b>E-mail</b>: ` + _.trim(_.get(_.head(_.filter(inputData.telecoms, {telecomType:"email"})), "telecomNumber", "-")) +`<div class="clear mb0"></div>
                </div>
                <div class="clear mb0"></div>
            </div>
            <div class="boxRemark">* `+this.localize("doctorDetailsRemark",this.language)+`</div>
        `
    }

    _insertPageBreak(inputConfig) {
        return (
            this._getDoctorDetailsHtmlCode(inputConfig.hcpData) +
            '</div><div class="page"><h1 class="mb40">' + _.trim(inputConfig.h1) + '</h1>' +
            this._getPatientVignetteHtmlCode(inputConfig.patientData)
        );
    }

    _getLinkingLetterCssStyles() {
        return `
            .linkingLetter h1 { margin-bottom:5px }
            .linkingLetter h5 { margin-top:0px; text-decoration:none; font-weight:400 }
            .linkingLetter p { padding:0; margin:10px 0 10px 0; }
            .linkingLetter .tableWrapper { margin:-10px 0 0 0!important; }
            .linkingLetter table { border:0; border-collapse: collapse; }
            .linkingLetter table tr td { border:1px solid #000; font-size:13px; padding-top:0; padding-bottom:0 }
            .linkingLetter table tr td p { padding:0; margin:10px 0 10px 0; }
            .linkingLetter p:last-child { margin-top:-10px!important; }
            .linkingLetter table tr td p:last-child { margin-top:10px!important; }
        `
    }

    _createLinkingLettersProseTemplate() {
				const templateContent = '{"type":"doc","content":[{"type":"page","attrs":{"id":0},"content":[{"type":"heading","attrs":{"level":1,"align":"center"},"content":[{"type":"text","marks":[{"type":"strong"},{"type":"color","attrs":{"color":"rgb(13, 71, 161)"}},{"type":"font","attrs":{"font":"Roboto"}},{"type":"size","attrs":{"size":"24px"}}],"text":"LETTRE DE LIAISON"}]},{"type":"heading","attrs":{"level":5,"align":"center"},"content":[{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"todaysDate\\")" },"content":[]}]},{"type":"paragraph","attrs":{"align":"inherit"}},{"type":"table","content":[{"type":"table_row","content":[{"type":"table_cell","attrs":{"colspan":1,"rowspan":1,"colwidth":null,"borderColor":null,"background":null},"content":[{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","marks":[{"type":"strong"}],"text":"MÉDECIN ÉMETEUR"}]},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"variable","attrs":{ "expr":"dataProvider.getLocalizedText(\\"doctorAbreviation\\")" },"content":[]},{ "type":"text", "text":" " },{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpFirstName\\")" },"content":[]},{ "type":"text", "text":" " },{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpLastName\\")" },"content":[]}]},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpAddress\\")" },"content":[]}]},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpZipCity\\")" },"content":[]}]},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","text":"INAMI: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpNihii\\")" },"content":[]}]},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","text":"Tel: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpTelOrMobile\\")" },"content":[]}]},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","text":"E-mail: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpEmail\\")" },"content":[]}]}]},{"type":"table_cell","attrs":{"colspan":1,"rowspan":1,"colwidth":null,"borderColor":null,"background":null},"content":[{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","marks":[{"type":"strong"}],"text":"MÉDECIN RECEVEUR"}]},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","text":" "}]}]}]}]},{"type":"paragraph","attrs":{"align":"inherit"}},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","marks":[{"type":"strong"}],"text":"IDENTIFICATION DU PATIENT"}]},{"type":"table","content":[{"type":"table_row","content":[{"type":"table_cell","attrs":{"colspan":1,"rowspan":1,"colwidth":null,"borderColor":null,"background":null},"content":[{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","marks":[{"type":"strong"}],"text":"Nom et prénom: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"patientLastName\\")" },"content":[]},{"type":"text","text":" "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"patientFirstName\\")" },"content":[]},{"type":"text","marks":[{"type":"strong"}],"text":" - Adresse: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"patientAddress\\")" },"content":[]}]},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","marks":[{"type":"strong"}],"text":"N° nat: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"patientNiss\\")" },"content":[]},{"type":"text","marks":[{"type":"strong"}],"text":" - Ct1/Ct2: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"patientCt1Ct2\\")" },"content":[]},{"type":"text","marks":[{"type":"strong"}],"text":" - N° mut: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"patientInsCodeAndName\\")" },"content":[]}]},{"type":"paragraph","attrs":{"align":"inherit"},"content":[{"type":"text","marks":[{"type":"strong"}],"text":"N° aff mut: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"patientInsMembershipNumber\\")" },"content":[]},{"type":"text","marks":[{"type":"strong"}],"text":" - Sexe: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"patientSex\\")" },"content":[]},{"type":"text","marks":[{"type":"strong"}],"text":" - Date de naissance: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"patientBirthDate\\")" },"content":[]}]}]}]}]},{"type":"paragraph","attrs":{ "align":"inherit" }},{"type":"paragraph","attrs":{ "align":"inherit" }},{"type":"paragraph","attrs":{ "align":"inherit" }},{"type":"paragraph","attrs":{ "align":"inherit" }},{"type":"paragraph","attrs":{ "align":"inherit" }},{"type":"paragraph","attrs":{ "align":"inherit" }},{"type":"paragraph","attrs":{ "align":"inherit" }},{"type":"paragraph","attrs":{ "align":"inherit" }},{"type":"paragraph","attrs":{ "align":"inherit" }},{"type":"paragraph","attrs":{"align":"right"},"content":[{"type":"variable","attrs":{ "expr":"dataProvider.getLocalizedText(\\"doctorAbreviation\\")" },"content":[]},{ "type":"text", "text":" " },{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpFirstName\\")" },"content":[]},{ "type":"text", "text":" " },{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpLastName\\")" },"content":[]}]},{"type":"paragraph","attrs":{"align":"right"},"content":[{"type":"text","marks":[{"type":"strong"}],"text":"INAMI: "},{"type":"variable","attrs":{ "expr":"dataProvider.getVariableValue(\\"senderHcpNihii\\")" },"content":[]}]}]}]}'
        return this.api.doctemplate().createDocumentTemplate({
            created: ""+ +new Date(),
            documentType: "template",
            mainUti:"proseTemplate.linkingLetter." + this.language,
            name: "Prose template (json) for linking letters between hcps",
        }).then(createDocTemplate =>this.api.doctemplate().setAttachment(createDocTemplate.id, templateContent))
    }

    _printLinkingLetter(e) {

        this.busySpinner = true;

        const proseEditor = this.get('linkingLetterDialog');
        const proseHtmlContent = proseEditor.$.container.innerHTML;

        this.api.pdfReport(this._getProsePdfHeader(this._getLinkingLetterCssStyles()) + this.api.rewriteTableColumnsWidth(proseHtmlContent) + this._getPdfFooter() ,{type : "rapp-mail"})
            .then(({pdf:pdfFileContent, printed:printed}) => !printed && this.api.triggerFileDownload(
                pdfFileContent,
                "application/pdf",
                _.kebabCase(_.compact([
                    this.localize("linkingLetter",this.language),
                    this.linkingLetterDataProvider.getVariableValue("patientFirstName"),
                    this.linkingLetterDataProvider.getVariableValue("patientLastName"),
                    +new Date()
                ]).join(" ")) + ".pdf"
            ))
            .catch((e) =>{console.log(e)})
            .finally(()=>{this.busySpinner = false})

    }

    _saveLinkingLetter(e) {

        this.busySpinner = true;

        const proseEditor = this.get('linkingLetterDialog')
        const proseHtmlContent = proseEditor.$.container.innerHTML;
        const resourcesObject = {
            fileName: _.kebabCase(_.compact([
                this.localize("linkingLetter", this.language),
                this.linkingLetterDataProvider.getVariableValue("patientFirstName"),
                this.linkingLetterDataProvider.getVariableValue("patientLastName"),
                +new Date()
            ]).join(" ")) + ".pdf",
            documentMetas : {
                title : this.localize("linkingLetter", this.language),
                contactId : _.trim(_.get(this, "currentContact.id", "")),
                created: ""+ +new Date(),
                patientId : _.trim(_.get(this.patient, "id", "")),
                hcpId: _.trim(this.linkingLetterDataProvider.getVariableValue("senderHcpId")),
                patientName : _.compact([ this.linkingLetterDataProvider.getVariableValue("patientFirstName"), this.linkingLetterDataProvider.getVariableValue("patientLastName") ]).join(" ")
            }
        }

        this.api.pdfReport(this._getProsePdfHeader(this._getLinkingLetterCssStyles()) + this.api.rewriteTableColumnsWidth(proseHtmlContent) + this._getPdfFooter(), {} )
            .then(({pdf:pdfFileContent, printed:printed}) => !printed && _.assign({pdfFileContent:pdfFileContent},resourcesObject) )
            .then(resourcesObject => this.api.message().newInstanceWithPatient(this.user, this.patient)
                .then(newMessageInstance=>_.assign({newMessageInstance: newMessageInstance}, resourcesObject))
                .then(resourcesObject=>this.api.message().createMessage(
                    _.merge(
                        resourcesObject.newMessageInstance,
                        {
                            transportGuid: "LINKING-LETTER:PATIENT:ARCHIVE",
                            recipients: [_.get(this.user, 'healthcarePartyId', _.trim(this.user.id))],
                            metas: resourcesObject.documentMetas,
                            toAddresses: [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', _.trim(this.user.id)))],
                            subject: resourcesObject.documentMetas.title
                        }
                    )
                ).then(createMessageResponse=>_.assign({createMessageResponse: createMessageResponse}, resourcesObject)))
            )
            .then(resourcesObject=>this.api.document().newInstance(
                this.user,
                resourcesObject.createMessageResponse,
                {
                    documentType: 'report',
                    mainUti: this.api.document().uti("application/pdf"),
                    name: resourcesObject.documentMetas.title + " - " + resourcesObject.documentMetas.patientName + ".pdf"
                }
                ).then(newDocumentInstance=>_.assign({newDocumentInstance:newDocumentInstance},resourcesObject))
            )
            .then(resourcesObject=>this.api.document().createDocument(resourcesObject.newDocumentInstance).then(createDocumentResponse=>_.assign({createDocumentResponse:createDocumentResponse},resourcesObject)))
            .then(resourcesObject=>this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, resourcesObject.createDocumentResponse, resourcesObject.pdfFileContent).then(encryptedFileContent=>_.assign({encryptedFileContent:encryptedFileContent},resourcesObject)))
            .then(resourcesObject=>this.api.document().setAttachment(resourcesObject.createDocumentResponse.id, null, resourcesObject.encryptedFileContent).then(setAttachmentResponse=>_.assign({setAttachmentResponse:setAttachmentResponse},resourcesObject)))
            .then(resourcesObject=>{
                this._saveDocumentAsService({
                    documentId: _.trim(_.get(resourcesObject, "createDocumentResponse.id", "")),
                    stringValue: resourcesObject.documentMetas.title,
                    formId: "",
                    contactId: _.trim(_.get(this, "currentContact.id", ""))
                })
                this.proseEditorLinkingLetterTemplateAlreadyApplied = false;
                return resourcesObject
            })
            .catch(e=>{console.log(e)})
            .finally(()=>{
                this.busySpinner=false;
            })

    }

    writeLinkingLetter(e) {
        this.dispatchEvent(new CustomEvent("write-linking-letter", {composed: true, bubbles: true, detail: {currentContact: this.currentContact}}))
        this.busySpinner = true;
    }

    _getLinkingLetterDataProvider() {

        this.linkingLetterDataProvider = {

            getVariableValue: (value) => {
                return _.trim(
                    value === "todaysDate" ? this.localize('day_' + parseInt(moment().day()), this.language) + ` ` + moment().format('DD') + ` `+ (this.localize('month_' + parseInt(moment().format('M')), this.language)).toLowerCase() + ` ` + moment().format('YYYY') :
                    value === "senderHcpId" ? _.get(this.linkingLetterDpData, "hcpData.id", "") :
                    value === "senderHcpFirstName" ? _.get(this.linkingLetterDpData, "hcpData.firstName", "") :
                    value === "senderHcpLastName" ? _.get(this.linkingLetterDpData, "hcpData.lastName", "") :
                    value === "senderHcpAddress" ? _.get(this.linkingLetterDpData, "hcpData.address.street", "") + " " +  _.get(this.linkingLetterDpData, "hcpData.address.houseNumber", "") + (_.trim(_.get(this.linkingLetterDpData, "hcpData.address.postboxNumber", "")) ? " / " + _.get(this.linkingLetterDpData, "hcpData.address.postboxNumber", "") : "") :
                    value === "senderHcpZipCity" ? _.get(this.linkingLetterDpData, "hcpData.address.postalCode", "") + " " + _.get(this.linkingLetterDpData, "hcpData.address.city", "") :
                    value === "senderHcpNihii" ? _.get(this.linkingLetterDpData, "hcpData.nihii", "") :
                    value === "senderHcpTelOrMobile" ? _.trim( _.get( _.filter(_.get(this.linkingLetterDpData, "hcpData.address.telecoms", {}), {telecomType:"phone"}), "[0].telecomNumber", "" ) ) || _.trim( _.get( _.filter(_.get(this.linkingLetterDpData, "hcpData.address.telecoms", {}), {telecomType:"mobile"}), "[0].telecomNumber", "" ) ) :
                    value === "senderHcpEmail" ? _.trim(_.get(_.filter(_.get(this.linkingLetterDpData, "hcpData.address.telecoms", {}), {telecomType:"email"}), "[0].telecomNumber", "-")) :
                    value === "patientFirstName" ? _.get(this.linkingLetterDpData, "patientData.firstName", "") :
                    value === "patientLastName" ? _.get(this.linkingLetterDpData, "patientData.lastName", "") :
                    value === "patientAddress" ? _.trim( _.compact([
                        _.get(this.linkingLetterDpData, "patientData.addressData.street", "") + " ",
                        _.get(this.linkingLetterDpData, "patientData.addressData.houseNumber", "") + ( _.trim(_.get(this.linkingLetterDpData, "patientData.addressData.postboxNumber", "")) ? "/" + _.trim(_.get(this.linkingLetterDpData, "patientData.addressData.postboxNumber", "")) : "" ),
                        " - " + _.get(this.linkingLetterDpData, "patientData.addressData.postalCode", "") + " ",
                        _.get(this.linkingLetterDpData, "patientData.addressData.city", "") + " ",
                    ]).join(" ")) :
                    value === "patientNiss" ? _.get(this.linkingLetterDpData, "patientData.ssin", "") :
                    value === "patientCt1Ct2" ? _.get(this.linkingLetterDpData, "patientData.insuranceData.parameters.tc1", "") + "/" + _.get(this.linkingLetterDpData, "patientData.insuranceData.parameters.tc2", "") :
                    value === "patientInsMembershipNumber" ? _.get(this.linkingLetterDpData, "patientData.insuranceData.identificationNumber", "") :
                    value === "patientInsCodeAndName" ? _.get(this.linkingLetterDpData, "patientData.insuranceData.code", "") + " - " + _.get(this.linkingLetterDpData, "patientData.insuranceData.name", "") :
                    value === "patientSex" ? _.get(this.linkingLetterDpData, "patientData.gender", "") :
                    value === "patientBirthDate" ? _.get(this.linkingLetterDpData, "patientData.birthDate", "") :
                    ""
                )
            },

            getLocalizedText: (value) => {
                return this.localize(_.trim(value), "", this.language)
            }

        }

    }

    _openPopupMenu() {
				if (this.readOnly) {
            return;
				}
				this.shadowRoot.querySelector('#paper-menu-button').open();
    }

    sizePrintSubFormChanged(value){
				const tab = ["DL","A5"]
				this.set('traductValue',this.localize(tab[value],tab[value],this.language))
    }

    resizeContactActions(isTooSmall){
        isTooSmall ? this.root.querySelector('.contact-actions').classList.add('mobile') : this.root.querySelector('.contact-actions').classList.remove('mobile')
    }

    _isConnectedToEhbox() {
        this.set("ehealthSession", !!this.api.tokenId)
    }

    _newDate(newDate) {
				return parseInt(newDate.format("x"));
    }

    _newDateTime(newDate, oldDate) {
				return oldDate ? parseInt(newDate.format("YYYYMMDD") + oldDate.toString().substring(8,14)) : null;
    }

    _valueDate(service, date) {
				const valueDate = service.valueDate.toString();
				if (valueDate.length == 14)
            return parseInt(date.format("YYYYMMDD") + valueDate.substring(8));
				return parseInt(date.format("YYYYMMDD") + "000000");
    }

    _changeDate(service, date, contact) {
				//const newDate = this._newDate(date)
				//service.created = newDate;
				//service.modified = newDate;
				if (service.valueDate)
            service.valueDate = this._valueDate(service, date);
				if (service.openingDate)
            service.openingDate = contact.openingDate ? contact.openingDate : this._newDateTime(date, service.openingDate);
				if (service.closingDate)
            service.closingDate = contact.closingDate ? contact.closingDate : this._newDateTime(date, service.closingDate);
    }

    _isVaccineOrMedication(service) {
				return service.tags.some(t => t.type === "CD-ITEM" && (t.code === "vaccine" || t.code === "medication"));
    }

    _changeContactDate(date) {
				const contact = this.contacts[0];
				if (!contact) return;
				//const newDate = this._newDate(date);
				//contact.created = newDate;
				//contact.modified = newDate;
				if (contact.openingDate)
            contact.openingDate = this._newDateTime(date, contact.openingDate);
				if (contact.closingDate)
            contact.closingDate = this._newDateTime(date, contact.closingDate);
				const services = contact.services.filter(s => !this._isVaccineOrMedication(s));
				services.forEach(s => this._changeDate(s, date, contact));
				return this.api.contact().modifyContactWithUser(this.user, contact).then(contact => {
            this.api.register(contact, "contact");
				}).then(() => {
            setTimeout(() => this.dispatchEvent(new CustomEvent("refresh-contacts", {detail:{contact: contact},bubbles: true,composed: true})), 500);
				}).then(() => {
            this._closeDialogs();
				}).catch((e) => console.log("ERROR with _changeContactDate:", e)) ;
    }

    _maxDate() {
				//const tomorrow = this.api.moment(Date.now()).add(1, "days");
				//return this._getDate(tomorrow)
				return this.api.moment(Date.now()).format("YYYY-MM-DD");
    }

    _canChangeDate() {
				return this.contacts && this.contacts.length == 1 && this.contacts[0] && this.contacts[0].closingDate;
    }

    _getOpeningDate() {
				return this.contacts[0] ? this.api.moment(this.contacts[0].openingDate).format("YYYY-MM-DD") : "";
    }

    _formatDate(date) {
				return date ? this.api.moment(date).format('DD/MM/YYYY') : ""
    }

    _dateChanged(e) {
				console.log("dateChanged");
				if (!(e.detail.value && e.detail.value.length > 0)) return;
				if (!this.contacts[0]) return;
				this.confirmDateChange = {
            id : this.contacts[0].id.substring(0, 8),
            source : this.api.moment(this.contacts[0].openingDate),
            target : this.api.moment(e.detail.value),
				}

				this.$['confirmDateChangeDialog'].open();
    }

    _cancelDateChange() {
				this._closeDialogs();
    }

    _confirmDateChange() {
				this._closeDialogs();
				this._changeContactDate(this.confirmDateChange.target);
    }

    _closeDialogs() {
        this.set("_bodyOverlay", false);
        _.map( this.shadowRoot.querySelectorAll('.modalDialog'), i=> i && typeof i.close === "function" && i.close() )
    }

    _forwardDocument(e) {

        const documentId = _.get(e,"detail.documentId", false);
        if (!documentId) return;

        // eHealthBox connection has to be
        if (!this.ehealthSession) { this.set("_bodyOverlay", true); this.$["notConnctedToeHealthBox"].open(); return; }

        let hcpAndPatData = {}
        this._getPatAndHcpCommonData()
            .then(x=>hcpAndPatData=x)
            .catch(e=>{})
            .finally(()=> this.$['new-msg'].open({
                dataFromPatDetail: {
                    patient: _.get(this, "patient", false),
                    hcpAndPatData: hcpAndPatData || false,
                    documentId: documentId
                }
            }))

    }

    printImagingPrescriptionForm_v2(subFormDataProvider, subFormObject, subFormTemplateObject) {

				this.busySpinner = true;

				const subFormFieldsAndValues = _.compact(
            _.map( _.get(subFormTemplateObject, "layout.sections[0].formColumns[0].formDataList", {}), (v) => {
                return v.type==="TKLabelSeparator" ? false : {
                    name: _.trim(_.get(v, "name")),
                    label: _.trim(_.get(v, "label")),
                    type: _.trim(_.get(v, "type")),
                    value:
                        v.type==="TKString" ? _.trim(subFormDataProvider.getStringValue( _.trim(_.get(v, "name", "")) )) :
                        v.type==="TKNumber" ? subFormDataProvider.getNumberValue( _.trim(_.get(v, "name", "")) ) :
                        v.type==="TKMeasure" ? _.flatMap(subFormDataProvider.getMeasureValue( _.trim(_.get(v, "name", "")) )).join(" ") :
                        v.type==="TKBoolean" ? !!subFormDataProvider.getBooleanValue( _.trim(_.get(v, "name", "")) ) :
                        v.type==="TKAction" ? subFormDataProvider.getValue( _.trim(_.get(v, "name", "")) ) :
                        v.type==="TKDate" ? subFormDataProvider.getDateValue( _.trim(_.get(v, "name", "")) ) :
                        v.type==="TKHCParty" ? subFormDataProvider.getValue( _.trim(_.get(v, "name", "")) ) :
                        ""
                }
            })
				)

				this._getPatAndHcpCommonData({
            downloadFileName: _.kebabCase([ this.localize("requestForImagingExam_header1",this.language), _.get(this.patient, "lastName", ""), _.get(this.patient, "firstName", ""), +new Date()].join(" ")) + ".pdf",
            subFormData: _.compact(
                _.map(
                    (subFormDataProvider && subFormDataProvider.servicesMap ? subFormDataProvider.servicesMap : []), (v,k)=>{
                        return _.size(v) && {
                            name: k,
                            value: subFormDataProvider.getValue(k),
                            valueObject: _.get(v, "[0][0].svc.content." + this.language, "") ? _.get(v, "[0][0].svc.content." + this.language, "") : _.get(v, "[0][0].svc.content." + "fr", "")
                        }
                    }
                )
            )||[],
            additionalRelevantInformation: _.filter(subFormFieldsAndValues, (i=>{ return i.name === "Allergy" || i.name === "Diabetes" || i.name === "RenalFailure" || i.name === "Grossesse" || i.name === "Implant" || i.name === "Autre examen" })),
            previousRelevantExams: _.filter(subFormFieldsAndValues, (i=>{ return i.name === "CT Scan" || i.name === "RMN" || i.name === "RX" || i.name === "Echographie" || i.name === "Scintigraphie" || i.name === "Inconnu" || i.name === "Autre_exam_bis" })),
            documentMetas : {
                title : _.trim(this.localize("requestForImagingExam_header1",this.language)),
                formId : _.trim(_.get(subFormObject, "id", "")),
                created: ""+ +new Date(),
                patientId : _.trim(_.get(this.patient, "id", "")),
                patientName : _.compact([ _.get(this.patient, "lastName", ""), _.get(this.patient, "firstName", "") ]).join(" "),
            }
				}).then(pdfPrintingData =>{

            const pdfContent = `
                <div class="page">
                    <h1>`+this.localize("requestForImagingExam_header1",this.language)+`</h1>
                    <h2>`+this.localize("requestForImagingExam_header2",this.language)+`</h2>

                    ` + this._getPatientVignetteHtmlCode(pdfPrintingData.patientData) + `

                    <div class="boxLabel">`+this.localize("requestForImagingExam_box2_clinicalInfo",this.language)+`</div>
                    <div class="borderedBox">` + _.trim( _.get( _.filter(subFormFieldsAndValues, {name: "InfoClinPert"}), "[0].value", "")) + `</div>

                    <div class="boxLabel">`+this.localize("requestForImagingExam_box3_explanationRequestForImaging",this.language)+`</div>
                    <div class="borderedBox">` + _.trim( _.get( _.filter(subFormFieldsAndValues, {name: "ExplicationDemandeDiag"}), "[0].value", "")) + `</div>

                    <div class="boxLabel">`+this.localize("requestForImagingExam_box4_additionalInfo",this.language)+`</div>
                    <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.additionalRelevantInformation, 3) + `</div>

                    <div class="boxLabel">`+this.localize("requestForImagingExam_box6_previousExamsRelatedToRequestForImaging",this.language)+`</div>
                    <div class="borderedBox">` + this._getFormCheckboxesAndLabelHtmlCode(pdfPrintingData.previousRelevantExams, 3) + `</div>

                    <div class="boxLabel">`+this.localize("requestForImagingExam_suggestedExams",this.language)+`</div>
                    <div class="borderedBox">` + _.trim( _.get( _.filter(subFormFieldsAndValues, {name: "ExamProp"}), "[0].value", "")) + `</div>

                    ` + this._getDoctorDetailsHtmlCode(pdfPrintingData.hcpData) + `
                </div>` +
                    '<'+'script'+'>'+'document.fonts.ready.then(() => { setInterval(() => {document.body.dispatchEvent(new CustomEvent("pdfDoneRenderingEvent"))}, 500); }); <'+'/script'+'>'

            return _.assign({pdfContent:pdfContent}, pdfPrintingData)

				})
            .then(pdfPrintingData => this.api.pdfReport(this._getPdfHeader() + pdfPrintingData.pdfContent + this._getPdfFooter(), {type:"imagerie",completionEvent:"pdfDoneRenderingEvent"}).then(({pdf:pdfFileContent, printed:printed})=>_.assign({pdfFileContent:pdfFileContent, printed: printed}, pdfPrintingData)))
            .then(pdfPrintingData => this.api.message().newInstanceWithPatient(this.user, this.patient)
                .then(newMessageInstance=>_.assign({newMessageInstance: newMessageInstance}, pdfPrintingData))
                .then(pdfPrintingData=>this.api.message().createMessage(
                        _.merge(
                                pdfPrintingData.newMessageInstance,
                                {
                                    transportGuid: "PRESCRIPTION:IMAGING:ARCHIVE",
                                    recipients: [_.get(this.user, 'healthcarePartyId', _.trim(this.user.id))],
                                    metas: pdfPrintingData.documentMetas,
                                    toAddresses: [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', _.trim(this.user.id)))],
                                    subject: pdfPrintingData.documentMetas.title
                                }
                        )
                        ).then(createMessageResponse=>_.assign({createMessageResponse: createMessageResponse}, pdfPrintingData))
                )
            )
            .then(pdfPrintingData=>this.api.document().newInstance(
                this.user,pdfPrintingData.createMessageResponse,
                {
                    documentType: 'report',
                    mainUti: this.api.document().uti("application/pdf"),
                    name: pdfPrintingData.documentMetas.title + " - " + pdfPrintingData.documentMetas.patientName + ".pdf"
                }
                ).then(newDocumentInstance=>_.assign({newDocumentInstance:newDocumentInstance},pdfPrintingData))
            )
            .then(pdfPrintingData=>this.api.document().createDocument(pdfPrintingData.newDocumentInstance).then(createDocumentResponse=>_.assign({createDocumentResponse:createDocumentResponse},pdfPrintingData)))
            .then(pdfPrintingData=>this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, pdfPrintingData.createDocumentResponse, pdfPrintingData.pdfFileContent).then(encryptedFileContent=>_.assign({encryptedFileContent:encryptedFileContent},pdfPrintingData)))
            .then(pdfPrintingData=>this.api.document().setAttachment(pdfPrintingData.createDocumentResponse.id, null, pdfPrintingData.encryptedFileContent).then(setAttachmentResponse=>_.assign({setAttachmentResponse:setAttachmentResponse},pdfPrintingData)))
            .then(pdfPrintingData=>{
                this._saveDocumentAsService({
                    documentId: _.trim(_.get(pdfPrintingData, "createDocumentResponse.id", "")),
                    stringValue: pdfPrintingData.documentMetas.title,
                    formId: pdfPrintingData.documentMetas.formId,
                    contactId: _.trim(this.currentContact.id)
                })
                return pdfPrintingData
            })
            .then(pdfPrintingData => !pdfPrintingData.printed && this.api.triggerFileDownload( pdfPrintingData.pdfFileContent, "application/pdf", pdfPrintingData.downloadFileName ))
            .catch(e=>{console.log(e)})
            .finally(()=>{ this.busySpinner=false; })

    }

    newReport(e) {
				this.editedReportDataProvider = e.detail.dataProvider
				this.$['prose-editor-dialog'].open()
				const prose = this.root.querySelector("#prose-editor")

				const globalVars = [{
            type:'global',
            name: this.localize('inv_prest', 'Healthcare party', this.language),
            nodes: [
                {
                    type: 'paragraph',
                    attrs: {},
                    content: [
                        {type: 'text', marks: [{type: 'strong'}], text: 'Docteur '},
                        {type: 'variable', marks: [{type: 'strong'}], attrs: {expr: 'hcp.firstName'}},
                        {type: 'text', marks: [{type: 'strong'}], text: ' '},
                        {type: 'variable', marks: [{type: 'strong'}], attrs: {expr: 'hcp.lastName'}}
                    ]
                },
                {
                    type: 'paragraph',
                    attrs: {},
                    content: [{type: 'variable', attrs: {expr: 'hcp.addresses[0].street'}}, {type: 'text', marks: [{type: 'strong'}], text: ' '},{type: 'variable', attrs: {expr: 'hcp.addresses[0].houseNumber'}}]
                },
                {
                    type: 'paragraph',
                    attrs: {},
                    content: [{type: 'variable', attrs: {expr: 'hcp.addresses[0].postalCode'}}, {type: 'text', marks: [{type: 'strong'}], text: ' '},{type: 'variable', attrs: {expr: 'hcp.addresses[0].city'}}]
                },
                {
                    type: 'paragraph',
                    attrs: {},
                    content: [{type: 'text', text: 'INAMI: '}, {type: 'variable', attrs: {expr: 'hcp.nihii'}}]
                }
            ],
            subVars: [
                {name: this.localize('fir_nam', 'First name', this.language), nodes: [{type: 'variable', attrs: {expr: 'hcp.firstName'}}]},
                {name: this.localize('las_nam', 'Last name', this.language), nodes: [{type: 'variable', attrs: {expr: 'hcp.lastName'}}]},
                {name: this.localize('inami', 'Nihii', this.language), nodes: [{type: 'variable', attrs: {expr: 'hcp.nihii'}}]}
            ]
				}]
				const patientVars = [{
            type:'patient',
            name:'Patient',
            nodes: [
                {
                    type: 'paragraph',
                    attrs: {},
                    content: [
                        {type: 'variable', marks: [{type: 'strong'}], attrs: {expr: 'patient.firstName'}},
                        {type: 'text', marks: [{type: 'strong'}], text: ' '},
                        {type: 'variable', marks: [{type: 'strong'}], attrs: {expr: 'patient.lastName'}},
                        {type: 'text', text: '°'},
                        {type: 'variable', marks: [{type: 'strong'}], attrs: {expr: 'formatDate(patient.dateOfBirth)'}},
                    ]
                },
                {
                    type: 'paragraph',
                    attrs: {},
                    content: [{type: 'variable', attrs: {expr: 'patient.addresses[0].street'}}, {type: 'text', marks: [{type: 'strong'}], text: ' '},{type: 'variable', attrs: {expr: 'patient.addresses[0].houseNumber'}}]
                },
                {
                    type: 'paragraph',
                    attrs: {},
                    content: [{type: 'variable', attrs: {expr: 'patient.addresses[0].postalCode'}}, {type: 'text', marks: [{type: 'strong'}], text: ' '},{type: 'variable', attrs: {expr: 'patient.addresses[0].city'}}]
                }
            ],
            subVars: [
                {name: this.localize('fir_nam', 'First name', this.language), nodes: [{type: 'variable', attrs: {expr: 'patient.firstName'}}]},
                {name: this.localize('las_nam', 'Last name', this.language), nodes: [{type: 'variable', attrs: {expr: 'patient.lastName'}}]},
                {name: this.localize('dat_of_bir', 'Date of birth', this.language), nodes: [{type: 'variable', attrs: {expr: 'formatDate(patient.dateOfBirth)'}}]}

            ]
				}]
				const formVars = _.sortBy( _.map(e.detail.dataProvider.sortedItems().filter(i => i.type !== 'TKAction'), k => {
            return {
                type:'form',
                name:k.label,
                nodes: [
                    k.isSubForm ?
                            { type: 'template', attrs: { expr:`subContexts("${k.name}")`, template: {'default':[ { type: 'variable', attrs: { expr:`dataProvider.form().template.name`}}]} } } :
                            { type: 'variable', attrs: { expr:`const v = dataProvider.getValue("${k.name}"); Array.isArray(v) ? v.join(', ') : v`} }
                ]
            }
				}), "name" )

				prose.set("dynamicVars", globalVars.concat(patientVars).concat(formVars) );

				this._refreshContext();
    }

    newReport_v2(e, f, additionalParams) {

				this.dispatchEvent(new CustomEvent("trigger-out-going-doc", {composed: true, bubbles: true, detail:_.merge(additionalParams, {
            selectedContact: _.get(this,"contacts[0]",{}),
            currentContact: _.get(this,"currentContact",[]),
            allHealthElements: _.get(this,"allHealthElements",{}),
            formsAndDataProviders: _.map(this.shadowRoot.querySelectorAll("#dynamicallyLoadedForm"), form => form),
				})}))

    }

    _triggerOutGoingDocumentDialog(e) {

				this.set('showOutGoingDocContainer', false);

				const targetButton = !!_.size(_.get(e, "target", "")) && _.get(e, "target.nodeName", "") === "PAPER-BUTTON" ? _.get(e, "target", {}) : _.find(_.get(e, "path", []), p => _.get(p, "nodeName", "") === "PAPER-BUTTON")
				const outGoingDocumentTemplateId = _.trim(_.get(targetButton, "dataset.ogdtTemplateId",""))

				return !outGoingDocumentTemplateId ? null : this.newReport_v2(null,null,{docTemplateId:outGoingDocumentTemplateId})

    }

    _exportSumehrDialog(){
				this.set('showOutGoingDocContainer', false);
				this.dispatchEvent(new CustomEvent("trigger-export-sumehr", {composed: true, bubbles: true, detail: {}}))
    }

    _getOutGoingDocumentTemplates() {

				const outgoingDocumentComponent = this.shadowRoot.querySelector("#outgoingDocument")

				return outgoingDocumentComponent && typeof _.get(outgoingDocumentComponent,"_getProseEditorTemplates", false) === "function"  && outgoingDocumentComponent._getProseEditorTemplates()
            .then(foundTemplates => this.set("outGoingDocumentTemplates", foundTemplates))
            .then(() => this.shadowRoot.querySelector('#outGoingDocumentTemplates') && this.shadowRoot.querySelector('#outGoingDocumentTemplates').render())
            .catch(e=>{ console.log("[ERROR] _getOutGoingDocumentTemplates", e); return null; })

    }

    showCarePath(){
				this.set('showAddFormsContainer', false);
        this.dispatchEvent(new CustomEvent('open-care-path-list', { detail: {}, composed: true, bubbles: true}));
    }

    openBelRai(){
				this.set('showAddEvaFormsContainer', false);
				_.get(this.api, 'tokenId', null) && _.get(this, 'api.keystoreId', null) ?
				this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => this.api.fhc().Stscontroller().getBearerTokenUsingGET(_.get(this.api, 'tokenId', null), _.get(this, 'api.credentials.ehpassword', null), _.get(hcp, 'ssin', null),_.get(this, 'api.keystoreId', null)))
                .then(bearerToken => {
                    this._sendPostRequest({
                        action : _.get(this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.eHealthEnv'), "typedValue.stringValue", null) === "acc" ? "https://wwwacc.ehealth.fgov.be/idp/profile/SAML2/Bearer/POST" : "https://www.ehealth.fgov.be/idp/profile/SAML2/Bearer/POST",
                        params: [
                            {type: "hidden", name: "RelayState", value: _.get(this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.eHealthEnv'), "typedValue.stringValue", null) === "acc" ? "https://wwwacc.vas.ehealth.fgov.be/registers/belrai/web/" : "https://www.vas.ehealth.fgov.be/registers/belrai/web/" },
                            {type: "hidden", name: "SAMLResponse", value: _.get(bearerToken, 'token', null)}
                        ]
                    })
                }) : _.get(this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.eHealthEnv'), "typedValue.stringValue", null) === "acc" ? window.open("https://wwwacc.vas.ehealth.fgov.be/registers/belrai/web/") : window.open("https://www.vas.ehealth.fgov.be/registers/belrai/web/")
				}

    _sendPostRequest(params){
				const form = document.createElement('form')
				form.method = "post"
				form.target = "belRai"
				form.action = _.get(params, 'action', null)

				_.get(params, 'params', []).map(p => {
            const hiddenField = document.createElement('input')
            hiddenField.type = _.get(p, 'type', null)
            hiddenField.name = _.get(p, 'name', null)
            hiddenField.value = _.get(p, 'value', null)
            form.appendChild(hiddenField)
				})

				document.body.appendChild(form)
				form.submit()
    }

    _isSpecialist(){
				return !!(_.get(this, 'globalHcp.nihii', null) && _.startsWith(_.get(this, 'globalHcp.nihii', null), "1", 0) && _.size(_.get(this, 'globalHcp.nihii', null)) === 11 && (_.get(this, 'globalHcp.nihii', null).substr(_.size(_.get(this, 'globalHcp.nihii', null)) - 3) >= 10))
    }

    addWhiteConsultation(){
				this.set('showAddFormsContainer', false);
				this.addForm("a33a559d-b8c8-46e1-9623-f9627f88b1f0");
    }

    _saveContactAndRefreshContacts(ctc) {

        return Promise.resolve()
            .then(() => this.api.contact().modifyContactWithUser(this.user, ctc))
            .then(c => this.api.register(c,'contact'))
            .then(c => ctc.rev = c.rev)
            // .then(() => this._contactsChanged())
            .then(() => setTimeout(() => this.dispatchEvent(new CustomEvent("refresh-contacts", {detail:{contact: ctc},bubbles: true,composed: true})), 500))

    }

    _linkDocumentAndEs(e) {

				const ctc = _.find(this.contacts, {id:_.get(e, "detail.contact.id","")})
				const docId = _.trim(_.get(e, "detail.document.id",""))
				const documentSvcId = _.trim(_.get(_.find(ctc.services, svc => (!!_.size(_.get(svc,"content.fr",{})) && _.get(svc,"content.fr.documentId","") === docId) || (!!_.size(_.get(svc,"content.nl",{})) && _.get(svc,"content.nl.documentId","") === docId) || (!!_.size(_.get(svc,"content.en",{})) && _.get(svc,"content.en.documentId","") === docId)), "id",""))
				const heAlreadyLinked = !!_.size(_.filter(_.get(ctc,"subContacts",[]), sctc => _.get(sctc,"healthElementId","") === _.trim(_.get(e, "detail.healthElement.id","")) && !!_.some(_.get(sctc,"services"), {serviceId:documentSvcId})))

				return !_.trim(_.get(e, "detail.healthElement.id","")) ||
				    !_.trim(_.get(ctc,"id","")) ||
				    !_.size(_.get(ctc,"subContacts",[])) ||
				    !_.trim(docId) ||
				    !_.trim(documentSvcId) ||
            heAlreadyLinked ? Promise.resolve() : Promise.resolve()
                .then(() => ctc.subContacts.push({
                    codes: [],
                    tags: [],
                    healthElementId: _.trim(_.get(e, "detail.healthElement.id","")),
                    services: [{serviceId: documentSvcId}]
                 }))
                 .then(()=>this._saveContactAndRefreshContacts(ctc))

    }

    _unlinkDocumentAndEs(e) {

				const ctc = _.find(this.contacts, {id:_.get(e, "detail.contact.id","")})
				const docId = _.trim(_.get(e, "detail.document.id",""))
				const documentSvcId = _.trim(_.get(_.find(ctc.services, svc => (!!_.size(_.get(svc,"content.fr",{})) && _.get(svc,"content.fr.documentId","") === docId) || (!!_.size(_.get(svc,"content.nl",{})) && _.get(svc,"content.nl.documentId","") === docId) || (!!_.size(_.get(svc,"content.en",{})) && _.get(svc,"content.en.documentId","") === docId)), "id",""))

				return !_.trim(_.get(e, "detail.healthElement.id","")) ||
				    !_.trim(_.get(ctc,"id","")) ||
				    !_.size(_.get(ctc,"subContacts",[])) ||
				    !_.trim(docId) ||
				    !_.trim(documentSvcId) ? Promise.resolve() : Promise.resolve()
                .then(() => ctc.subContacts = _.filter(ctc.subContacts, sctc => (
                    (!!_.some(_.get(sctc,"services"), {serviceId:documentSvcId}) && _.trim(_.get(sctc,"healthElementId")) !== _.trim(_.get(e,"detail.healthElement.id"))) ||
                    !_.some(_.get(sctc,"services"), {serviceId:documentSvcId})
                )))
                .then(()=>this._saveContactAndRefreshContacts(ctc))

    }

    _editLabelAndTransactionDialog(e) {

        const ctc = _.find(this.contacts, {id:_.get(e, "detail.contact.id","")})
				const docId = _.trim(_.get(e, "detail.document.id",""))
        const documentSvc = _.find(ctc.services, svc => (!!_.size(_.get(svc,"content.fr",{})) && _.get(svc,"content.fr.documentId","") === docId) || (!!_.size(_.get(svc,"content.nl",{})) && _.get(svc,"content.nl.documentId","") === docId) || (!!_.size(_.get(svc,"content.en",{})) && _.get(svc,"content.en.documentId","") === docId))
        const serviceLabel = !!_.trim(_.get(documentSvc,"content.fr.stringValue","")) ? _.trim(_.get(documentSvc,"content.fr.stringValue","")) : !!_.trim(_.get(documentSvc,"content.nl.stringValue","")) ? _.trim(_.get(documentSvc,"content.nl.stringValue","")) : !!_.trim(_.get(documentSvc,"content.en.stringValue","")) ? _.trim(_.get(documentSvc,"content.en.stringValue","")) : _.trim(_.get(documentSvc,"label",""))
        const transactionCode = !!_.trim(_.get(_.find(_.get(documentSvc,"tags",[]), {type:"CD-TRANSACTION"}), "code", "")) ? _.trim(_.get(_.find(_.get(documentSvc,"tags",[]), {type:"CD-TRANSACTION"}), "code", "")) : !!_.trim(_.get(_.find(_.get(ctc,"tags",[]), {type:"CD-TRANSACTION"}), "code", "")) ? _.trim(_.get(_.find(_.get(ctc,"tags",[]), {type:"CD-TRANSACTION"}), "code", "")) : ""

        this.set("editLabelAndTransactionData.ctc", ctc)
        this.set("editLabelAndTransactionData.docId", docId)
        this.set("editLabelAndTransactionData.isServices", false)
        this.set("editLabelAndTransactionData.label", serviceLabel)
        this.set("editLabelAndTransactionData.transactionCode", transactionCode)

        return this.$['editLabelAndTransactionDialog'] && this.$['editLabelAndTransactionDialog'].open();

    }

    _saveLabelAndTransactionDialog() {

				if(!!_.get(this,"editLabelAndTransactionData.isServices",false)) return this._saveLabelAndTransactionDialogService()

				const ctc = _.find(this.contacts, {id:_.get(this,"editLabelAndTransactionData.ctc.id","")})
				const docId = _.trim(_.get(this,"editLabelAndTransactionData.docId",""))
				const documentSvc = _.find(ctc.services, svc => (!!_.size(_.get(svc,"content.fr",{})) && _.get(svc,"content.fr.documentId","") === docId) || (!!_.size(_.get(svc,"content.nl",{})) && _.get(svc,"content.nl.documentId","") === docId) || (!!_.size(_.get(svc,"content.en",{})) && _.get(svc,"content.en.documentId","") === docId))
				const documentSctc = _.find(ctc.subContacts, sctc => !_.trim(_.get(sctc,"healthElementId","")) && !!_.some(_.get(sctc,"services"),{serviceId:_.get(documentSvc,"id","")}))
				const isEhboxMessage = !!_.trim(_.get(_.find(_.get(documentSctc, "tags", []), {type:"originalEhBoxMessageId"}),"id",""))

				const newLabel = _.trim(_.get(this,"editLabelAndTransactionData.label",""))
				const newTransactionCode = _.trim(_.get(this,"editLabelAndTransactionData.transactionCode",""))

				return !_.size(ctc) ||
				    !_.trim(docId) ||
				    !_.size(documentSvc) ? Promise.resolve((this.$['editLabelAndTransactionDialog'] && this.$['editLabelAndTransactionDialog'].close())) : Promise.resolve()
				        .then(() => {

				            if(isEhboxMessage) {

				                ctc.descr = newLabel
				                documentSvc.label = newLabel

				                ctc.tags = _.filter(_.get(ctc,"tags",[]), tag => _.trim(_.get(tag,"type")) !== "CD-TRANSACTION")
				                ctc.tags.push({type: "CD-TRANSACTION", code: newTransactionCode, disabled: false})

                        if(!!_.size(documentSctc)) {
                            documentSctc.tags = _.filter(_.get(documentSctc, "tags", []), tag => _.trim(_.get(tag, "type")) !== "CD-TRANSACTION")
                            documentSctc.tags.push({type: "CD-TRANSACTION",code: newTransactionCode,disabled: false})
                        }

				            }

				            if(!!_.size(_.get(documentSvc,"content.fr",{}))) _.merge(documentSvc, {content:{fr:{stringValue:newLabel}}})
				            if(!!_.size(_.get(documentSvc,"content.nl",{}))) _.merge(documentSvc, {content:{nl:{stringValue:newLabel}}})
				            if(!!_.size(_.get(documentSvc,"content.en",{}))) _.merge(documentSvc, {content:{en:{stringValue:newLabel}}})

				            documentSvc.tags = _.filter(_.get(documentSvc,"tags",[]), tag => _.trim(_.get(tag,"type")) !== "CD-TRANSACTION")
				            documentSvc.tags.push({type: "CD-TRANSACTION", code: newTransactionCode, disabled: false})

				        })
				        .then(()=>this._saveContactAndRefreshContacts(ctc))
				        .finally(()=>this.$['editLabelAndTransactionDialog'] && this.$['editLabelAndTransactionDialog'].close())

    }

    _linkServicesAndEs(e) {

				const ctc = _.find(this.contacts, {id:_.get(e, "detail.contact.id","")})
				const sourceSubContact = _.find(_.get(ctc,"subContacts",[]), sctc => ((_.get(sctc,"status",0) & (1 << 0)) !== 0) || ((_.get(sctc,"status",0) & (1 << 5)) !== 0)) /* Target lab results (1<<0) or protocol (1<<5) subContact */
				const sourceServiceIds = _.uniq(_.compact(_.map(_.get(sourceSubContact,"services",[]), x => _.get(x,"serviceId",""))))
				const heAlreadyLinked = !!_.size(_
            .chain(_.get(ctc,"subContacts",[]))
            .filter(sctc => ((_.get(sctc,"status",0) & (1 << 0)) === 0) && ((_.get(sctc,"status",0) & (1 << 5)) === 0) && _.every( _.uniq(_.compact(_.map(_.get(sctc,"services",[]), x => _.get(x,"serviceId","")))), x => sourceServiceIds.indexOf(x) > -1 ))
            .map(subCtc => _.get(subCtc,"healthElementId",""))
            .filter(heId => heId === _.trim(_.get(e, "detail.healthElement.id","")))
            .compact()
            .uniq()
            .value()
				)

				return !_.trim(_.get(e, "detail.healthElement.id","")) ||
            !_.trim(_.get(ctc,"id","")) ||
            !_.size(sourceSubContact) ||
            !_.size(sourceServiceIds) ||
            heAlreadyLinked ? Promise.resolve() : Promise.resolve()
                .then(() => ctc.subContacts.push({
                    codes: [],
                    tags: [],
                    healthElementId: _.trim(_.get(e, "detail.healthElement.id","")),
                    services: _.map(sourceServiceIds, svcId => _.merge({},{serviceId: svcId}))
                }))
                .then(()=>this._saveContactAndRefreshContacts(ctc))

    }

    _unlinkServicesAndEs(e) {

				const ctc = _.find(this.contacts, {id:_.get(e, "detail.contact.id","")})
				const sourceSubContact = _.find(_.get(ctc,"subContacts",[]), sctc => ((_.get(sctc,"status",0) & (1 << 0)) !== 0) || ((_.get(sctc,"status",0) & (1 << 5)) !== 0)) /* Target lab results (1<<0) or protocol (1<<5) subContact */
				const sourceServiceIds = _.uniq(_.compact(_.map(_.get(sourceSubContact,"services",[]), x => _.get(x,"serviceId",""))))

				return !_.trim(_.get(e, "detail.healthElement.id","")) ||
            !_.trim(_.get(ctc,"id","")) ||
            !_.size(sourceSubContact) ||
            !_.size(sourceServiceIds) ? Promise.resolve() : Promise.resolve()
                .then(() => ctc.subContacts = _.filter(ctc.subContacts, sctc => !(!!_.every( _.uniq(_.compact(_.map(_.get(sctc,"services",[]), x => _.get(x,"serviceId","")))), x => sourceServiceIds.indexOf(x) > -1 ) && _.get(sctc,"healthElementId","") === _.trim(_.get(e, "detail.healthElement.id","")))))
                .then(()=>this._saveContactAndRefreshContacts(ctc))

    }

    _editLabelAndTransactionDialogServices(e) {

				const ctc = _.find(this.contacts, {id:_.get(e, "detail.contact.id","")})
				const sourceSubContact = _.find(_.get(ctc,"subContacts",[]), sctc => ((_.get(sctc,"status",0) & (1 << 0)) !== 0) || ((_.get(sctc,"status",0) & (1 << 5)) !== 0)) /* Target lab results (1<<0) or protocol (1<<5) subContact */
				const serviceLabel = !!_.trim(_.get(ctc,"descr","")) ? _.trim(_.get(ctc,"descr","")) : _.trim(_.get(sourceSubContact,"descr",""))
				const transactionCode = !!_.trim(_.get(_.find(_.get(sourceSubContact,"tags",[]), {type:"CD-TRANSACTION"}), "code", "")) ? _.trim(_.get(_.find(_.get(sourceSubContact,"tags",[]), {type:"CD-TRANSACTION"}), "code", "")) : _.trim(_.get(_.find(_.get(ctc,"tags",[]), {type:"CD-TRANSACTION"}), "code", ""))

				this.set("editLabelAndTransactionData.ctc", ctc)
				this.set("editLabelAndTransactionData.docId", "")
				this.set("editLabelAndTransactionData.isServices", true)
				this.set("editLabelAndTransactionData.label", serviceLabel)
				this.set("editLabelAndTransactionData.transactionCode", transactionCode)

				return this.$['editLabelAndTransactionDialog'] && this.$['editLabelAndTransactionDialog'].open();

    }

    _saveLabelAndTransactionDialogService() {

				const ctc = _.find(this.contacts, {id:_.get(this,"editLabelAndTransactionData.ctc.id","")})
				const sourceSubContact = _.find(_.get(ctc,"subContacts",[]), sctc => ((_.get(sctc,"status",0) & (1 << 0)) !== 0) || ((_.get(sctc,"status",0) & (1 << 5)) !== 0)) /* Target lab results (1<<0) or protocol (1<<5) subContact */
				const isEhboxMessage = !!_.trim(_.get(_.find(_.get(sourceSubContact, "tags", []), {type:"originalEhBoxMessageId"}),"id",""))

				const newLabel = _.trim(_.get(this,"editLabelAndTransactionData.label",""))
				const newTransactionCode = _.trim(_.get(this,"editLabelAndTransactionData.transactionCode",""))

				return !_.size(ctc) || !_.size(sourceSubContact) ? Promise.resolve((this.$['editLabelAndTransactionDialog'] && this.$['editLabelAndTransactionDialog'].close())) : Promise.resolve()
            .then(() => {

                ctc.descr = newLabel
                isEhboxMessage && (ctc.tags = _.filter(_.get(ctc,"tags",[]), tag => _.trim(_.get(tag,"type")) !== "CD-TRANSACTION"))
                isEhboxMessage && ctc.tags.push({type: "CD-TRANSACTION", code: newTransactionCode, disabled: false})

                isEhboxMessage && (sourceSubContact.tags = _.filter(_.get(sourceSubContact, "tags", []), tag => _.trim(_.get(tag, "type")) !== "CD-TRANSACTION"))
                isEhboxMessage && sourceSubContact.tags.push({type: "CD-TRANSACTION",code: newTransactionCode,disabled: false})

            })
            .then(()=>this._saveContactAndRefreshContacts(ctc))
            .finally(()=>this.$['editLabelAndTransactionDialog'] && this.$['editLabelAndTransactionDialog'].close())

    }

    _deleteServiceDialog(e) {

				const ctc = _.find(this.contacts, {id:_.get(e, "detail.contact.id","")})
				const isFromServices = !!_.get(e,"detail.isServices", false)

				// For dynamic doc
				const docId = _.trim(_.get(e, "detail.document.id",""))
				const documentSvc = _.find(ctc.services, svc => (!!_.size(_.get(svc,"content.fr",{})) && _.get(svc,"content.fr.documentId","") === docId) || (!!_.size(_.get(svc,"content.nl",{})) && _.get(svc,"content.nl.documentId","") === docId) || (!!_.size(_.get(svc,"content.en",{})) && _.get(svc,"content.en.documentId","") === docId))

				// For ht-services-list
				const sourceSubContact = _.find(_.get(ctc,"subContacts",[]), sctc => ((_.get(sctc,"status",0) & (1 << 0)) !== 0) || ((_.get(sctc,"status",0) & (1 << 5)) !== 0)) /* Target lab results (1<<0) or protocol (1<<5) subContact */
				const sourceServiceIds = _.uniq(_.compact(_.map(_.get(sourceSubContact,"services",[]), x => _.get(x,"serviceId",""))))

				// For dialog
				this.set("_deleteServicesData.ctc",ctc)
				this.set("_deleteServicesData.isFromServices",isFromServices)
				this.set("_deleteServicesData.docId",docId)
				this.set("_deleteServicesData.documentSvc",documentSvc)
				this.set("_deleteServicesData.sourceSubContact",sourceSubContact)
				this.set("_deleteServicesData.sourceServiceIds",sourceServiceIds)

				return this.$['deleteServiceDialog'] && this.$['deleteServiceDialog'].open();

    }

    _doDeleteService() {

				console.log("_doDeleteService", this._deleteServicesData)

				return this.$['deleteServiceDialog'] && this.$['deleteServiceDialog'].close();

    }

}

customElements.define(HtPatDetailCtcDetailPanel.is, HtPatDetailCtcDetailPanel);
