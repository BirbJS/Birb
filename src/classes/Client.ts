/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export default class Client {

    options = {
        debug: false,
    }

    debug (...message: string[]) {
        if (this.options.debug) {
            console.debug('[debug]', ...message);
        }
    }

}
