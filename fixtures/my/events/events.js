import { LightningElement } from "lwc";

export default class Events extends LightningElement {
  connectedCallback() {
    this.dispatchEvent(new CustomEvent("sample", { detail: { sample: true } }));
  }
}
