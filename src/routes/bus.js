export class Bus {
    constructor () {
        this._bus = new EventTarget();
    }

    addEventListener (type, handler) {
        this._bus.addEventListener (type, e => handler(e.detail));
    }

    dispatchEvent (type, detail) {
        this._bus.dispatchEvent(new CustomEvent(type, { detail }));
    }
}
