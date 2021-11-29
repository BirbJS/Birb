/*
    Copyright (C) 2021, knokbak and contributors

    https://github.com/knokbak/Birb

    This Source Code Form is subject to the terms of the
    Mozilla Public License, v. 2.0. If a copy of the MPL
    was not distributed with this file, You can obtain one
    at https://mozilla.org/MPL/2.0/.
*/

class AlreadyBoundWarning extends Error {

    constructor (event) {
        if (event) {
            super(
                `Event ${event} has already been bound to a function. Binding to an event ` +
                `multiple times will not cause both functions to be called, and only the most ` +
                `recently bound function will be called when the ${event} event is emitted.`
            );
        } else {
            super(
                `Double event bind detected! Binding to an event multiple times is not supported.`
            );
        }
        this.name = "AlreadyBoundWarning";
    }

}

module.exports = AlreadyBoundWarning;
