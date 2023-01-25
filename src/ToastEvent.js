class ToastEvent {
  constructor(message, description, visible = true) {
    this._message = message;
    this._description = description;
    this._visible = visible;
    this._isRendered = false;
    this._id = '';
    this._killTimeout = undefined;
    this._remove = () => {};
    this._finished = new Promise(res => {
      this._remove = res;
    });
    this.closing = false;
  }

  static implementationOf(obj) {
    return obj.constructor.name === 'ToastEvent';
  }

  static dispatch(elm, message, description, visible = true) {
    const usedDescription = description === true ? message : description;
    const event = new ToastEvent(message, usedDescription, visible);

    elm.dispatchEvent(
      new CustomEvent('accessible-toast-add', {
        detail: event,
        bubbles: true,
        composed: true,
      })
    );
  }

  get message() {
    this._setKillTimeout();

    return this._message;
  }

  get description() {
    this._setKillTimeout();

    return this._description;
  }

  get visible() {
    return this._visible;
  }

  get id() {
    if (this._id === '') {
      this._id = new Array(10)
        .fill(0)
        .map(() => Math.round(Math.random() * 9))
        .join('');
    }
    return this._id;
  }

  get finished() {
    return this._finished;
  }

  markForRemoval() {
    if (!this.closing) {
      clearTimeout(this._killTimeout);
      setTimeout(() => {
        this._remove();
      }, 300);
    }
    this.closing = true;
  }

  _setKillTimeout() {
    if (!this._isRendered) {
      this._isRendered = true;
      this._killTimeout = setTimeout(() => {
        this._remove();
      }, 4000);
    }
  }
}

export default ToastEvent;
