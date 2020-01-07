import '../ht-spinner/ht-spinner.js';
import './dynamic-number-field.js';
import './dynamic-number-slider.js';
import './dynamic-token-field.js';
import './dynamic-text-field.js';
import './dynamic-text-area.js';
import './dynamic-measure-field.js';
import './dynamic-popup-menu.js';
import './dynamic-date-field.js';
import './dynamic-sub-form.js';
import './dynamic-checkbox.js';
import './dynamic-medication-field.js';
import './dynamic-subcontact-type-selector.js';
import '../../styles/icpc-styles.js';
import '../../styles/dialog-style.js';
import '../../styles/buttons-style.js';
import './ckmeans-grouping.js';
class DynamicForm extends Polymer.TkLocalizerMixin(Polymer.Element) {
    static get is() {
				return 'dynamic-form';
    }

    static get properties() {
				return {
            api: {
                type: Object
            },
            user: {
                type: Object
            },
            template: {
                type: Object,
                observer: '_templateChanged'
            },
            reports: {
                type: Array
            },
            readOnly: {
                type: Boolean,
                value: false
            },
            compact: {
                type: Boolean,
                value: false
            },
            dataProvider: {
                type: Object
            },
            dataMap: {
                type: Object,
                value: null
            },
            isSubForm: {
                type: Boolean,
                value: false
            },
            showTitle: {
                type: Boolean,
                value: false
            },
            noPrint: {
                type: Boolean,
                value: false
            },
            title: {
                type: String,
                value: null
            },
            displayedTitle: {
                type: String,
                computed: "_displayedTitle(title, showTitle, dataProvider)"
            },
            showEdit: {
                type: String,
                computed: "_showEdit(isSubForm, readOnly)"
            },
            healthElements: {
                type: Array
            },
            linkableHealthElements: {
                type: Array
            },
            reportsListDisplayed: {
                type: Boolean,
                value: false
            },
            subcontactType: {
                type: Array,
                value: () => []
            },
            closed: {
                type: Boolean
            },
             parentFormDp: {
                type: Object,
                value: () => {}
            }
				};
    }

    static get observers() {
        return [];
    }

    constructor() {
				super();
    }

    _shouldDisplayTypes(readOnly, typesList) {
				return !readOnly && typesList && typesList.length
    }

    _showEdit() {
				return this.readOnly && !this.isSubForm;
    }

