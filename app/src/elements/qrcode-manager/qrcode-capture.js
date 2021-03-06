const jsQR = require('../../../scripts/jsQR.js');

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class QrcodeCapture extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
		<style>
			#canvas  {
				transform: rotateY(180deg);
				-webkit-transform:rotateY(180deg); /* Safari and Chrome */
				-moz-transform:rotateY(180deg); /* Firefox */
			}
		</style>

		<div id="qrcode" class="container">
			<label class="col-sm-4 control-label no-padding-right">[[localize('or_use_cam_to_sca_qr_cod','Or use camera to scan QR Code:',language)]]</label>
			<div class="col-sm-3">
				<span class="btn" ng-click="capture()">[[captureStatus]]</span>
			</div>
			<div class="col-sem-5">
				<video id="camera" autoplay="true" style="display:none"></video>
				<canvas id="canvas" style\$="width:[[width]]; height:[[height]];" width="640" height="360"></canvas>
				<canvas id="ofCanvas" style="width: 1280px; height:720px; display: none" width="1280" height="720"></canvas>
			</div>
		</div>
`;
  }

  static get is() {
      return 'qrcode-capture';
	}

  static get properties() {
      return {
          width: {
              type: String,
              value: "640px"
          },
          height: {
              type: String,
              value: "480px"
          },
          captureStatus: {
              type: String,
              value: null
          },
          cameraSvg: {
              type: String,
              value: function () {
                  return require('./images/camera.svg');
              }
          }
      };
	}

  constructor() {
      super();
      this.requestAnimationFrameBuffer = false;
	}

  ready() {
      super.ready();
	}

  tick() {
      const video = this.$.camera;

      const canvas = this.$.canvas;
      const context = canvas.getContext("2d");
      const width = parseInt(canvas.style.width);
      const height = parseInt(canvas.style.height);

      const ofCanvas = this.$.ofCanvas;
      const ofContext = ofCanvas.getContext("2d");
      const ofWidth = parseInt(ofCanvas.style.width);
      const ofHeight = parseInt(ofCanvas.style.height);

      if (!this.stopAnimation) { requestAnimationFrame(this.tick.bind(this)); }

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
          // Load the video onto the canvas
          console.log(ofWidth, ofHeight, width, height);
          ofContext.drawImage(video, 0, 0, ofWidth, ofHeight);
          context.drawImage(ofCanvas, 0, 0, ofWidth, ofHeight, 0, 0, width, height);
          // Load the image data from the canvas
          const imageData = ofContext.getImageData(0, 0, ofWidth, ofHeight);
          const binImage = jsQR.binarizeImage(imageData.data, imageData.width, imageData.height);
          const location = jsQR.locateQRInBinaryImage(binImage);
          if (!location) {
              this.set('captureStatus', "No QR Decoded");
              return;
          }
          var rawQR = jsQR.extractQRFromBinaryImage(binImage, location);
          if (!rawQR) {
              this.set('captureStatus', "No QR Decoded");
              return;
          }
          const decoded = jsQR.decodeQR(rawQR);
          if (decoded) {
              context.beginPath();
              context.moveTo(location.bottomLeft.x * width / ofWidth, location.bottomLeft.y * height / ofHeight);
              context.lineTo(location.topLeft.x * width / ofWidth, location.topLeft.y * height / ofHeight);
              context.lineTo(location.topRight.x * width / ofWidth, location.topRight.y * height / ofHeight);
              context.lineWidth = 8;
              context.strokeStyle = "green";
              context.stroke();

              this.set('captureStatus', "QR Decoded !");

              setTimeout(() => this.set('captureStatus', ''), 1000);
              this.dispatchEvent(new CustomEvent('qrcode-detected', { detail: decoded, composed: true }));
          } else {
              this.set('captureStatus', "No QR Decoded");
          }
      }
	}

  start() {
      const video = this.$.camera;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      if (navigator.getUserMedia) {
          navigator.getUserMedia({ audio: false, video: { width: 1280, height: 720 } }, stream => {
              this.stream = stream
              video.srcObject = stream;
              video.onloadedmetadata = function () {
                  video.play();
              };
          }, function (err) {
              console.log("The following error occurred: " + err.name);
          });
      } else {
          console.log("getUserMedia not supported");
      }
      this.stopAnimation = false
      this.requestAnimationFrameBuffer = requestAnimationFrame(this.tick.bind(this));
	}

  stop() {
      //cancelAnimationFrame( this.requestAnimationFrameBuffer );
      this.stopAnimation = true
      this.stream && (this.stream.getTracks() || []).forEach(t => t.stop())
  }
}

customElements.define(QrcodeCapture.is, QrcodeCapture);
