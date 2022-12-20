import { LitElement, html } from 'lit-element';
import { ToastEvent } from '../index.js';

function parseHash(hash) {
  return hash
    .substring(1)
    .split(';')
    .reduce((acc, curr) => {
      const [key, val] = curr.split('=');
      acc.set(key, val);
      return acc;
    }, new Map());
}

class DemoView extends LitElement {
  connectedCallback() {
    super.connectedCallback();

    // code related to visual diff tests
    const hashMap = parseHash(window.location.hash);

    if (hashMap.has('dir')) {
      document.documentElement.setAttribute('dir', hashMap.get('dir'));
    }
  }

  sendToastEvent(e) {
    // Let's cook some toast!
    // the element to dispatch the event from
    const elm = e.target;
    // message = the text the toast will show
    const message = elm.innerText;
    // description = the text the screen reader will say
    const description = `${message} Clicked`;

    ToastEvent.dispatch(elm, message, description);
  }

  render() {
    return html`
      <d2l-labs-toaster limit="3">
        <button @click=${this.sendToastEvent}>Send Toast</button>
        <button @click=${this.sendToastEvent}>Here's some more</button>
      </d2l-labs-toaster>
    `;
  }
}
customElements.define('d2l-insights-demo-view', DemoView);
