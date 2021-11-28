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

class UnableToResumeWarning extends Error {

    constructor () {
        super(
            `The client is unable to resume its connection. Attempting to reauthenticate...`
        );
        this.name = "UnableToResumeWarning";
    }

}

module.exports = UnableToResumeWarning;
