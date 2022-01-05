/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { BitResolvable } from '../../util/Types';

export default abstract class BitsBlock<K extends string> {
  /**
   * The bits of the bitfield.
   */
  bitfield: bigint = 0n;
  protected FLAGS: { [Key in K]: bigint };
  abstract clone(): BitsBlock<K>;

  /**
   * A BitsBlock stores bitfield data provided by Discord.
   *
   * @param {Object} flags All available flags
   * @param {Flags | Flags[] | number} bits Bits to add
   */
  constructor(flags: BitsBlock<K>['FLAGS'], bits?: BitResolvable<K>) {
    this.FLAGS = flags;
    this.set(bits || 0n);
  }

  /**
   * Converts BitResolvable to number.
   *
   * @param {Flags | Flags[] | number} flags The flags you want to convert.
   * @returns {number} The converted number.
   */
  convert(flags: BitResolvable<K>): bigint {
    let bits = 0n;

    if (Array.isArray(flags)) {
      for (let i = 0; i < flags.length; ++i) {
        let bit = this.FLAGS[flags[i] as K];
        if (bit === undefined) throw new Error(`Flag ${flags[i]} is not a valid ${this.constructor.name} flag`);
        bits |= bit;
      }
    } else if (!Number.isInteger(parseInt(flags as string))) {
      let bit = this.FLAGS[flags as K];
      if (bit === undefined) throw new Error(`Flag ${flags} is not a valid ${this.constructor.name} flag`);
      bits |= bit;
    } else if (
      typeof parseInt(flags as string) === 'number' ||
      typeof flags === 'number' ||
      typeof flags === 'bigint'
    ) {
      bits |= BigInt(flags);
    } else {
      throw new Error(`Cannot convert ${flags} into possible bits`);
    }

    return bits;
  }

  /**
   * Adds a flag (bit) to the block.
   *
   * @param {...Flags[] | ...number[]} flags The flags to add.
   * @returns {BitsBlock} The updated block.
   */
  add(...flags: BitResolvable<K>[]): BitsBlock<K> {
    let bits = 0n;

    for (let i = 0; i < flags.length; ++i) {
      bits |= this.convert(bits);
    }

    this.bitfield |= bits;

    return this;
  }

  /**
   * Sets the flags of the block.
   *
   * @param {Flags | Flags[] | number} flags The flags to set.
   * @returns {BitsBlock} The updated block.
   */
  set(bits: BitResolvable<K>): BitsBlock<K> {
    this.bitfield = this.convert(bits);
    return this;
  }

  /**
   * Removes a flag (bit) from the block.
   *
   * @param {...Flags[] | ...number[]} flags The flags to remove.
   * @returns {BitsBlock} The updated block.
   */
  remove(...flags: BitResolvable<K>[]): BitsBlock<K> {
    let bits = 0n;

    for (let i = 0; i < flags.length; ++i) {
      bits |= this.convert(bits);
    }

    this.bitfield ^= bits;

    return this;
  }

  /**
   * Check if a flag (bit) is in the block.
   *
   * @param {Flags | Flags[] | number} flag The flag to check.
   * @returns {boolean} The result.
   */
  has(flags: BitResolvable<K>): boolean {
    let bit = this.convert(flags);
    return (this.bitfield & bit) === bit;
  }

  /**
   * Check if the block is empty.
   *
   * @returns {boolean} `true` if the block is empty, `false` otherwise.
   */
  isEmpty(): boolean {
    return this.bitfield == 0n;
  }

  toArray(): K[] {
    return Object.keys(this.FLAGS).filter(bit => this.has(bit as K)) as K[];
  }
}
