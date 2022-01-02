/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export default class Color {
  /**
   * Convert an integer to a hex string.
   *
   * @param {number} int HEX color value as an integer.
   * @returns {string} HEX color value as a string.
   * @public
   */
  static intToHex(int: number): string {
    let hex = int.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }

  /**
   * Convert a hex string to an integer.
   *
   * @param {string} hex HEX color value as a string.
   * @returns {number} HEX color value as an integer.
   * @public
   */
  static hexToInt(hex: string): number {
    return Number.parseInt(hex.replace('#', ''), 16);
  }
}
