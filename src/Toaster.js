import { classMap } from 'lit-html/directives/class-map';
import { LitElement, html, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { nothing } from 'lit-html';
import ToastEvent from './ToastEvent.js';
import '@brightspace-ui/core/components/alert/alert-toast';
import '@brightspace-ui/core/components/offscreen/offscreen.js';

class Toaster extends LitElement {
  static get properties() {
    return {
      limit: { type: Number, attribute: true },
      _events: { attribute: false },
    };
  }

  static get styles() {
    return [
      css`
        .d2l-insights-event-container {
          bottom: 0;
          margin: auto;
          margin-left: 50vw;
          position: fixed;
          transform: translateX(-50%);
          width: 500px;
        }
        .d2l-insights-event {
          box-shadow: 0 5px 10px rgba(0.23, 0.23, 0.23, 0.2);
          display: block;
          transition: margin-bottom 0.2s, opacity 0.2s;
        }
        .d2l-insights-event.d2l-insights-event-standard {
          animation: move-in-fade-out 4s 0s 1 forwards;
        }
        .d2l-insights-event.d2l-insights-event-close {
          animation: fade-out 0.2s 0s 1 both;
        }
        .d2l-insights-hidden {
          height: 0;
          margin: 0;
          opacity: 0;
        }
        @keyframes move-in-fade-out {
          0% {
            opacity: 0;
          }
          10% {
            margin-bottom: 1rem;
            opacity: 1;
          }
          90% {
            margin-bottom: 1rem;
            opacity: 1;
          }
          100% {
            margin-bottom: 1rem;
            opacity: 0;
          }
        }
        @keyframes fade-out {
          from {
            margin-bottom: 1rem;
            opacity: 1;
          }
          to {
            margin-bottom: 1rem;
            opacity: 0;
          }
        }
      `,
    ];
  }

  constructor() {
    super();
    this._events = [];
    this.limit = 2;
    this.addEventListener('accessible-toast-add', this._addEvent);
    this.addEventListener('accessible-toast-close', this._closeEvent);
  }

  connectedCallback() {
    super.connectedCallback();
    // The developer isn't always right so
    // check for accessible overrides
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.onchange = () => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.limit = 1;
      } else {
        this.limit = this._originalLimit;
      }
    };
    this._originalLimit = this.limit;
    if (reducedMotion.matches) {
      this.limit = 1;
    }
  }

  _addEvent(newEvent) {
    newEvent.stopPropagation();
    const { detail } = newEvent;
    if (!ToastEvent.implementationOf(detail)) return;
    let newEvents = [...this._events];
    newEvents.push(detail);
    this._events = newEvents;
    // check if this event overflows the limit
    if (this._events.length > this.limit) {
      this._events.forEach((e, i) => {
        if (i < this._events.length - this.limit) {
          e.markForRemoval();
        }
      });
    }

    // remove the toast if it exceeds it's timeout
    detail.finished.then(() => {
      // after the animation remove the event
      newEvents = [...this._events];
      const i = newEvents.findIndex(e => e.id === detail.id);
      newEvents.splice(i, 1);
      this._events = newEvents;
    });
  }

  render() {
    const _renderEvent = e => {
      const classes = {
        'd2l-insights-event': true,
        'd2l-insights-event-close': e.closing,
      };
      return e.visible
        ? html`<d2l-alert class="${classMap(classes)}">${e.message}</d2l-alert>`
        : nothing;
    };

    const _renderA11y = e =>
      html`<d2l-offscreen role="alert">${e.description}</d2l-offscreen>`;

    return html`
      <slot></slot>
      <div class="d2l-insights-event-container" aria-hidden="true">
        ${repeat(
          this._events,
          event => event.id,
          event => _renderEvent(event)
        )}
      </div>
      <d2l-offscreen aria-live="assertive">
        ${repeat(
          this._events,
          event => event.id,
          event => _renderA11y(event)
        )}
      </d2l-offscreen>
    `;
  }

  updated() {
    /*
     * Properly animate the moving up motion.
     * Timeout because we need to wait a small amount
     * of time for the text to render
     */
    setTimeout(() => {
      const eventEls = this.shadowRoot.querySelectorAll('.d2l-insights-event');
      if (eventEls.length > 0) {
        const lastEvent = eventEls[eventEls.length - 1];
        const height = `-${lastEvent.offsetHeight}px`;
        lastEvent.style.marginBottom = height;
        lastEvent.classList.add('d2l-insights-event-standard');
      }
    }, 0);
  }
}

customElements.define('d2l-labs-toaster', Toaster);
