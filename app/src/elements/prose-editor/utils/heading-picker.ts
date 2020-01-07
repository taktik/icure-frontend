import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-item/paper-item';

import {customElement, property} from "taktik-polymer-typescript";
import './heading-picker.html'

import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";

@customElement('heading-picker')
export class HeadingPicker extends mixinBehaviors([], PolymerElement) {

  $: { editor: HTMLElement, content: HTMLElement } | any

  @property({type: String, notify: true})
  heading?: string = ""

  @property({type: Array})
  headingList = ["Normal", "Heading 1", "Heading 2", "Heading 3", "Heading 4", "Heading 5"]

  constructor() {
    super()
  }

  _onTap(event : any) {
    this.set('heading', event.target.id)
    this.dispatchEvent(new CustomEvent('heading-picker-selected', {detail: {value: this.heading}, bubbles:true, composed:true} as EventInit) )

    this.$.headingMenuButton.opened = false
  }

  _heading(heading? : string) {
    return heading && heading.length ? heading : "Normal"
  }
}
