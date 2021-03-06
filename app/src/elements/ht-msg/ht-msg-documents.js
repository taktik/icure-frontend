/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import '../dynamic-form/ckmeans-grouping.js';

import "@polymer/iron-icon/iron-icon"
import "@polymer/paper-button/paper-button"
import "@polymer/paper-dialog/paper-dialog"
import "@polymer/paper-icon-button/paper-icon-button"
import "@polymer/paper-tooltip/paper-tooltip"
import "@vaadin/vaadin-combo-box/vaadin-combo-box"
import "@vaadin/vaadin-grid/vaadin-grid"
import "@vaadin/vaadin-grid/vaadin-grid-column"
import "@vaadin/vaadin-grid/vaadin-grid-sorter"

import '../ht-spinner/ht-spinner'
import './ht-msg-import-doc-dialog'
import '../../styles/buttons-style'
import '../../styles/dialog-style'
import moment from 'moment/src/moment';
import _ from 'lodash/lodash';

import {PolymerElement, html} from '@polymer/polymer'
import {TkLocalizerMixin} from "../tk-localizer"

class HtMsgDocuments extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <custom-style>
            <style include="shared-styles buttons-style dialog-style">

                :host {
                    display: flex;
                    flex-direction: column;
                    z-index: 0;
                }

                :host *:focus {
                    outline: 0 !important;
                }

                #documentTypeFilter {
                    margin: 0 auto;
                    display: flex;
                    flex-flow: row wrap;
                    align-items: flex-end;
                }

                #documentTypeFilterCombo {
                    width:320px;
                }

                #documentTypeFilter hr {
                    margin: 5px 10px;
                    border: 0;
                    border-top: 1px dashed #aaaaaa;
                }

                .new-doc-btn {
                    margin: 5px 0 0 10px;
                    box-sizing: border-box;
                    --paper-button-ink-color: var(--app-secondary-color);
                    height: 40px !important;
                    display: block;
                    text-align: center;
                    --paper-button: {
                        background: var(--app-secondary-color);
                        color: var(--app-text-color);
                        width: calc(100% - 48px);
                        margin: 0 auto;
                        font-size: 14px;
                        font-weight: bold;
                        text-transform: capitalize;
                    };
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    max-width: 250px;
                    text-transform: uppercase;
                    font-weight: 700;
                }

                .table-top {
                    width: calc(100vw - 38%);
                    min-height: 56px;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                    padding-top: 5px;
                }

                .table-top > .checkbox {
                    width: 16px;
                    margin-left: 20px;
                    display: flex;
                    justify-content: space-around;
                    padding-left: 12px;
                    flex-direction: column;
                }

                .table-top > div {
                    display: flex;
                    flex-direction: row;
                    z-index: 1;
                }

                .table-top > div > div {
                    text-align: center;
                }

                .table-top > div.indicators {
                    justify-content: flex-end;
                    padding-right: 24px;
                }

                .table-top > div.indicators > div {
                    display: flex;
                    flex-direction: column;
                    padding: 8px;
                    justify-content: center;
                }

                .table-top > div.indicators > div > * {
                    margin: 0 auto;
                }

                .table-top > div.indicators > div#stamp-indicator.hasNew span {
                    color: var(--app-error-color);
                }

                .table-top > div.indicators > div#capacity-indicator > * {
                    display: inline-block;
                }

                .table-top > div.actions {
                    flex-grow: 1;
                    margin: 0 12px 12px;
                    align-items: flex-end;
                }

                .table-top paper-dropdown-menu#filterLabresult {
                    min-width: 256px;
                    margin-left: 22%;
                }

                .table-top > div.actions paper-icon-button {
                    margin: 0;
                    height: 28px;
                    width: 28px;
                    padding: 4px;
                    box-sizing: border-box;
                }

                #loadingContainer, #loadingContainerSmall {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    background-color: rgba(0, 0, 0, .3);
                    z-index: 10;
                    text-align: center;
                }

                #loadingContentContainer, #loadingContentContainerSmall {
                    position: relative;
                    width: 400px;
                    min-height: 200px;
                    background-color: #ffffff;
                    padding: 20px;
                    border: 3px solid var(--app-secondary-color);
                    margin: 40px auto 0 auto;
                    text-align: center;
                }

                .modalDialog {
                    height: 300px;
                    width: 600px;
                }

                .modalDialogContent {
                    height: 250px;
                    width: auto;
                    margin: 10px;
                }

                .bold {
                    font-weight: 700;
                }

                .sub-container {
                    position: relative;
                }

                .loadingIcon {
                    margin-right: 5px;
                }

                .loadingIcon.done {
                    color: var(--app-secondary-color);
                }

                .mr5 {
                    margin-right: 5px
                }

                .smallIcon {
                    width: 16px;
                    height: 16px;
                }

                .m-t-40 {
                    margin-top: 40px;
                }

                .m-t-50 {
                    margin-top: 50px !important;
                }

                .m-t-20 {
                    margin-top: 20px !important;
                }

                .m-t-25 {
                    margin-top: 25px !important;
                }

                .textAlignCenter {
                    text-align: center;
                }

                .dialogButtons {
                    position: absolute;
                    bottom: 40px;
                    margin: 0;
                    width: 100%;
                    text-align: center;
                }

                #documentsGrid {
                    padding-right: 0;
                    margin-right: 0;
                    flex-grow: 1;
                    margin-bottom: 16px;
                    transition: opacity .25s ease;
                }

                #documentsGrid iron-icon {
                    color: var(--app-text-color);
                    height: 18px;
                    width: 18px;
                    padding: 4px;
                }

                .col-right {
                    position: relative;
                    box-sizing: border-box;
                    grid-column: 2 / span 1;
                    grid-row: 1 / span 1;
                    background: var(--app-background-color);
                    float: left;
                    padding: 12px 20px;
                    padding-top: 0;
                    display: flex;
                    flex-flow: column nowrap;
                    align-items: flex-start;
                    height: calc(100% - 56px);
                    width: calc(100vw - 38%)
                }

                vaadin-grid {
                    height: calc(100% - 16px - 32px - 50px);
                    width: 100%;
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
                        background-color: var(--paper-grey-200);
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
                    padding-right: 8px;
                }

                vaadin-grid.material .cell.last {
                    padding-right: 8px;
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
                    background: red;
                }

                div.bottom-commands {
                    display: flex;
                    width: 100%;
                    justify-content: flex-end;
                    align-items: center;
                }

                div.bottom-commands > div.grid-size-indicator {
                    max-width: 208px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    color: var(--app-text-color);
                    font-size: 13px;
                    font-weight: 400;
                    letter-spacing: 0.3px;
                }

                .scroll-top {
                    background: var(--app-secondary-color);
                    padding: 0 4px;
                    height: 24px;
                    width: 24px;
                    box-sizing: border-box;
                    border-radius: 50%;
                }
            </style>
        </custom-style>

        <template is="dom-if" if="[[_bodyOverlay]]">
            <div id="loadingContainer"></div>
        </template>
        <template is="dom-if" if="[[_isLoading]]">
            <div id="loadingContainer">
                <div id="loadingContentContainer">
                    <div style="max-width:100px; margin:0 auto">
                        <ht-spinner class="spinner" alt="Loading..." active=""></ht-spinner>
                    </div>
                    <div id="loadingContent"></div>
                </div>
            </div>
        </template>
        <template is="dom-if" if="[[menuSelectionObject.selection.folder]]">
            <div class="table-top">
                <div class="actions">
                    <paper-icon-button id="refresh-button" icon="icons:refresh" on-tap="_refresh" disabled="[[!refreshAllowed]]"></paper-icon-button>
                    <paper-tooltip for="refresh-button" offset="2">[[localize('refresh','Refresh',language)]]
                    </paper-tooltip>
                    <paper-button id="new-doc-btn" class="button button--save" on-tap="_openUploadDialog">
                        [[localize('newIncomingDoc', 'New incoming document', language)]]
                    </paper-button>
                    <div id="documentTypeFilter">
                        <vaadin-combo-box id="documentTypeFilterCombo" items="[[listType]]" item-label-path="name" item-value-path="code" label="[[localize('type-doc','Type de document',language)]]" value="{{_documentTypeFilter}}">
                        </vaadin-combo-box>
                    </div>
                </div>
            </div>

            <div class="second-panel col-right">
                <vaadin-grid id="documentsGrid" class="material" multi-sort="[[multiSort]]" active-item="{{activeItem}}" items="[[messages]]" on-tap="_documentTapped" selection-mode="multi" width="100%" pagesize="[[_pageSize]]">
                    <vaadin-grid-column flex-grow="1">
                        <template class="header">
                            <vaadin-grid-sorter path="metas.filename">[[localize('title','Title',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class\$="cell [[_boldIfIsUnread(item)]]">[[item.subject]]</div>
                            <!--
                            <div class\$="cell [[_boldIfIsUnread(item)]]">
                                <template is="dom-repeat" items="[[item.metas.documentList]]" as="document">
                                    <p>
                                    <div class="document">
                                        <div class="document-title">[[document.type]]: [[document.filename]]</div>
                                    </div>
                                    </p>
                                </template>
                            </div>
                            -->
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="1">
                        <template class="header">
                            <vaadin-grid-sorter path="metas.importDate" direction="asc">[[localize('import_date','Import
                                Date',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class\$="cell [[_boldIfIsUnread(item)]]">[[_formatDate(item.metas.importDate)]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="1">
                        <template class="header">
                            <vaadin-grid-sorter path="metas.documentDate" direction="asc">
                                [[localize('doc_date','Date',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class\$="cell [[_boldIfIsUnread(item)]]">[[_formatDate(item.metas.documentDate)]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="1">
                        <template class="header">
                            <vaadin-grid-sorter path="hcp"><b>[[localize('hcp','Médecin',language)]]</b>
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class\$="cell [[_boldIfIsUnread(item)]]">[[item.hcp]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="1" hidden="[[_hidePatients]]">
                        <template class="header">[[localize('pat','Patient',language)]]</template>
                        <template>
                            <div class\$="cell [[_boldIfIsUnread(item)]]">[[item.patientName]]</div>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
                <div class="bottom-commands">
                    <div class="grid-size-indicator hideOnMobile"> [[pageStart]] – [[pageEnd]]
                        [[localize('sur','sur',language)]] [[_totalMessagesForCurrentFolderAndCurrentFilter]]
                    </div>
                    <paper-icon-button id="previous-page-change" icon="chevron-left" class="change-page" on-tap="_gotoPreviousGridPage"></paper-icon-button>
                    <paper-icon-button id="next-page-change" icon="chevron-right" class="change-page" on-tap="_gotoNextGridPage"></paper-icon-button>
                    <!--                    <div class="hideOnMobile"><paper-icon-button id="scrolltop" class="scroll-top" icon="arrow-upward" on-tap="_scrollToTop"></paper-icon-button></div>-->
                </div>
            </div>
        </template>
        <paper-dialog class="modalDialog" id="confirmPermanentDeletionDialog" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
            <h2 class="modal-title">
                <iron-icon icon="icons:warning"></iron-icon>
                [[localize('warning','Warning',language)]]
            </h2>
            <div class="content">
                <h3 class="textAlignCenter">[[localize('confirmDeletePermanently','Are you sure you wish to delete
                    PERMANENTLY ?',language)]]</h3>
                <p class="textAlignCenter m-t-20">[[localize('cantBeUndone',"This can't be undone",language)]].</p>
            </div>
            <div class="buttons">
                <paper-button class="button" on-tap="_closeDialogs">
                    [[localize('can','Cancel',language)]]
                </paper-button>
                <paper-button class="button button--save" on-tap="_deleteMessagesForEver">
                    <iron-icon icon="check-circle"></iron-icon>
                    [[localize('confirm','Confirm',language)]]
                </paper-button>
            </div>
        </paper-dialog>
        <paper-dialog class="modalDialog" id="errorMessageBox" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
            <h2 class="modal-title">
                <iron-icon icon="icons:warning"></iron-icon>
                [[localize('warning','Warning',language)]]
            </h2>
            <div class="content">
                <h3 class="textAlignCenter">
                    [[errorTitle]]
                </h3>
                <p class="textAlignCenter m-t-20">
                    [[errorMessage]]
                </p>
            </div>
            <div class="buttons">
                <paper-button class="button" on-tap="_closeDialogs">
                    <iron-icon icon="icons:close"></iron-icon>
                    [[localize('clo','Close',language)]]
                </paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-msg-documents';
  }

  static get properties() {
      return {
          api: {
              type: Object,
              noReset: true
          },
          user: {
              type: Object,
              noReset: true
          },
          menuSelectionObject: {
              type: Object
          },
          _bodyOverlay: {
              type: Boolean,
              value: false
          },
          _loadingMessages: {
              type: Array,
              value: () => []
          },
          _isLoading: {
              type: Boolean,
              value: false,
              observer: '_loadingStatusChanged'
          },
          _importedDocumentType: {
              type: Array,
              notify: false,
              value: ['SCAN', 'IMPORT', 'HUB']
          },
          _hidePatients: {
              type: Boolean,
              value: false
          },
          hcpMap: {
              type: Object,
              notify: false,
              value: () => new Map()
          },
          msgMap: {
              type: Object,
              notify: false,
              value: () => new Map()
          },
          msgIds: {
              type: Array,
              notify: false,
              value: []
          },
          msgExtras: {
              type: Array,
              notify: false,
              value: []
          },
          activeItem: {
              type: Object,
              value: null
          },
          messages: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          errorTitle: {
              type: String,
              value: ""
          },
          errorMessage: {
              type: String,
              value: ""
          },
          _pageSize: {
              type: Number,
              value: 50
          },
          _lastFolder: {
              type: String,
              value: ""
          },
          _totalMessagesForCurrentFolderAndCurrentFilter: {
              type: Number,
              value: 0
          },
          _totalPagesForCurrentFolderAndCurrentFilter: {
              type: Number,
              value: 1
          },
          pageStart: {
              type: Number,
              value: 0
          },
          pageEnd: {
              type: Number,
              value: 50
          },
          listType: {
              type: Array,
              value: () => []
          },
          _documentTypeFilter: {
              type: String,
              value: ""
          },

      };
  }

  constructor() {
      super();
  }

  static get observers() {
      return [
          '_refresh(menuSelectionObject,menuSelectionObject.*, _currentPageNumber, _documentTypeFilter)',
          'apiReady(api,user,opened)',
      ];
  }

  ready() {
      super.ready();
  }

  apiReady() {
      this.api && this.api.isElectronAvailable().then(electron => this.set("hasElectron", electron)).catch(error => console.log(error));
      return !!_.size(_.get(this,"listType",[])) ? null : this.api.getDocumentTypes(this.resources, this.language).then(documentTypes => this.set("listType", documentTypes))
  }

  _loadingStatusChanged() {
      if (!this._isLoading) this._resetLoadingMessage();
  }

  _resetLoadingMessage() {
      this._loadingMessages = [];
  }

  _setLoadingMessage(messageData) {
      setTimeout(() => {
          if (messageData.updateLastMessage) this._loadingMessages.pop();
          this._loadingMessages.push(messageData);
          let loadingContentTarget = this.shadowRoot.querySelectorAll('#loadingContent')[0];
          if (loadingContentTarget) {
              loadingContentTarget.innerHTML = '';
              _.each(this._loadingMessages, (v) => {
                  loadingContentTarget.innerHTML += "<p><iron-icon icon='" + v.icon + "' class='" + (v.done ? "loadingIcon done" : "loadingIcon") + "'></iron-icon>" + v.message + "</p>";
              });
          }
      }, 100)
  }

  _formatDate(date) {
      let moment = this.api.moment(date);
      return moment ? moment.format('DD/MM/YYYY') : date;
  }

  _closeDialogs() {
      this.set("_bodyOverlay", false);
      _.map(this.shadowRoot.querySelectorAll('.modalDialog'), i => i && typeof i.close === "function" && i.close())
  }

  _isEqual(a, b) {
      return !!(a === b)
  }

  _clearGridCache() {
      const messageGrid = this.shadowRoot.querySelector('#documentsGrid');
      messageGrid && messageGrid.clearCache();
  }

  _resetGridSelectedItems() {
      const messageGrid = this.shadowRoot.querySelector('#documentsGrid');
      messageGrid.selectedItems = []
      // this.set('_haveGridSelectedMessages',false)
  }

  _triggerGridResize() {
      const grid = this.shadowRoot.querySelector('#documentsGrid')
      return grid && grid.notifyResize()
  }

  _scrollToTop() {
      const grid = this.shadowRoot.querySelector('#documentsGrid')
      return grid && setTimeout(() => {
          grid._scrollToIndex(0);
      }, 250)
  }

  _gotoPreviousGridPage() {
      let currentPageNumber = parseInt(this.get("_currentPageNumber")) || 1;
      if (currentPageNumber > 1) this.set('_currentPageNumber', currentPageNumber - 1)
  }

  _gotoNextGridPage() {
      let currentPageNumber = parseInt(this.get("_currentPageNumber")) || 1;
      let totalPages = parseInt(this.get("_totalPagesForCurrentFolderAndCurrentFilter")) || 1;
      if (currentPageNumber < totalPages) this.set('_currentPageNumber', currentPageNumber + 1)
  }

  // _filterType(message, documentType) {
  //     if (!documentType) return true;
  //     if (!message.metas && !message.metas.type) return false;
  //     if (!this.listType.filter(item => item.code === documentType)) return false;
  //     return message.metas.type === documentType;
  // }
  _filterType(message, documentType) {
      if (!documentType) return true;
      if (!message.metas && !message.metas.documentList) return false;
      if (!this.listType.filter(item => item.code === documentType)) return false;
      return message.metas.documentList.some(doc => doc.type === documentType);
  }

  _getMessages(currentFolder, documentFilter) {
      if (!currentFolder) return Promise.resolve(null);

      this.set('page', 1);
      let foundMessages = [];

      this.api.setPreventLogging();

      return !currentFolder ? foundMessages : Promise.all(this._importedDocumentType.map(importedDocumentType => this.api.message().findMessagesByTransportGuid('DOC:' + importedDocumentType + ':IN', null, null, null, 1000)
          .then(messages => messages.rows.filter(message => message.metas).map(message => {
              if (message.metas.documentListJson) {
                  message.metas.documentList = JSON.parse(message.metas.documentListJson);
              } else {
                  message.metas.documentList = [{filename: message.metas.filename, type: message.metas.type}];
              }
              return message;
          }))
          .then(messages => messages.filter(m => (currentFolder === 'todealwith' ? this._toDealWith(m) : !this._toDealWith(m)) && this._filterType(m, documentFilter)))
          .then(messages => Promise.all(messages.map(m => this._getCachedDecryptedBlobs(m))))
          .then(messages => {
              // console.log('got complete list');
              return _.orderBy(messages, ['created', 'transportGuid'], ['desc', 'desc'])
          })
      ))
          .then(messagesByType => _.flatten(messagesByType))
          .then(messages => foundMessages = _.compact(messages || []))
          .catch(e => {
              console.log(e);
              return []
          })
          .finally(() =>{
              this.api.setPreventLogging(false);
              return foundMessages
          })
  }

  _getCachedDecryptedBlobs(message) {
      let msgExtra = this.msgExtras.find(d => d.key === message.metas.cryptedInfo);
      if (msgExtra && msgExtra.data) {
          _.merge(message, msgExtra.data);
          return Promise.resolve(message);
      } else {
          msgExtra = {};
          msgExtra['key'] = message.metas.cryptedInfo;
          msgExtra['data'] = {};
          return this._getCachedHcp(message.fromHealthcarePartyId)
              .then(name => message['hcp'] = name)
              .then(() => this.decryptInfo(message))
              .then(data => {
                  if (data && data.patientId) {
                      return this.api.patient().getPatientWithUser(this.user, data.patientId)
                          .then(patient => {
                              data['patientId'] = patient.id;
                              data['patientName'] = patient.firstName + " " + patient.lastName;
                              data['patientSsin'] = patient.ssin;
                              // console.log('_getCachedDecryptedBlobs -> Patient: ', data['patientId'] + ' - ' + data['patientName'] + ' (' + data['patientSsin'] + ')');
                              msgExtra.data = data;
                              this.msgExtras.push(msgExtra);
                              _.merge(message, msgExtra.data);
                              return message;
                          })
                  }
                  return message;
              })
              .catch(e => {
                  console.log(e);
                  return message;
              });
      }
  }

  _getCachedMessageSimple(message) {
      if (this.msgIds.includes(message.id)) {
          return Promise.resolve(message);
      } else {
          return this._getCachedHcp(message.fromHealthcarePartyId)
              .then(name => {
                  message['hcp'] = name;
                  return message;
              })
              .then(message => this.decryptInfo(message))
              .then(message => {
                  if (!message.patientId)
                      return message;
                  else {
                      return this.api.patient().getPatientWithUser(this.user, message.patientId)
                          .then(patient => {
                              message['patientName'] = patient.firstName + " " + patient.lastName;
                              message['patientSsin'] = patient.ssin;
                              // console.log('_getCachedMessage -> Patient: ', message['patientId'] + ' - ' + message['patientName'] + ' (' + message['patientSsin'] + ')');
                              this.msgIds.push(message.id);
                              return message;
                          })
                  }
              })
              .catch(e => {
                  console.log(e);
                  return message;
              });
      }
  }

  _getCachedMessage(message) {
      let prom = this.msgMap.get(message.id);
      if (prom === undefined) {
          prom = this._getCachedHcp(message.fromHealthcarePartyId)
              .then(name => {
                  message['hcp'] = name;
                  return message;
              })
              .then(message => this.decryptInfo(message))
              .then(message => {
                  if (!message.patientId)
                      return message;
                  else {
                      return this.api.patient().getPatientWithUser(this.user, message.patientId)
                          .then(patient => {
                              message['patientName'] = patient.firstName + " " + patient.lastName;
                              message['patientSsin'] = patient.ssin;
                              // console.log('_getCachedMessage -> Patient: ', message['patientId'] + ' - ' + message['patientName'] + ' (' + message['patientSsin'] + ')');
                              return message;
                          })
                  }
              })
              .catch(e => {
                  console.log(e);
                  return message;
              });
          this.msgMap.set(message.id, prom);
      }
      return prom;
  }

  _discardCachedMessage(message) {
      return new Promise((resolve) => {
          this.msgMap.delete(message.id);
          let index = this.msgIds.indexOf(message.id);
          if (index > -1)
              this.msgIds.splice(index, 1);
          // console.log('Discarded message: ', message);
          resolve();
      });
  }

  _getCachedHcp(hcpId) {
      let prom = this.hcpMap.get(hcpId);
      if (prom === undefined) {
          prom = this.api.hcparty().getHealthcareParty(hcpId)
              .then(hcp => {
                  return hcp.firstName + ' ' + hcp.lastName;
              });
          this.hcpMap.set(hcpId, prom);
      }
      return prom;
  }

  _documentTapped(e) {
      if (_.get(e, "path[0].nodeName", "") === 'TABLE') return;
      let selectedMessage = _.get(this, "activeItem", null);
      if (selectedMessage) {
          return new Promise((resolve) => {
              if (this._isUnread(selectedMessage) && selectedMessage.recipients && selectedMessage.recipients[0] && this.user.healthcarePartyId === selectedMessage.recipients[0]) {
                  selectedMessage.status = (selectedMessage.status & ~(1 << 1));
                  selectedMessage.metas && selectedMessage.metas.documentList && delete selectedMessage.metas.documentList;
                  this.set("activeItem.status", selectedMessage.status);
                  this._clearGridCache();
                  return this.api.message().modifyMessage(selectedMessage)
                      .then(() => resolve(selectedMessage))
              } else {
                  resolve(selectedMessage);
              }
          })
              .then((msg) => this.dispatchEvent(new CustomEvent('selection-messages-change', {
                  detail: {
                      selection: {
                          item: msg,
                          patientId: msg.patientId
                      }
                  }
              })));
      } else {
          this.dispatchEvent(new CustomEvent('selection-messages-change', {detail: {selection: {item: null}}}));
      }
  }

  _isUnread(m) {
      return ((m.status & (1 << 1)) !== 0)
  }

  _boldIfIsUnread(m) {
      return this._isUnread(m) ? "bold" : "";
  }

  _toDealWith(m) {
      return !!((m.status & (1 << 26)) === 0)
  }

  _initializeCounter(folder) {
      this._getMessages(folder, "")
          .then(foundMessages => {
              let messageCount = foundMessages.length;
              this.dispatchEvent(new CustomEvent('initialize-doc-counter', {
                  bubbles: true,
                  composed: true,
                  detail: { folder: folder, count: messageCount} }));
          })
          .catch(e => {
              console.log(e);
          });
  }

  _promiseCounter(folder) {
      return new Promise(() => this._initializeCounter(folder));
  }


  _initializeCounters() {
      //this._initializeCounter("todealwith");
      //this._initializeCounter("dealtwith");
      this._promiseCounter("todealwith")
          .then(this._promiseCounter("dealtwith"));
  }

  _refresh() {
      if (this.menuSelectionObject && this.menuSelectionObject.selection) {
          this._resetLoadingMessage();
          this.set('_isLoading', true);
          this._setLoadingMessage({
              message: this.localize('ehb.gettingMessages', this.language),
              icon: "arrow-forward"
          });

          this._initializeCounters();

          let currentPageNumber = parseInt(this.get("_currentPageNumber")) || 1;
          const currentFolder = _.trim(this.get("menuSelectionObject.selection.folder")) || "todealwith";
          this.set("_hidePatients", currentFolder === "todealwith");
          if (currentFolder !== this._lastFolder) {
              if (currentPageNumber > 1) {
                  currentPageNumber = 1;
                  this.set("_currentPageNumber", currentPageNumber);
              }
              this.set("_documentTypeFilter", "");
              // const typeList = this.shadowRoot.querySelector("#documentTypeFilterCombo");
              // typeList.selectedItem = "";
          }
          this.set("_lastFolder", currentFolder);
          const documentFilter = _.trim(this.get("_documentTypeFilter")) || "";
          const maxItemsPerPage = parseInt(this._pageSize);
          const pageStart = (currentPageNumber - 1 || 0) * maxItemsPerPage;
          const pageEnd = (currentPageNumber || 1) * maxItemsPerPage;

          this._getMessages(currentFolder, documentFilter)
              .then(foundMessages => {
                  let messageCount = foundMessages.length;
                  this._clearGridCache();
                  this._resetGridSelectedItems();
                  this.set('pageStart', pageStart);
                  this.set('pageEnd', pageEnd);
                  this.set('_totalMessagesForCurrentFolderAndCurrentFilter', messageCount);
                  this.set('_totalPagesForCurrentFolderAndCurrentFilter', Math.ceil(messageCount / maxItemsPerPage));
                  this.set("messages", foundMessages.slice(pageStart, pageEnd));
              })
              .catch(e => {
                  console.log(e);
              })
              .finally(() => {
                  this._setLoadingMessage({
                      message: this.localize('ehb.gettingMessages_done', this.language),
                      icon: "check-circle",
                      updateLastMessage: true,
                      done: true
                  });
                  this.set('_isLoading', false);
                  this.dispatchEvent(new CustomEvent('selection-messages-change', {detail: {selection: {item: null}}}));
                  this.dispatchEvent(new CustomEvent("refresh-patient",{bubbles:true,composed:true}));
                  this._triggerGridResize()
              })

      } else {
          this.dispatchEvent(new CustomEvent('selection-messages-change', {detail: {selection: {item: null}}}));
          this.dispatchEvent(new CustomEvent("refresh-patient",{bubbles:true,composed:true}));
          this._triggerGridResize()
      }
  }

  encryptInfo(message, info) {
      if (!message.metas)
          return Promise.reject('Invalid message structure');
      try {
          return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, message, this.api.crypto().utils.ua2ArrayBuffer(this.api.crypto().utils.text2ua(JSON.stringify(info))))
              .then(encrypted => {
                  message.metas.cryptedInfo = btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
                  return message;
              })
      } catch (error) {
          return Promise.reject(error);
      }
  }

  decryptInfo2(message) {
      if (!message.metas)
          return Promise.reject('Invalid message structure');
      if (!message.metas.cryptedInfo)
          return Promise.resolve(null);
      try {
          return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("decrypt", this.user, message, new Uint8Array(this.api.crypto().utils.base64toArrayBuffer(message.metas.cryptedInfo)))
              .then(decrypted => JSON.parse(this.api.crypto().utils.ua2text(decrypted)))
              .then(secretInfo => {
                  if (secretInfo.length > 0) {
                      return secretInfo[0];
                  }
                  return null;
              });
      } catch (error) {
          return Promise.reject(error);
      }
  }

  decryptInfo(message) {
      if (!message.metas)
          return Promise.reject('Invalid message structure');
      if (!message.metas.cryptedInfo)
          return Promise.resolve(message);
      try {
          return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("decrypt", this.user, message, new Uint8Array(this.api.crypto().utils.base64toArrayBuffer(message.metas.cryptedInfo)))
              .then(decrypted => JSON.parse(this.api.crypto().utils.ua2text(decrypted)))
              .then(secretInfo => {
                  if (secretInfo.length > 0) {
                      _.merge(message, secretInfo[0])
                      // console.log('decryptInfo -> Message patient id: ', message.patientId);
                  }
                  return message;
              });
      } catch (error) {
          return Promise.reject(error);
      }
  }

  _encrypt(documentObject, object) {
      return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, documentObject, this.api.crypto().utils.ua2ArrayBuffer(this.api.crypto().utils.text2ua(object || "")))
          .then(ua => Base64.encode(this.api.crypto().utils.ua2text(ua)))
  }

  updateDoc(e) {
      if (!e.detail || !e.detail.selectedMessage || !e.detail.attachments || !e.detail.attachments.length) return;
      const selectedMessage = e.detail.selectedMessage;
      const attachments = e.detail.attachments;

      let documentList = [];
      let docDate = moment();
      if (selectedMessage.metas.documentDate)
          docDate = moment(selectedMessage.metas.documentDate);
      const docDateYMD = parseInt(docDate.format("YYYYMMDDHHmmss"));
      const docDateMs = parseInt(docDate.format("x")) || new Date().getTime();
      const docDateAsString = docDate.format("YYYY-MM-DD");

      this.api.message().getMessage(selectedMessage.id)
          .then(msg => new Promise(resolve => {
              msg.subject = selectedMessage.subject;
              msg.metas.documentDate = docDateAsString;
              if (selectedMessage.patientId) {
                  msg.status = msg.status ^ 1 << 26 | (selectedMessage.patientId ? 1 << 26 : 0);
                  return this.api.patient().getPatientWithUser(this.user, selectedMessage.patientId)
                      .then(patient => this.api.register(patient, "patient"))
                      .then(patient => this.api.contact().newInstance(this.user, patient, {
                              openingDate: docDateYMD,
                              closingDate: docDateYMD,
                              author: this.user.id,
                              responsible: this.user.healthcarePartyId,
                              subContacts: []
                          })
                      )
                      .then(contact => resolve(contact))
                  } else {
                      return resolve();
                  }
              })
              .then(contact => {
                  documentList = selectedMessage.metas && selectedMessage.metas.documentListJson && JSON.parse(selectedMessage.metas.documentListJson) || [];
                  return Promise.all(attachments.map(attachment => {
                      const item = documentList.find(item => item.id === attachment.documentId);
                      if (!item) return Promise.resolve();
                      return this.api.document().getDocument(item.id)
                          .then(document => {
                              document.name = attachment.filename || "";
                              document.documentType = attachment.type; // TODO: default value
                              return this._encrypt(document, attachment && attachment.comment || "")
                                  .then(cryptedComment => {
                                      item.comment = cryptedComment;
                                      if (!contact) return;
                                      const svc = this.api.contact().service().newInstance(this.user, {
                                          content: _.fromPairs([[this.language, {
                                              documentId: item.id,
                                              stringValue: attachment.filename
                                          }]]),
                                          created: docDateMs,
                                          tags: [{type: 'CD-TRANSACTION', code: attachment.type || 'report'}],
                                          label: 'imported document',
                                          comment: cryptedComment
                                      });

                                      if (contact.services === undefined) contact.services = [svc];
                                      else contact.services.push(svc);

                                      const sc = {status: 64, services: [{serviceId: svc.id}]};
                                      contact.subContacts.push(sc);
                                  })
                                  .then(() => document)
                          })
                          .then(document => this.api.document().modifyDocument(document))
                          .then(document => this.api.register(document, "document"))
                  }))
                  .then(() => contact)
              })
              .then(contact => {
                  if (!contact) return;
                  return this.api.contact().createContactWithUser(this.user, contact)
                      .then(contact => this.api.register(contact, "contact"))
                      .then(contact => this.encryptInfo(msg, [{
                          'patientId': selectedMessage.patientId,
                          'isAssigned': true,
                          'contactId': contact.id
                      }]))
              })
              .then(() => msg)
          )
          .then(msg => {
              msg.metas.documentListJson = JSON.stringify(documentList);
              return this.api.message().modifyMessage(msg);
          })
          .then(msg => this.api.register(msg, 'message'))
          .then(msg => this._discardCachedMessage(msg))
          .then(() => this._refresh())
          .catch(error => {
              this.dispatchEvent(new CustomEvent('show-error-message', {
                  detail: {
                      title: selectedMessage.subject || this.localize("error", "Error", this.language),
                      message: "err.document.update",
                      detail: error
                  }, bubbles: true
              }))
          })
  }

  unassignDoc(e) {
      if (!e.detail || !e.detail.selectedMessage) return;
      const selectedMessage = e.detail.selectedMessage;
      this.api.message().getMessage(selectedMessage.id)
          .then(message => {
              message.status = message.status ^ 1 << 26;
              const docIds = JSON.parse(message.metas.documentListJson).map(item => item.id);
              return this.api.contact().getContactWithUser(this.user, selectedMessage.contactId)
                  .then(contact => {
                      const servicesLeft = contact.services.filter(svc => !docIds.includes(svc.content[this.language].documentId));
                      if (servicesLeft.length === 0) {
                          contact.deletionDate = parseInt(moment().format('YYYYMMDDHHmmss'));
                      } else {
                          contact.services = servicesLeft;
                      }
                      return this.api.contact().modifyContactWithUser(this.user, contact);
                  })
                  .then(contact => this.api.register(contact, "contact"))
                  .then(() => message)
          })
          .then(message => this.encryptInfo(message, [{}]))
          .then(message => this.api.message().modifyMessage(message))
          .then(message => this.api.register(message, 'message'))
          .then(message => this._discardCachedMessage(message))
          .then(() => this._refresh())
          .catch((error) => this.dispatchEvent(new CustomEvent('show-error-message', {
              detail: {
                  title: e.detail.doc.filename,
                  message: "err.document.update",
                  detail: error
              }, bubbles: true
          })));
  }

  deleteDoc(e) {
      if (!e.detail || !e.detail.selectedMessage) return;
      this.api.message().getMessage(e.detail.selectedMessage.id)
          .then(message => this.api.message().deleteMessages(message.id)
              .then(message => this._discardCachedMessage(message))
          )
          .then(() => this._refresh())
          .catch((error) => this.dispatchEvent(new CustomEvent('show-error-message', {
              detail: {
                  title: e.detail.doc.filename,
                  message: "err.document.delete",
                  detail: error
              }, bubbles: true
          })));
  }

  _openUploadDialog() {
      this.dispatchEvent(new CustomEvent('open-upload-dialog', {bubbles: true}))
  }
}

customElements.define(HtMsgDocuments.is, HtMsgDocuments);
