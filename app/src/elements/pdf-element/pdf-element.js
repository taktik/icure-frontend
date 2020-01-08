import '../ht-spinner/ht-spinner.js';
import moment from 'moment/src/moment';
(function(window, undefined) {
  var Reader = function(el) {
    this.element = el;
    this.reader = Polymer.dom(el.root).querySelector('.pdf-viewer');
    this.viewportOut = this.reader.querySelector('.pdf-viewport-out');
    this.toolbar = this.reader.querySelector('.pdf-toolbar');
    this.toolbarHeight = this.toolbar.offsetHeight || 0;
    this.title = this.toolbar.querySelector('.title');
    this.enableTextSelection = el.enableTextSelection;
    this.fitWidth = el.fitWidth;
    this.fitHeight = el.fitHeight;
    this.HEIGHT = el.getAttribute('height');

    this.viewport = this.reader.querySelector('.pdf-viewport');

    if (this.enableTextSelection){
      this.textLayerDiv = this.reader.querySelector(".textLayer");
      this.textLayerDivStyle = this.textLayerDiv.style;
    }

    this.spinner = this.reader.querySelector(".spinner");
    this.totalPages = this.reader.querySelector('#totalPages');
    this.viewportStyle = this.viewport.style;
    this.viewportOutStyle = this.viewportOut.style;

    this.ctx = this.viewport.getContext('2d');

    this.SRC = el.src;

    // this.loadPDF();
    // this.renderPages();
    this.pageRendering = false;
    this.pageNumPending = null;

  };

  Reader.prototype.setSize = function(attrName, newVal) {

    this.WIDTH = this.viewportOut.offsetWidth;
    if (!this.HEIGHT)
      this.HEIGHT = this.viewportOut.offsetHeight;

    var width = this.WIDTH,
        height = this.HEIGHT;

    if (attrName === 'width') {
      width = newVal;
    }

    if (attrName === 'height') {
      height = newVal;
    }

    // this.element.style.width = this.reader.style.width = width + 'px';
    // this.element.style.height = this.reader.style.height = height + 'px';
    // this.element.style.height = this.reader.style.height = this.HEIGHT + 64 + 'px';

    // this.viewportOutStyle.width = width + 'px';
    if (!this.fitHeight) {
      this.viewportOutStyle.height = height + 'px';
    }

    this.spinner.style.top = (height - this.toolbarHeight) / 2 + 'px';
  };

  Reader.prototype.setSrc = function(src) {
    this.SRC = src;
  };

  Reader.prototype.setFitWidth = function(fitWidth) {
    this.fitWidth = fitWidth;
  };
  Reader.prototype.setFitHeight = function(fitHeight) {
    this.fitHeight = fitHeight;
  };

  Reader.prototype.queueRenderPage = function(num) {
    if (this.pageRendering) {
      this.pageNumPending = num;
    } else {
      this.renderPDF(num);
    }
  };

  Reader.prototype.loadPDF = function() {
    this.setSize();
    var self = this;
    const docSrc = validURL(this.SRC) ? {url: this.SRC, withCredentials: true} : {data: atob(this.SRC)}
    PDFJS.getDocument(docSrc).then(function(pdf) {
      self.PDF = pdf;
      self.queueRenderPage(1);

      self.currentPage = 1;
      self.totalPages.innerHTML = self.PDF.numPages;
      self.totalPagesNum = self.PDF.numPages;
      self.currentZoomVal = self.fitZoomVal = self.widthZoomVal = 0;
      self.createDownloadLink();
    });
  };

  Reader.prototype.renderPages = function(pdf) {
    var self = this;
    self.viewportOut.innerHTML="";
    PDFJS.getDocument({url: this.SRC, withCredentials: true}).then(function(pdf) {
      self.PDF = pdf;

      for(var num = 1; num <= self.PDF.numPages; num++){
        pdf.getPage(num).then(self.renderPDF(num, null, true));
      }

      self.currentPage = 1;
      self.totalPages.innerHTML = self.PDF.numPages;
      self.totalPagesNum = self.PDF.numPages;
      if (!self.currentZoomVal)
        self.currentZoomVal = self.fitZoomVal = self.widthZoomVal = 0;
      self.createDownloadLink();
    });
  };

  function validURL(str) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if(!regex .test(str)) {
      //alert("Please enter valid URL.");
      return false;
    } else {
      return true;
    }
  }

  Reader.prototype.renderPDF = function(pageNum, resize, isFull) {
    var self = this;
    self.pageRendering = true;
    self.spinner.active = true;
    this.PDF.getPage(pageNum).then(function(page) {
      var scaleW, scaleH, viewerViewport, scale, radians;
      radians = page.pageInfo.rotate * Math.PI / 180;

      self.pageW = Math.abs((page.view[2]*Math.cos(radians)) + (page.view[3]*Math.sin(radians)));
      self.pageH = Math.abs((page.view[3]*Math.cos(radians)) + (page.view[2]*Math.sin(radians)));

      if (self.currentZoomVal === 0 || !!resize) {
        scaleW = Math.round((self.WIDTH / self.pageW) * 100) / 100,
            scaleH = Math.round(((self.HEIGHT - self.toolbarHeight) / self.pageH) * 100) / 100,
            scale = Math.min(scaleH, scaleW);
        self.fitZoomVal = scale;
        self.widthZoomVal = self.WIDTH / self.pageW;
        self.currentZoomVal = self.fitWidth ? self.widthZoomVal : self.fitZoomVal;
      }
      if (!!resize) {
        self.zoomPage({
          target: self.zoomLvl
        });
      } else {
        scale = self.currentZoomVal;

        viewerViewport = page.getViewport(scale);

        self.ctx.height = viewerViewport.height;
        self.ctx.width = viewerViewport.width;

        self.pageW = self.pageW * scale;
        self.pageH = self.pageH * scale;

        self.setViewportPos();

        self.viewport.width = self.pageW;
        self.viewport.height = self.pageH;
        self.viewportStyle.width = self.pageW + 'px';
        if (!self.fitHeight) {
          self.viewportStyle.height = self.pageH + 'px';
        }

        if (self.enableTextSelection){
          self.textLayerDivStyle.width = self.pageW + 'px';
          self.textLayerDivStyle.height = self.pageH + 'px';
        }
        self.ctx.clearRect(0, 0, self.viewport.width, self.viewport.height);


        if (isFull){

          var wrapper = document.createElement('div');
          wrapper.setAttribute("style", "position: relative");
          var canvas = document.createElement('canvas');
          var textLayer = document.createElement('div');
          textLayer.setAttribute("style", "left: " + self.viewportStyle.left)

          textLayer.className = "textLayer";

          var ctx = canvas.getContext('2d');

          // canvas.height = viewerViewport.height;
          // canvas.width = viewerViewport.width;

          textLayer.height = viewerViewport.height;
          textLayer.width = viewerViewport.width;

          self.viewportOut.appendChild(wrapper);
          wrapper.appendChild(canvas);
          wrapper.appendChild(textLayer);

          page.render({
            canvasContext: ctx,
            viewport: viewerViewport
          });

          if (self.enableTextSelection){
            self.textLayerDiv.innerHTML="";
            page.getTextContent().then(function(textContent) {
              PDFJS.renderTextLayer({
                textContent: textContent,
                container: textLayer,
                pageIndex : pageNum,
                viewport: viewerViewport,
                textDivs: []
              });
            });
          }

        } else{

          var renderTask = page.render({
            canvasContext: self.ctx,
            viewport: viewerViewport
          });

          renderTask.promise.then(function () {
            self.pageRendering = false;
            self.spinner.active = false;
            if (self.pageNumPending !== null) {
              // New page rendering is pending
              self.renderPDF(self.pageNumPending);
              self.pageNumPending = null;
            }
          });
        }

        if (self.enableTextSelection){
          self.textLayerDiv.innerHTML="";
          page.getTextContent().then(function(textContent) {
            const task = PDFJS.renderTextLayer({
              textContent: textContent,
              container: self.textLayerDiv,
              pageIndex : pageNum,
              viewport: viewerViewport,
              textDivs: []
            })
            task.promise.then(() => {
              if (self.fitHeight && self.textLayerDiv && self.textLayerDiv.offsetHeight) {
                setTimeout(() => {
                  const newHeight = Math.max(self.textLayerDiv.offsetHeight, 200) + self.toolbarHeight + 32 + 'px'
                  console.log('Setting pdf-element height to ' + newHeight)
                  self.element.style.height = newHeight
                }, 300)
              }
            });
          });
        }
      }
    });
  };

  Reader.prototype.setViewportPos = function() {
    if (this.pageW < this.WIDTH)
      this.viewportStyle.left = (this.WIDTH - this.pageW) / 2 + 'px';
    else
      this.viewportStyle.left = 0;

    if (this.pageH < this.HEIGHT) {
      this.viewportStyle.top = this.fitHeight ? '0' : ((this.HEIGHT - this.pageH - this.toolbarHeight) / 2 + 'px');
      this.viewportStyle.topNum = (this.fitHeight ? 0 : Math.floor((this.HEIGHT - this.pageH - this.toolbarHeight) / 2)) + this.toolbarHeight;
      if (this.enableTextSelection){
        this.textLayerDivStyle.topNum = (this.fitHeight ? 0 : Math.floor((this.HEIGHT - this.pageH - this.toolbarHeight) / 2)) + this.toolbarHeight;
      }
    } else {
      this.viewportStyle.top = 0;
    }

    if (this.enableTextSelection) {
      this.textLayerDivStyle.left = this.viewportStyle.left;
      this.textLayerDivStyle.top = this.viewportStyle.top;
    }
  };

  Reader.prototype.changePDFSource = function(newSrc) {
    this.setSrc(newSrc);
    this.loadPDF();
  };

  Reader.prototype.zoomInOut = function(step) {
    // var step = 0.1;
    this.currentZoomVal = Math.round((Math.round(this.currentZoomVal * 10) / 10 + step) * 10) / 10;
    this.queueRenderPage(this.currentPage);
    // this.renderPages();
  };

  Reader.prototype.zoomIn = function() {
    var step = 0.1;
    this.currentZoomVal = Math.round((Math.round(this.currentZoomVal * 10) / 10 + step) * 10) / 10;
    this.queueRenderPage(this.currentPage);
    // this.renderPages();
  };

  Reader.prototype.zoomOut = function() {
    var step = -0.1;
    this.currentZoomVal = Math.round((Math.round(this.currentZoomVal * 10) / 10 + step) * 10) / 10;
    this.queueRenderPage(this.currentPage);
  };

  Reader.prototype.zoomPageFit = function() {
    this.currentZoomVal = this.fitZoomVal;
    this.queueRenderPage(this.currentPage);
  };

  Reader.prototype.zoomWidthFit = function() {
    this.currentZoomVal = this.widthZoomVal;
    this.queueRenderPage(this.currentPage);
  };

  Reader.prototype.getPageNum = function() {
    return this.PDF.numPages;
  };

  Reader.prototype.createDownloadLink = function() {
    var self = this;

    this.PDF.getData().then(function(data) {
      var blob = PDFJS.createBlob(data, 'application/pdf');

      self.downloadLink = URL.createObjectURL(blob);
    });
  };

  Reader.prototype.download = function(context) {
    var a = document.createElement('a'),
        filename = validURL(this.SRC) ? this.SRC.split('/') : [`${"document"}_${moment()}.pdf`];

    a.href = this.downloadLink;
    a.target = '_parent';

    if ('download' in a) {
      a.download = decodeURIComponent(filename[filename.length - 1]);
    }

    this.reader.appendChild(a);
    a.click();
    a.parentNode.removeChild(a);
  };

  if (!window.Polymer) window.Polymer = {}
  window.Polymer.Reader = Reader;
})(window);
/**
Polymer element which renders PDF documents. It uses [PDF.js](https://mozilla.github.io/pdf.js/) library behind.

Example:

Minimum configuration:
```html
<pdf-element src="../example.pdf" width=800 height=600></pdf-element>
```
Optionally following parameters could be triggered:
 - `elevation` material elevation;
 - `downloadable` to be able to download document;
 - `show-file-name` to show name of the file in the PDF toolbar.


 ```html
 <pdf-element src="../example.pdf" elevation="5" downloadable show-file-name width=800 height=600></pdf-element>
 ```

Another awesome feature is dynamically load PDF file. So you can change the `src` attribute of the element and document will be automatically reloaded (checkout the demo):

```html
<pdf-element src="[[pdfFile]]" width=800 height=600></pdf-element>
```

@demo demo/index.html
@hero hero.svg
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import {TkLocalizerMixin} from "../tk-localizer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior";
import {PolymerElement, html} from '@polymer/polymer';
class PdfElement extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                width: 100%;
                height: 100%;
            }

            .pdf-toolbar {
                background-color: var(--app-primary-color);
                color: white;
            }

            paper-card {
                width: 100%;
            }

            .pdf-viewer {
                text-align: center;
                border: 0px solid #4d4d4d;
            }

            .pdf-viewport-out {
                overflow-y: auto;
                overflow-x: hidden;
                background-color: var(--app-primary-color-light);
                width: 100%;
                max-height: var(--max-pdf-viewer-height);
                max-width: var(--max-pdf-viewer-width);
                padding-top: 16px;
                padding-bottom: 16px;
            }

            .pdf-viewport {
                display: block;
                position: relative;
                border: 0;
                transition: all 200ms ease-in-out;
                width: 100%;
                height: 100%;
            }

            paper-input-container.pageselector {
                --paper-input-container-underline: {
                    visibility: hidden;
                    width: 3ch;
                }
            ;
                --paper-input-container-underline-focus: {
                    visibility: hidden;
                }
            ;
                display: inline-block;
                padding: 0;
                width: 2ch;
                vertical-align: middle;
            }

            input{
                line-height: 18px;
                text-align: end;
                border:none;
                width: 100%;
                outline: 0;
                color: white;
                background-color: transparent;
                font-size: 1em;
                font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
            }

            input:focus,
            input:hover {
                border-radius: 2px;
            }

            #slash {
                padding: 0 3px;
            }

            ht-spinner {
                position: absolute;
                left: 50%;
                height: 42px;
                width: 42px;
                transform: translateX(-50%);
            }

            .textLayer {
                transition: all 200ms ease-in-out;
            }

            .positionRelative {
                position: relative;
            }

            .textLayer {
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                overflow: hidden;
                opacity: 0.2;
                line-height: 1.0;
            }

            .textLayer > div {
                color: transparent;
                position: absolute;
                white-space: pre;
                cursor: text;
                -webkit-transform-origin: 0% 0%;
                -moz-transform-origin: 0% 0%;
                -o-transform-origin: 0% 0%;
                -ms-transform-origin: 0% 0%;
                transform-origin: 0% 0%;
            }

            .textLayer .highlight {
                margin: -1px;
                padding: 1px;

                background-color: rgb(180, 0, 170);
                border-radius: 4px;
            }

            .textLayer .highlight.begin {
                border-radius: 4px 0px 0px 4px;
            }

            .textLayer .highlight.end {
                border-radius: 0px 4px 4px 0px;
            }

            .textLayer .highlight.middle {
                border-radius: 0px;
            }

            .textLayer .highlight.selected {
                background-color: rgb(0, 100, 0);
            }

            .textLayer ::selection { background: rgb(0,0,255); }
            .textLayer ::-moz-selection { background: rgb(0,0,255); }

            .textLayer .endOfContent {
                display: block;
                position: absolute;
                left: 0px;
                top: 100%;
                right: 0px;
                bottom: 0px;
                z-index: -1;
                cursor: default;
                -webkit-user-select: none;
                -ms-user-select: none;
                -moz-user-select: none;
            }

            .textLayer .endOfContent.active {
                top: 0px;
            }


            .annotationLayer section {
                position: absolute;
            }

            .annotationLayer .linkAnnotation > a {
                position: absolute;
                font-size: 1em;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }

            .annotationLayer .linkAnnotation > a /* -ms-a */  {
                background: url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7") 0 0 repeat;
            }

            .annotationLayer .linkAnnotation > a:hover {
                opacity: 0.2;
                background: #ff0;
                box-shadow: 0px 2px 10px #ff0;
            }

            .annotationLayer .textAnnotation img {
                position: absolute;
                cursor: pointer;
            }

            .annotationLayer .textWidgetAnnotation input,
            .annotationLayer .textWidgetAnnotation textarea,
            .annotationLayer .choiceWidgetAnnotation select,
            .annotationLayer .buttonWidgetAnnotation.checkBox input,
            .annotationLayer .buttonWidgetAnnotation.radioButton input {
                background-color: rgba(0, 54, 255, 0.13);
                border: 1px solid transparent;
                box-sizing: border-box;
                font-size: 9px;
                height: 100%;
                padding: 0 3px;
                vertical-align: top;
                width: 100%;
            }

            .annotationLayer .textWidgetAnnotation textarea {
                font: message-box;
                font-size: 9px;
                resize: none;
            }

            .annotationLayer .textWidgetAnnotation input[disabled],
            .annotationLayer .textWidgetAnnotation textarea[disabled],
            .annotationLayer .choiceWidgetAnnotation select[disabled],
            .annotationLayer .buttonWidgetAnnotation.checkBox input[disabled],
            .annotationLayer .buttonWidgetAnnotation.radioButton input[disabled] {
                background: none;
                border: 1px solid transparent;
                cursor: not-allowed;
            }

            .annotationLayer .textWidgetAnnotation input:hover,
            .annotationLayer .textWidgetAnnotation textarea:hover,
            .annotationLayer .choiceWidgetAnnotation select:hover,
            .annotationLayer .buttonWidgetAnnotation.checkBox input:hover,
            .annotationLayer .buttonWidgetAnnotation.radioButton input:hover {
                border: 1px solid #000;
            }

            .annotationLayer .textWidgetAnnotation input:focus,
            .annotationLayer .textWidgetAnnotation textarea:focus,
            .annotationLayer .choiceWidgetAnnotation select:focus {
                background: none;
                border: 1px solid transparent;
            }

            .annotationLayer .textWidgetAnnotation input.comb {
                font-family: monospace;
                padding-left: 2px;
                padding-right: 0;
            }

            .annotationLayer .textWidgetAnnotation input.comb:focus {
                /*
                 * Letter spacing is placed on the right side of each character. Hence, the
                 * letter spacing of the last character may be placed outside the visible
                 * area, causing horizontal scrolling. We avoid this by extending the width
                 * when the element has focus and revert this when it loses focus.
                 */
                width: 115%;
            }

            .annotationLayer .buttonWidgetAnnotation.checkBox input,
            .annotationLayer .buttonWidgetAnnotation.radioButton input {
                -webkit-appearance: none;
                -moz-appearance: none;
                -ms-appearance: none;
                appearance: none;
            }

            .annotationLayer .popupWrapper {
                position: absolute;
                width: 20em;
            }

            .annotationLayer .popup {
                position: absolute;
                z-index: 200;
                max-width: 20em;
                background-color: #FFFF99;
                box-shadow: 0px 2px 5px #333;
                border-radius: 2px;
                padding: 0.6em;
                margin-left: 5px;
                cursor: pointer;
                word-wrap: break-word;
            }

            .annotationLayer .popup h1 {
                font-size: 1em;
                border-bottom: 1px solid #000000;
                padding-bottom: 0.2em;
            }

            .annotationLayer .popup p {
                padding-top: 0.2em;
            }

            .annotationLayer .highlightAnnotation,
            .annotationLayer .underlineAnnotation,
            .annotationLayer .squigglyAnnotation,
            .annotationLayer .strikeoutAnnotation,
            .annotationLayer .lineAnnotation svg line,
            .annotationLayer .fileAttachmentAnnotation {
                cursor: pointer;
            }

            .pdfViewer {
                height: 100%;
            }

            .pdfViewer .canvasWrapper {
                overflow: hidden;
            }

            .pdfViewer .page {
                direction: ltr;
                width: 816px;
                height: 1056px;
                margin: 1px auto -8px auto;
                position: relative;
                overflow: visible;
                border: 9px solid transparent;
                background-clip: content-box;
                background-color: white;
            }

            .pdfViewer.removePageBorders .page {
                margin: 0px auto 10px auto;
                border: none;
            }

            .pdfViewer.singlePageView {
                display: inline-block;
            }

            .pdfViewer.singlePageView .page {
                margin: 0;
                border: none;
            }

            .pdfViewer .page canvas {
                margin: 0;
                display: block;
            }

            .pdfViewer .page canvas[hidden] {
                display: none;
            }

            .pdfViewer .page .loadingIcon {
                position: absolute;
                display: block;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
            }

            .pdfPresentationMode:-webkit-full-screen .pdfViewer .page {
                margin-bottom: 100%;
                border: 0;
            }

            .pdfPresentationMode:-moz-full-screen .pdfViewer .page {
                margin-bottom: 100%;
                border: 0;
            }

            .pdfPresentationMode:-ms-fullscreen .pdfViewer .page {
                margin-bottom: 100% !important;
                border: 0;
            }

            .pdfPresentationMode:fullscreen .pdfViewer .page {
                margin-bottom: 100%;
                border: 0;
            }

        </style>

        <div id="pdf-viewer" class="pdf-viewer">
            <div class="pdf-toolbar">
                <paper-icon-button icon="icons:arrow-back" on-click="showPrev"></paper-icon-button>
                <paper-input-container class="pageselector" no-label-float="">
                    <iron-input slot="input" bind-value="{{currentPage}}">
                        <input id="input" value="{{value::input}}" prevent-invalid-input="" allowed-pattern="\\d" on-change="pageNoCommitted">
                    </iron-input>
                </paper-input-container>
                <span id="slash">/</span><span id="totalPages"></span>
                <paper-icon-button icon="icons:arrow-forward" on-click="showNext"></paper-icon-button>
                <span class="title" hidden\$="{{!showFileName}}">{{fileName}}</span>
                <span class="title" hidden\$="{{showFileName}}"></span>
                <span class="pageRendering"></span>
                <paper-icon-button icon="icons:zoom-in" on-click="zoomIn"></paper-icon-button>
                <paper-icon-button icon="icons:zoom-out" on-click="zoomOut"></paper-icon-button>
                <paper-icon-button id="zoomIcon" icon="icons:fullscreen" on-click="zoomFit"></paper-icon-button>
                <paper-icon-button icon="icons:file-download" hidden\$="{{!downloadable}}" on-click="download"></paper-icon-button>
            </div>
            <div class="pdf-viewport-out" style="position: relative;">
                <canvas class="pdf-viewport"></canvas>
                <div id="text-layer" class="textLayer" hidden\$="{{!enableTextSelection}}"></div>
            </div>
            <ht-spinner class="spinner" hidden\$="{{!showSpinner}}"></ht-spinner>
        </div>
