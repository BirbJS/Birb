/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { BitsResolvable } from "../../util/Types"

export default class BitsBlock<Flags extends string> {

    /**
     * The bits of the bitfield.
     */
    bitfield: number = 0;
    protected ENUM: { [key in Flags]: number }

    /**
     * A BitsBlock stores bitfield data provided by Discord.
     * 
     * @param {Object} flags All available flags
     * @param {string[] | number} bits Bits to add
     */
    constructor(flags: BitsBlock<Flags>["ENUM"], bits?: BitsResolvable<Flags>) {
        this.ENUM = flags
        this.set(bits || 0)
    }

    /**
     * Converts BitsResolvable to number.
     * 
     * @param {string[] | number} flags The flags you want to convert.
     * @returns {number} The converted number.
     */
    convert(flags: BitsResolvable<Flags>): number {
        let bits = 0

        if (Array.isArray(flags)) {
            for (let i = 0; i < flags.length; ++i) {
                let bit: number = this.ENUM[flags[i] as Flags]
                // if (bit === undefined) throw new Error(`Flag ${flags[i]} is not a valid ${this.constructor.name} flag`)
                bits |= bit
            }
        } else if (!Number.isInteger(flags)) {
            let bit = this.ENUM[flags as Flags]
            // if (bit === undefined) throw new Error(`Flag ${flags} is not a valid ${this.constructor.name} flag`)
            bits |= bit
        } else if (typeof flags === 'number') {
            if (!(Math.log2(flags) % 1 === 0)) throw new Error(`Bit ${flags} is not a valid bit`)
            bits |= flags
        } else {
            // throw new Error(`Cannot convert ${flags} into possible bits`)
        }

        return bits
    }

    /**
     * Adds a flag (bit) to the block.
     * 
     * @param {...number[]} flags The flags to add.
     * @returns {BitsBlock} The updated block.
     */
    add(...flags: BitsResolvable<Flags>[]): BitsBlock<Flags> {
        let bits = 0

        for (let i = 0; i < flags.length; ++i) {
            bits |= this.convert(bits)
        }

        this.bitfield |= bits

        return this;
    }

    /**
     * Sets the flags of the block.
     * 
     * @param {number | string[]} flags The flags to set.
     * @returns {BitsBlock} The updated block.
     */
    set(bits: BitsResolvable<Flags>): BitsBlock<Flags> {
        this.bitfield = this.convert(bits);
        return this;
    }

    /**
     * Removes a flag (bit) from the block.
     * 
     * @param {...number[]} flags The flags to remove.
     * @returns {BitsBlock} The updated block.
     */
    remove(...flags: BitsResolvable<Flags>[]): BitsBlock<Flags> {
        let bits = 0

        for (let i = 0; i < flags.length; ++i) {
            bits |= this.convert(bits)
        }

        this.bitfield ^= bits

        return this;
    }

    /**
     * Check if a flag (bit) is in the block.
     * 
     * @param {number} flag The flag to check.
     * @returns {boolean} The result.
     */
    has(flags: BitsResolvable<Flags>): boolean {
        let bit = this.convert(flags)
        return (this.bitfield & bit) === bit;
    }

    /**
     * Check if the block is empty.
     * 
     * @returns {boolean} `true` if the block is empty, `false` otherwise.
     */
    isEmpty(): boolean {
        return this.bitfield == 0;
    }

    /**
     * Returns a new BitsBlock with the flags of this
     * block.
     * 
     * @returns {BitsBlock} The new block.
     */
    clone(): BitsBlock<Flags> {
        return new BitsBlock(this.ENUM, this.bitfield);
    }

}