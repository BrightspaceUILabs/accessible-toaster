import { expect, fixture, html } from '@open-wc/testing';
import { ToastEvent } from '../index.js';

describe('Toaster', function toaster() {
  beforeEach(async () => {
    this.elm = await fixture(html`
      <d2l-labs-toaster>
        <button id="child"></button>
      </d2l-labs-toaster>
    `);
    this.target = this.elm.querySelector('#child');
  });

  it('Should limit alerts to 2 by default', async () => {
    ToastEvent.dispatch(this.target, '', '');
    ToastEvent.dispatch(this.target, '', '');
    ToastEvent.dispatch(this.target, '', '');
    await new Promise(res => setTimeout(res, 400));
    expect(this.elm._events.length).to.equal(2);
  });

  it('Should limit alerts by attribute', async () => {
    const elm = await fixture(html`
      <d2l-labs-toaster limit="3">
        <button id="child"></button>
      </d2l-labs-toaster>
    `);
    const target = elm.querySelector('#child');

    ToastEvent.dispatch(target, '', '');
    ToastEvent.dispatch(target, '', '');
    ToastEvent.dispatch(target, '', '');
    ToastEvent.dispatch(target, '', '');
    await new Promise(res => setTimeout(res, 400));
    expect(elm._events.length).to.equal(3);
  });

  it('Toasts should render properly', async () => {
    const [message, description] = ['Message', 'Axe Description'];
    ToastEvent.dispatch(this.target, message, description);
    await this.elm.updateComplete;

    const toastAlert = this.elm.shadowRoot.querySelector('d2l-alert');
    await toastAlert.updateComplete;
    expect(toastAlert.innerText).to.equal(message);

    const axeAlert = this.elm.shadowRoot.querySelector('[role="alert"]');
    expect(axeAlert.innerText).to.equal(description);
  });

  it('Should pass axe tests', async () => {
    ToastEvent.dispatch(this.target, '', '');
    await this.elm.updateComplete;

    const axeAlert = this.elm.shadowRoot.querySelector('[role="alert"]');
    const toastAlert = this.elm.shadowRoot.querySelector('d2l-alert');
    await toastAlert.updateComplete;

    expect(axeAlert).to.be.accessible();
    expect(toastAlert).to.be.accessible();
  });
});