`;
  }

  static get is() {
      return "pdf-element";
  }

  static get properties() {
      return {
          /**
           * Source of a PDF file.
           */
          src: {
              type: String,
              reflectToAttribute: true
          },
          /**
           * The z-depth of this element, from 0-5. Setting to 0 will remove the shadow, and each increasing number greater than 0 will be "deeper" than the last.
           */
          elevation: {
              type: Number,
              value: 1
          },
          /**
           * If provided then download icon will appear on the toolbar to download file.
           */
          downloadable: {
              type: Boolean,
              value: false
          },
          /**
           * If provided then file name will be shown on the toolbar.
           */
          showFileName: {
              type: Boolean,
              value: false
          },
          /*
  * If provided then during page rendering loading spinner will be shown.
  * Maybe used for documents with many images for example.
  */
          showSpinner: {
              type: Boolean,
              value: false
          },
          /*
  * If provided then text selection will be enabled.
  */
          enableTextSelection: {
              type: Boolean,
              value: false
          },
          /*
  * If provided then the document will be zoomed to maximum width initially.
  */
          fitWidth: {
              type: Boolean,
              value: false
          }
          ,
          /*
  * If provided then the document will be fitted to the top
  */
          fitHeight: {
              type: Boolean,
              value: false
          }
      };
  }
  static get observers() {
      return ['loadPDF(src)']
  }

  constructor() {
      super();
  }

  ready() {
      super.ready()
      this.addEventListener('iron-resize', () => this.onWidthChange())
  }

  connectedCallback() {
      super.connectedCallback()
      this.src = this.getAttribute("src");
      this._initializeReader();
      if (this.src) this.instance.loadPDF();
      this._setFit()
  }

  loadPDF() {
      if (!this.getAttribute("src")) return;
      document.addEventListener('pagerendered', function (e) {
          console.log(this.instance)
      }, true);
      if(this.instance) {
          this.instance.changePDFSource(this.getAttribute("src"));
          this.currentPage = 1;
          this.totalPages = this.instance.totalPages;
          this.fileName = this.src.split('/').pop();
          this._setFit();
          this.$.zoomIcon.icon = 'fullscreen';
      }
  }

  attributeChanged(name, type) {}

  _initializeReader() {
      this.instance = new Polymer.Reader(this);
      if (this.src != null) this.fileName = this.src.split('/').pop();
      this.currentPage = 1;
  }

  _setFit() {
      this.instance.setFitWidth(this.fitWidth);
      this.instance.setFitHeight(this.fitHeight);
  }

  zoomInOut(step) {
      if (this.instance.currentZoomVal >= 2) {
          this.instance.currentZoomVal = 2;
      } else if (this.instance.currentZoomVal <= 0.1) {
          this.instance.currentZoomVal = 0.1;
      } else {
          this.$.zoomIcon.icon = 'fullscreen';
          this.instance.zoomInOut(step);
      }
  }

  zoomIn() {
      this.zoomInOut(0.1);
  }

  zoomOut() {
      this.instance.zoomInOut(-0.1);
  }

  zoomFit() {
      if (this.instance.currentZoomVal == this.instance.widthZoomVal) {
          this.instance.zoomPageFit();
          this.$.zoomIcon.icon = 'fullscreen';
      } else {
          this.instance.zoomWidthFit();
          this.$.zoomIcon.icon = 'fullscreen-exit';
      }
  }

  pageNoCommitted() {
      var page = parseInt(this.$.input.value);

      if (1 <= page && page <= this.instance.totalPagesNum) {
          this.instance.currentPage = page;
          this.instance.queueRenderPage(this.instance.currentPage);
          this.currentPage = page;
          this.$.input.blur();
      } else {
          this.$.input.value = this.currentPage;
          this.$.input.blur();
      }
  }

  showPrev() {
      if (1 < this.instance.currentPage) {
          this.instance.currentPage--;
          this.instance.queueRenderPage(this.instance.currentPage);
          this.currentPage--;
      }
  }

  showNext() {
      if (this.instance.totalPagesNum > this.instance.currentPage) {
          this.instance.currentPage++;
          this.instance.queueRenderPage(this.instance.currentPage);
          this.currentPage++;
      }
  }

  download() {
      this.instance.download();
  }

  onWidthChange() {
      const offsetWidth = this.$['pdf-viewer'] && this.$['pdf-viewer'].offsetWidth
      const offsetHeight = this.$['pdf-viewer'] && this.$['pdf-viewer'].offsetHeight

      if (!offsetWidth || !offsetHeight) {
          return
      }

      setTimeout(() => {
          const offsetWidthCheck = this.$['pdf-viewer'] && this.$['pdf-viewer'].offsetWidth
          const offsetHeightCheck = this.$['pdf-viewer'] && this.$['pdf-viewer'].offsetHeight

          if (offsetWidthCheck === offsetWidth && offsetHeightCheck === offsetHeight && this.offsetWidthFit !== offsetWidth) {
              this.loadPDF();
              this.offsetWidthFit = offsetWidth
          }
      }, 500)
  }
}

customElements.define(PdfElement.is, PdfElement);
