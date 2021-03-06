import './elements/icc-api/icc-api.js';
import './styles/shared-styles.js';
import './styles/scrollbar-style.js';
import './elements/ht-spinner/ht-spinner.js';
import './styles/dialog-style.js';
import moment from 'moment/src/moment';
import _ from 'lodash/lodash';

import "@polymer/iron-icon/iron-icon"
import "@polymer/paper-button/paper-button"
import "@polymer/paper-dialog/paper-dialog"

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "./elements/tk-localizer";
class HtUpdateDialog extends TkLocalizerMixin(PolymerElement)  {
  static get template() {
    return html`
        <style include="shared-styles scrollbar-style dialog-style">
            :host {
                display: block;
                height: calc(100% - 20px);
                /*padding: 10px;*/
            }

            .modal-title{
                justify-content: flex-start;
            }

            .modal-title iron-icon {
                margin-right: 8px;
            }

            .modalDialog{
                height: 75%;
                width: 1024px;
            }

            .content {
                padding: 0 12px;
            }

            .modalDialogContent{
                height: calc(100% - 150px);
                width: auto;
                margin: 10px;
                overflow: auto;
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

            .loadingContainer{
                position:absolute;
                width: 100%;
                height: 100%;
                top: 0;left: 0;
                background-color: rgba(0,0,0,.3);
                z-index: 10;
                text-align: center;
            }

            .versionTitle{
                height: 24px;
                width: auto;
                font-size: 20px;
                color: var(--app-secondary-color);
                border-bottom: 1px solid var(--app-secondary-color);
                margin-top: 20px;
                margin-bottom: 10px;
            }

            .newsTitle{
                height: 24px;
                width: auto;
                font-size: 20px;
                color: var(--app-secondary-color);
                border-bottom: 1px solid var(--app-secondary-color);
                margin-top: 20px;
                margin-bottom: 10px;
            }

            .moduleTitle{
                height: 15px;
                width: auto;
            }

            .blockUpdate{
                height: auto;
                width: auto;
                margin: 1%;
            }

            .blockNews{
                height: auto;
                width: auto;
                margin: 1%;
            }

            .releaseNoteTitle{
                display: block;
                font-weight:bold;
            }

            ol li{
                padding-left: 10px;
                margin-bottom: 5px;
            }

            .newsContent{
                height: auto;
                width: auto;
                margin: 1%;
            }

        </style>

        <template is="dom-if" if="[[_bodyOverlay]]">
            <div class="loadingContainer"></div>
        </template>

        <paper-dialog class="modalDialog" id="updateMessageDialog" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
            <h2 class="modal-title"><iron-icon icon="icons:speaker-notes"></iron-icon> [[localize('upd-info','Informations',language)]]</h2>
            <div class="content">

                <template is="dom-repeat" items="[[displayedUpdate]]" as="news">
                    <template is="dom-if" if="[[_isNews(news)]]">
                        <div class="blockNews">
                            <div class="newsTitle bold">
                                [[news.mainTitle]]
                            </div>
                            <div class="newsContent">
                                <template is="dom-repeat" items="[[news.modules]]" as="module">
                                    <div inner-h-t-m-l="[[_localizeContent(module.description)]]"></div>
                                </template>
                            </div>
                        </div>
                    </template>
                    <template is="dom-if" if="[[_isUpdate(news)]]">
                        <div class="blockUpdate">
                            <div class="versionTitle bold">
                                Version: [[news.version]]
                            </div>
                            <ol>
                                <template is="dom-repeat" items="[[news.modules]]" as="module">
                                    <li>
                                        <span class="releaseNoteTitle">[[_localizeContent(module.areaCode)]] - [[_localizeContent(module.title)]]</span>
                                        [[_localizeContent(module.description)]]
                                    </li>
                                </template>
                            </ol>
                            <template is="dom-if" if="_isLink(news)">
                                <div>
                                    Plus d'infos, cliquez <a href="[[news.mainLink]]" target="_blank"> ici</a>.
                                </div>
                            </template>
                        </div>
                    </template>
                </template>

            </div>
            <div class="buttons">
                <paper-button class="button" on-tap="_confirmUpdate">[[localize('clo','Close',language)]]</paper-button>
                <paper-button class="button button--other" on-tap="_closeDialog"><iron-icon icon="check-circle"></iron-icon> [[localize('read-later','Read later',language)]]</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-update-dialog';
  }

  static get properties() {
      return {
          api: {
              type: Object,
              noReset: true
          },
          user: {
              type: Object
          },
          _bodyOverlay: {
              type: Boolean,
              value: false
          },
          updateVersion:{
              type: String,
              value: ""
          },
          updates: {
              type: Object,
              value: function () {
                  return require('../updates.json');
              }
          },
          displayedUpdate:{
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

  ready() {
      super.ready();
  }

  _openDialog(){
      this.set('displayedUpdate', _.orderBy(this.updates.updates.filter(u => moment().isBetween(u.startDate, u.endDate) === true), ['startDate'], ['desc']))
      const dateOfNewUpdate = _.get(this, 'displayedUpdate[0].updateDate', moment().format('YYYY-MM-DD'))

      if((localStorage && !localStorage.getItem('last_update_confirm')) || (localStorage && localStorage.getItem('last_update_confirm') && (moment(localStorage.getItem('last_update_confirm')).format("YYYY-MM-DD") < moment(dateOfNewUpdate).format("YYYY-MM-DD")))){
          this.set('_bodyOverlay', true)
          this.$['updateMessageDialog'].open()
      }

  }

  _closeDialog(){
      this.set('_bodyOverlay', false)
      this.$['updateMessageDialog'].close()
  }


  _localizeContent(content){
      return content && content[this.language] ? content[this.language] : null
  }

  _confirmUpdate(){
      localStorage.setItem('last_update_confirm', _.get(this, 'displayedUpdate[0].updateDate', moment().format('YYYY-MM-DD')))
      this.set('_bodyOverlay', false)
      this.$['updateMessageDialog'].close()
  }

  _isNews(news){
      return news && news.mainType && news.mainType === "News" ? true : false
  }

  _isUpdate(news){
      return news && news.mainType && news.mainType === "Update" ? true : false
  }

  _isLink(news){
      return news && news.mainLink ? true : false
  }
}

customElements.define(HtUpdateDialog.is, HtUpdateDialog);
