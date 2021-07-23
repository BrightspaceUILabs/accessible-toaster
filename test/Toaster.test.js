import { expect, fixture, html } from '@open-wc/testing';
import { ToastEvent } from '../index.js';

describe('Toaster', function toasterTests() {
  before(() => {
    this.storeMatch = window.matchMedia;
    window.matchMedia = () => ({ matches: false });
  });

  after(() => {
    window.matchMedia = this.storeMatch;
  });

  async function initToaster(limit = 2) {
    const elm = await fixture(html`
      <d2l-labs-toaster limit="${limit}">
        <button id="child"></button>
      </d2l-labs-toaster>
    `);
    const target = elm.querySelector('#child');
    return { elm, target };
  }

  it('Should limit alerts to 2 by default', async () => {
    const { elm, target } = await initToaster();

    ToastEvent.dispatch(target, '', '');
    ToastEvent.dispatch(target, '', '');
    ToastEvent.dispatch(target, '', '');
    await new Promise(res => setTimeout(res, 400));
    expect(elm._events.length).to.equal(2);
  });

  it('Should limit alerts by attribute', async () => {
    const { elm, target } = await initToaster(3);

    ToastEvent.dispatch(target, '', '');
    ToastEvent.dispatch(target, '', '');
    ToastEvent.dispatch(target, '', '');
    ToastEvent.dispatch(target, '', '');
    await new Promise(res => setTimeout(res, 400));
    expect(elm._events.length).to.equal(3);
  });

  it('Toasts should render properly', async () => {
    const { elm, target } = await initToaster();

    const [message, description] = ['Message', 'Axe Description'];
    ToastEvent.dispatch(target, message, description);
    await elm.updateComplete;

    const toastAlert = elm.shadowRoot.querySelector('d2l-alert');
    await toastAlert.updateComplete;
    expect(toastAlert.innerText).to.equal(message);

    const axeAlert = elm.shadowRoot.querySelector('[role="alert"]');
    expect(axeAlert.innerText).to.equal(description);
  });

  it('Should pass axe tests', async () => {
    const { elm, target } = await initToaster();

    ToastEvent.dispatch(target, '', '');
    await elm.updateComplete;

    const axeAlert = elm.shadowRoot.querySelector('[role="alert"]');
    const toastAlert = elm.shadowRoot.querySelector('d2l-alert');
    await toastAlert.updateComplete;

    expect(axeAlert).to.be.accessible();
    expect(toastAlert).to.be.accessible();
  });
});
