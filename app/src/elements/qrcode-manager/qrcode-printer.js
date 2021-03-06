import kjua from './kjua-0.1.1.min';

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class QrcodePrinter extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
		<style>
			img {
				display: block;
				margin: auto;
			}

		</style>

		<div id="qrcode" class="container">
		</div>
`;
  }

  static get is() {
      return 'qrcode-printer';
	}

  static get properties() {
      return {
          text: {
              type: String
          },
          size: {
              type: Number,
              value: 200
          },
          ecl: {
              type: String,
              value: 'L'
          }
      };
	}

  static get observers() {
      return ['_attachCode(text,size,ecl)'];
	}

  constructor() {
      super();
	}

  ready() {
      super.ready();
	}

  _attachCode(text, size, ecl) {
      if (!text) {
          return;
      }
      if (this.el) {
          this.$.qrcode.removeChild(this.el);
      }
      this.el = kjua({ render: 'image', text: text, fill: '#111', size: size, ecLevel: ecl, quiet: 0 });
      this.$.qrcode.appendChild(this.el);
	}

  getImage(){
	    return this.$.qrcode;
	}
}

customElements.define(QrcodePrinter.is, QrcodePrinter);
