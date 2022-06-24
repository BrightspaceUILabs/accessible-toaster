import { LitElement, html } from 'lit-element';
import '@brightspace-ui/core/components/alert/alert-toast';
import { ToasterMixin } from './ToasterMixin.js';

class Toaster extends ToasterMixin(LitElement) {
  render() {
    return [html` <slot></slot> `, super.render()];
  }
}

customElements.define('d2l-labs-toaster', Toaster);
