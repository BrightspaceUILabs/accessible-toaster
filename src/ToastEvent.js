class ToastEvent {
  constructor(message, description) {
    this._message = message;
    this._description = description;
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

  static dispatch(elm, message, description) {
    const usedDescription = description === true ? message : description;
    const event = new ToastEvent(message, usedDescription);

    elm.dispatchEvent(
      new CustomEvent('accessible-toast-add', {
        detail: event,
        bubbles: true,
        composed: true,
      })
    );
  }

  get message() {
    if (!this._isRendered) {
      this._isRendered = true;
      this._killTimeout = setTimeout(() => {
        this._remove();
      }, 4000);
    }

    return this._message;
  }

  get description() {
    return this._description;
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
}

export default ToastEvent;
