/*
    Copyright (C) 2021, knokbak and contributors

    https://github.com/knokbak/Birb

    This Source Code Form is subject to the terms of the
    Mozilla Public License, v. 2.0. If a copy of the MPL
    was not distributed with this file, You can obtain one
    at https://mozilla.org/MPL/2.0/.

    This Source Code Form is “Incompatible With Secondary
    Licenses”, as defined by the Mozilla Public License, v.
    2.0.
*/

class ClientData {

    events = {};

    constructor () {

    }

    bindEvent (event, fn) {
        if (!event) {
            throw new TypeError("event (0) is a required argument");
        }
        if (!fn) {
            throw new TypeError("fn (1) is a required argument");
        }
        if (typeof event !== "string") {
            throw new TypeError("event (0) must be a string");
        }
        if (typeof fn !== "function") {
            throw new TypeError("fn (1) must be a function");
        }
        this.events[event] = fn;
    }

    unbindEvent (event) {
        delete this.events[event];
    }

    emitEvent (event, ...args) {
        if (!event) {
            throw new TypeError("event (0) is a required argument");
        }
        if (typeof event !== "string") {
            throw new TypeError("event (0) must be a string");
        }
        if (!this.events[event]) {
            throw new TypeError("event (0) is not bound");
        }
        this.events[event](...args);
    }

    isEventBound (event) {
        if (!event) {
            throw new TypeError("event (0) is a required argument");
        }
        if (typeof event !== "string") {
            throw new TypeError("event (0) must be a string");
        }
        return this.events[event] ? true : false;
    }

}

module.exports = ClientData;
