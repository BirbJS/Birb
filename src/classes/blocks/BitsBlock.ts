/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export default class BitsBlock {

    flags: number = 0;

    constructor (...flags: number[]) {
        if (flags) {
            for ( let i = 0; i < flags.length; i++ ) {
                this.add(flags[i]);
            }
        }
    }

    /**
     * Adds a flag (bit) to the block.
     * 
     * @param {number} flags The flags to add.
     * @returns {BitsBlock} The updated block.
     * @public
     */
    add (...flags: number[]): BitsBlock {
        for ( let i = 0; i < flags.length; i++ ) {
            let flag = flags[i];
            if ( !this.has(flag) ) {
                this.flags |= flag;
            }
        }
        return this;
    }

    /**
     * Removes a flag (bit) from the block.
     * 
     * @param {number} flags The flags to remove.
     * @returns {BitsBlock} The updated block.
     * @public
     */
    remove (...flags: number[]): BitsBlock {
        for ( let i = 0; i < flags.length; i++ ) {
            let flag = flags[i];
            if ( this.has(flag) ) {
                this.flags ^= flag;
            }
        }
        return this;
    }

    /**
     * Check if a flag (bit) is in the block.
     * 
     * @param {number} flag The flag to check.
     * @returns {boolean} The result.
     * @public
     */
    has (flag: number): boolean {
        return (this.flags & flag) === flag;
    }

    /**
     * Check if the block is empty.
     * 
     * @returns {boolean} `true` if the block is empty, `false` otherwise.
     * @public
     */
    isEmpty (): boolean {
        return this.flags === 0;
    }

}
