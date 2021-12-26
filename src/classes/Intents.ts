/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import BitsBlock from './blocks/BitsBlock';
import { Intents as IntentFlags } from '../util/Constants';
import { BitsResolvable } from '../util/Types';

export default class Intents extends BitsBlock<keyof typeof IntentFlags> {

    /**
     * The available Intents.
     */
    static FLAGS = IntentFlags;

    /**
     * Intents are used by Discord to selectively send the
     * client data, whilst not sending data that isn't
     * needed. Intents are required to be set to use
     * Birb.JS.
     * 
     * @param {number} flags The flags to set.
     */
    constructor (flags: BitsResolvable<keyof typeof IntentFlags>) {
        super(IntentFlags, flags);
    }

}
