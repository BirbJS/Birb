/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export default class Pair<Key, Value> {
  /**
   * The key of this pair.
   */
  key: Key;
  /**
   * The value of this pair.
   */
  value: Value;

  /**
   * A Pair is a key-value pair.
   *
   * @param {Key} key The key of this pair.
   * @param {Value} value The value of this pair.
   */
  constructor(key: Key, value: Value) {
    this.key = key;
    this.value = value;
  }
}
