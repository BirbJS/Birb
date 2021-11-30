/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export enum Status {
    IDLE = 0,
    READY = 1,
    CONNECTING = 2,
    RECONNECTING = 3,
    DISCONNECTED = 4,
    WAITING_FOR_GUILDS = 5,
    RESUMING = 6,
    IDENTIFYING = 7,
}