    _sanitizeId( id ) {
				return id.replace(/[\.#]/gi, '-')
    }

    notify(path) {
				try{
            if (!this.template) {
                return;
            }
            let pathParts = path.split('.');

            let composedNameLength = 1
            const layoutItem = _.flatten(_.flatten(this.template.sections.map(s => s.formColumns.map(c => c.formDataList)))).find(fdl => {

                const nameParts = fdl.name.split('.')
                const pathPartsForName = pathParts.slice(0,nameParts.length)

                return nameParts.filter( (n, idx) => n === pathPartsForName[idx] ).length === nameParts.length && (composedNameLength = nameParts.length)

            });

            const joinedId = pathParts.slice(0,composedNameLength).join('-')
            const item = Polymer.dom(this.root).querySelector('#sf_' + joinedId);

            if (item) {
                if (pathParts.length > 1) {
                    item.subContexts = this._subForms(layoutItem);
                    item.notify && item.notify(pathParts.slice(composedNameLength).join('.'));
                } else {
                    item.notify && item.notify();
                }
            } else {
                this.notifyPath('dataMap.'+joinedId)
            }
				} catch (e) {
            return 0;
				}
    }

    _hasTreatmentCdItem(tags) {
        return tags && tags.some(t => (t.type === 'CD-ITEM' && t.code ==='treatment') || (t.type === 'ICURE' && t.code ==='PRESC'))
    }

    _displayedTitle() {
				return this.title && this.dataProvider ? this.title+" "+this.dataProvider.subContactTitle() : "Loading ...";
    }

    _linkForm(e) {
        const he = this.healthElements.find(he => he.id === e.target.id || he.idService === e.target.id);
        this.dispatchEvent(new CustomEvent('link-form', {detail: {healthElement: he}, composed: true, bubbles: true}));
    }

    _deleteForm() {
        this.dispatchEvent(new CustomEvent('delete-form', {composed: true, bubbles: true}));
        // const card = this.root.querySelector('.pat-details-card')
        // if (card) {card.style.display = 'none'} // prevent user to click delete twice
    }

    _deleteConfirmation() {
				this.$['delete-confirmation-dialog'].open();
    }


    _patCardClass(isSubForm) {
				return !isSubForm ? "pat-details-card" : "pat-details-card subform-card";
    }

    _value(layoutItem) {
				if (!this.dataProvider) {
            return null;
				}
				return this._isCheckboxField(layoutItem) ? '' + !!this._rawValue(layoutItem) : this._rawValue(layoutItem);
    }

    _status(layoutItem){
        if (!this.dataProvider) {
            return null;
        }

    }

    _isReadOnly(layoutItem){
				return this.readOnly || (layoutItem.editor && layoutItem.editor.readOnly)
    }

    _rawValue(layoutItem) {
				if (!this.dataProvider) {
            return null;
				}
				return this._isDateField(layoutItem) ? this.dataProvider.getDateValue(layoutItem.name) : this._isMeasureField(layoutItem) ? this.dataProvider.getMeasureValue(layoutItem.name) : this._isCheckboxField(layoutItem) ? this.dataProvider.getBooleanValue(layoutItem.name) : this._isNumberField(layoutItem) ? this.dataProvider.getNumberValue(layoutItem.name) : this._isNumberSlider(layoutItem) ? this.dataProvider.getNumberValue(layoutItem.name) : this.dataProvider.getStringValue(layoutItem.name);
    }

    _shouldDisplay(layoutItem, readOnly, compact) {
        return this.dataProvider ?
            (this.dataProvider && (!readOnly && !compact || (this._isSubForm(layoutItem) && this.dataProvider.hasSubForms(layoutItem.name)) || (this._isMedicationField(layoutItem)|| this._isTokenField(layoutItem)) && this.dataProvider.getValueContainers(layoutItem.name).length || this._rawValue(layoutItem))) :
            ( !readOnly && !compact || this._isSubForm(layoutItem) || this._isMedicationField(layoutItem) && this.dataProvider.getValueContainers(layoutItem.name).length || this._rawValue(layoutItem) )
    }

    _valueContainers(layoutItem) {
				if (!this.dataProvider) {
            return null;
				}
				return this.dataProvider.getValueContainers(layoutItem.name) || [];
    }

    _valueDate(layoutItem) {
				if (!this.dataProvider) {
            return null;
				}
				return this.dataProvider.getValueDateOfValue(layoutItem.name);
    }

    _subForms(layoutItem) {
				if (!this.dataProvider) {
            return null;
				}
				return this.dataProvider.getSubForms(layoutItem.name);
    }

    _templateChanged(change) {
				if (!this.template || !this.template.sections) {
            return;
				}
				this.layoutItemPerName = _.flatten(this.template.sections.map(s => _.flatten(s.formColumns.map(c => c.formDataList)))).reduce((acc, val) => {
            acc[this._sanitizeId(val.name)] = val;
            return acc;
				}, {});
    }

    _valueChanged(event) {
				if (!this.dataProvider) {
            return;
				}

				const change = event.detail;
				if (!this.layoutItemPerName || !event.target.id) {
            return;
				}
				const layoutItem = this.layoutItemPerName[event.target.id];
				if (this.dataProvider) {
            this._isDateField(layoutItem) ? this.dataProvider.setDateValue(layoutItem.name, change.value) :
                    this._isMeasureField(layoutItem) ? this.dataProvider.setMeasureValue(layoutItem.name, typeof change.value === "object" ? change.value : { value: change.value, unit: change.unit }) :
                            this._isCheckboxField(layoutItem) ? this.dataProvider.setBooleanValue(layoutItem.name, change.value && change.value !== 'false') :
                                    this._isNumberField(layoutItem) ? this.dataProvider.setNumberValue(layoutItem.name, change.value) :
                                            this._isNumberSlider(layoutItem) ? this.dataProvider.setNumberValue(layoutItem.name, change.value) :
                                                    this.dataProvider.setStringValue(layoutItem.name, change.value);
				}
    }

    _valueContainersChanged(event) {
				if (!this.dataProvider) {
            return;
				}
				const change = event.detail;
				if (!this.layoutItemPerName || !event.target.id) {
            return;
				}
				const layoutItem = this.layoutItemPerName[event.target.id];
				if (layoutItem) {
            this._isTokenField(layoutItem) ? this.dataProvider.setValueContainers(layoutItem.name, change.value) : this._isMedicationField(layoutItem) ? this.dataProvider.setValueContainers(layoutItem.name, change.value) : null;
				}
    }

    _valueDateChanged(event) {
				if (!this.dataProvider) {
            return;
				}
				const change = event.detail;
				if (!this.layoutItemPerName || !event.target.id) {
            return;
				}
				const layoutItem = this.layoutItemPerName[event.target.id];
				if (layoutItem) {
            this.dataProvider.setValueDateOfValue(layoutItem.name, change.value);
				}
    }

    _valueDateChangedWithBooleanSet(event) {
				if (!this.dataProvider) {
            return;
				}
				const change = event.detail;
				if (!this.layoutItemPerName || !event.target.id) {
            return;
				}
				const layoutItem = this.layoutItemPerName[event.target.id];
				if (layoutItem) {
            this.dataProvider.setValueDateOfValue(layoutItem.name, change.value, true);
				}
    }

    _unit(layoutItem, dataMap) {
				if (!this.dataProvider) {
            return null;
				}
				return this._isMeasureField(layoutItem) ? (() => {
            const v = this.dataProvider.getMeasureValue(layoutItem.name); return v && v.unit;
				})() : null;
    }

    width(layoutItem) {
				return layoutItem;
    }

    _sortedGroupedFormDataList(formDataList) {
				const widthsStruct = formDataList.reduce((acc, i) => {
            acc.widths[i.name] = i.editor.left + i.editor.width; acc.maxWidth = Math.max(acc.widths[i.name], acc.maxWidth); return acc
				}, { widths: {}, maxWidth: 32 })

				//Cluster lines
				const sortedList = _.sortBy(formDataList, fd => fd.editor.top)
				const clusters = this.$['ckmeans-grouping'].cluster(sortedList.map(fd => fd.editor.top)).clusters

				const formDataClusters = sortedList.reduce((cs, fd) => cs[_.findIndex(clusters, c => c.includes(fd.editor.top))].push(fd) && cs, new Array(clusters.length).fill(null).map(() => [])).map(c => _.sortBy(c, [x => x.editor.left + x.editor.width]))

				//Cluster columns
				const rightClustering = this.$['ckmeans-flow-grouping'].cluster(_.sortBy(formDataList.map(fd => fd.editor.left + fd.editor.width)))
				//Round centroids
				rightClustering.centroids = rightClustering.centroids.map(c => Math.round(c / 24) * 24)

				_.flatten(formDataClusters).forEach(c => {
            c.editor.right = rightClustering.centroids[_.findIndex(rightClustering.clusters, cc => cc.includes(c.editor.left + c.editor.width))]
				});

				formDataClusters.forEach(line => {
            const width = line.reduce((acc,c) => { c.editor.flow = c.editor.right - acc; return c.editor.right }, 0)
            line.forEach(c => c.editor.flow = c.editor.flow * 100 / width)
				})

				return _.flatten(formDataClusters);
    }

    _isTextArea(layoutItem) {
				return layoutItem.editor.key === 'StringEditor' && layoutItem.editor.multiline === true || layoutItem.editor.key === 'StyledStringEditor' ;
    }

    _isTextField(layoutItem) {
				return layoutItem.editor.key === 'StringEditor' && layoutItem.editor.multiline === false;
    }

    _isPopupMenu(layoutItem) {
				return layoutItem.editor.key === 'PopupMenuEditor';
    }

    _isNumberField(layoutItem) {
				return layoutItem.editor.key === 'NumberEditor';
    }

    _isNumberSlider(layoutItem) {
        return layoutItem.editor.key === 'IntegerSliderEditor';
    }

    _isDateField(layoutItem) {
				return layoutItem.editor.key === 'DateTimeEditor';
    }

    _isValueDateField(layoutItem) {
				return layoutItem.editor.key === 'CheckBoxEditor' && layoutItem.editor.displayValueDate;
    }

    _isCheckboxField(layoutItem) {
				return layoutItem.editor.key === 'CheckBoxEditor' && !layoutItem.editor.displayValueDate;
    }

    _isMeasureField(layoutItem) {
				return layoutItem.editor.key === 'MeasureEditor';
    }

    _isTokenField(layoutItem) {
				return layoutItem.editor.key === 'TokenFieldEditor';
    }

    _isMedicationField(layoutItem) {
				return layoutItem.editor.key === 'MedicationTableEditor';
    }

    _isLabel(layoutItem){
        return layoutItem.editor.key === 'Label';
    }

    _isSubForm(layoutItem) {
				return layoutItem.subForm === true;
    }

    _isModifiedAfter(layoutItem) {
				return this.dataProvider && this.dataProvider.isModifiedAfter && this.dataProvider.isModifiedAfter(layoutItem.name) || false;
    }

    _wasModified(layoutItem) {
				return this.dataProvider && this.dataProvider.wasModified && this.dataProvider.wasModified(layoutItem.name) || false;
    }

    _lastModified(layoutItem) {
				return this.dataProvider && this.dataProvider.latestModification && this.dataProvider.latestModification(layoutItem.name) || "0";
    }

    loadDataMap() {
				console.log("Form ready");
    }

    editForm() {
				this.dataProvider.editForm && this.dataProvider.editForm();
    }

    _deleteSubForm(e, detail) {
				e.stopPropagation();
				const layoutItem = Polymer.dom(this.root).querySelector('#layoutitems-repeat').itemForElement(e.target);
				this.dataProvider.deleteSubForm && this.dataProvider.deleteSubForm(layoutItem.name, detail.id, detail.index);
    }

    _addSubForm(e, detail) {
				e.stopPropagation();
				const layoutItem = Polymer.dom(this.root).querySelector('#layoutitems-repeat').itemForElement(e.target);
				this.dataProvider.addSubForm && this.dataProvider.addSubForm(layoutItem.name, detail.guid);
    }

    _tokenDataSource(d) {
				return d && { filter: (text, uuid) => this.dataProvider && this.dataProvider.filter && this.dataProvider.filter(d.editor.dataSource || d.codeTypes && { source: "codes", types: d.codeTypes }, text, uuid) || Promise.resolve([]) } || null;
    }

    _popupDataSource(d, options) {
        const ds = d.editor.dataSource || d.codeTypes && { source: "codes", types: d.codeTypes }
				const uuid = this.api.crypto().randomUuid()
				return d && (d.codeTypes && d.codeTypes.length || d.editor.dataSource) ? { filter: text => this.dataProvider && this.dataProvider.filter && this.dataProvider.filter(ds, text, uuid, null) || Promise.resolve([]), get: id => this.dataProvider && this.dataProvider.filter && this.dataProvider.filter(ds, null, uuid, id) || Promise.resolve(null), isProvided : ()=>true } : null;
    }

    toggleReportsList() {
        this.reportsListDisplayed = !this.reportsListDisplayed
    }

    newReport() {
        this.dispatchEvent(new CustomEvent('new-report', {detail: {dataProvider: this.dataProvider}, composed: true, bubbles: true}));
    }

    printSubForm() {
        this.dispatchEvent(new CustomEvent('print-subform', {detail: {dataProvider: this.dataProvider}, composed: true, bubbles: true}));
    }

    _none(a,b) {
        return !a && !b
    }

    _linkToSubcontactType(e){
				if(e.detail){
            this.dispatchEvent(new CustomEvent('subcontact-type-change', {detail: { type: e.detail, formId: this.dataProvider.getId()}}));
				}
    }

    _shouldDisplayPrintSubFormIcon(isSubForm, template) {
        return template && ["FFFFFFFF-FFFF-FFFF-FFFF-INCAPACITY00","AEFED10A-9A72-4B40-981B-1D79ADB05516","64DAB551-B007-4B5C-BD64-F886301F5326","B4F2B274-10FF-4018-BC48-3ED3CADCED57","ebab275a-c0e7-4f4f-9cc6-2620deb55d33"].includes(template.guid) &&
            _.get(template, "sections", false) && Array.isArray(template.sections) && template.sections.length &&
            _.size(_.head(_.filter( _.get(template, "sections[0].formColumns[0].formDataList", {}), {type:"TKAction"})))
    }

    _getReportTrad(reportName){
        return reportName && reportName === "Report" ? this.localize('out-doc', 'Outgoing document', this.language) : reportName
    }

    _callRadioGroup(e) {
				this.dataProvider && this.dataProvider.radioButtonChecked && this.dataProvider.radioButtonChecked(e.detail.group, e.detail.name);
    }

    _isExcluded(he){
				return _.get(he, 'tags', []).find(t => t.type === "CD-CERTAINTY" && t.code === "excluded") ? "exclude" : null
    }

    _shouldDisplayEMediattest(templateGuid) {
        // For incapacity subform -> allow to send via eMediattest / Medex
        return _.trim(templateGuid) === "FFFFFFFF-FFFF-FFFF-FFFF-INCAPACITY00"
    }

    _eMediattest(e) {
        this.dispatchEvent(new CustomEvent("send-sub-form-via-emediattest", { composed: true, bubbles: true, detail: { parentFormDp:this.parentFormDp, subFormDp:this.dataProvider } }))
    }

}

customElements.define(DynamicForm.is, DynamicForm);
