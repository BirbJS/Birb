/*
    Copyright (C) 2021, knokbak and contributors

    https://github.com/knokbak/Birb

    This Source Code Form is subject to the terms of the
    Mozilla Public License, v. 2.0. If a copy of the MPL
    was not distributed with this file, You can obtain one
    at https://mozilla.org/MPL/2.0/.
*/

class PossibleMemoryLeakWarning extends Error {

    constructor () {
        super('possible memory leak detected!\nHead to: https://birb.js.org/errors/PossibleMemoryLeakWarning');
        this.name = "PossibleMemoryLeakWarning";
    }

    short () {
        return `${this.name}: ${this.message}`;
    }

}

module.exports = PossibleMemoryLeakWarning;
