import { LightningElement } from "lwc";

export default class Props extends LightningElement {
  @api
  name;

  nonProp;

  @api
  method() {}

  nonMethod() {}
}
