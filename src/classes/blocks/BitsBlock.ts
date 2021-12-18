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

    /**
     * The flags of the bitfield.
     */
    flags: number = 0;

    /**
     * A BitsBlock stores bitfield data provided by Discord.
     * 
     * @param {...number[]} flags The flags to set.
     */
    constructor (...flags: number[]) {
        if (flags) {
            for ( let i = 0; i < flags.length; ++i ) this.add(flags[i]);
        }
    }

    /**
     * Adds a flag (bit) to the block.
     * 
     * @param {...number[]} flags The flags to add.
     * @returns {BitsBlock} The updated block.
     */
    add (...flags: number[]): BitsBlock {
        for ( let i = 0; i < flags.length; ++i ) {
            let flag = flags[i];
            if ( !this.has(flag) ) this.flags |= flag;
        }
        return this;
    }

    /**
     * Sets the flags of the block.
     * 
     * @param {...number[]} flags The flags to set.
     * @returns {BitsBlock} The updated block.
     */
    set (flags: number): BitsBlock {
        this.flags = flags;
        return this;
    }

    /**
     * Removes a flag (bit) from the block.
     * 
     * @param {...number[]} flags The flags to remove.
     * @returns {BitsBlock} The updated block.
     */
    remove (...flags: number[]): BitsBlock {
        for ( let i = 0; i < flags.length; ++i ) {
            let flag = flags[i];
            if ( this.has(flag) ) this.flags ^= flag;
        }
        return this;
    }

    /**
     * Check if a flag (bit) is in the block.
     * 
     * @param {number} flag The flag to check.
     * @returns {boolean} The result.
     */
    has (flag: number): boolean {
        return (this.flags & flag) === flag;
    }

    /**
     * Check if the block is empty.
     * 
     * @returns {boolean} `true` if the block is empty, `false` otherwise.
     */
    isEmpty (): boolean {
        return this.flags == 0;
    }

    /**
     * Returns a new BitsBlock with the flags of this
     * block.
     * 
     * @returns {BitsBlock} The new block.
     */
    clone (): BitsBlock {
        return new BitsBlock(this.flags);
    }

}
