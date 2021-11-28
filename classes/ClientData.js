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

    _Events = {};

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
        _Events[event] = fn;
    }

    unbindEvent (event) {
        delete this._Events[event];
    }

    isEventBound (event) {
        if (!event) {
            throw new TypeError("event (0) is a required argument");
        }
        if (typeof event !== "string") {
            throw new TypeError("event (0) must be a string");
        }
        return _Events[event] ? true : false;
    }

}

module.exports = ClientData;
