/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Client from '../Client';
import Role from '../Role';
import PermissionsBlock from './PermissionsBlock';
import Permissions from '../Permissions';
import { PermissionResolvable } from '../../util/Types';

export default class RolePermissionsBlock extends PermissionsBlock {
  /**
   * The Role this PermissionsBlock is for.
   */
  role: Role = null!;

  /**
   * A RolePermissionsBlock stores role permissions data.
   *
   * @param {Client} client The client instance.
   * @param {Role} role The Role this PermissionsBlock is for.
   * @param {Permissions.FLAGS | Permissions.FLAGS[] | number} flags The permissions to set.
   */
  constructor(client: Client, role: Role, flags: PermissionResolvable) {
    super(client, flags);
    this.role = role;
  }

  /**
   * Grant the role the specified permissions.
   *
   * @param {Permissions.FLAGS | Permissions.FLAGS[] | number} permissions The permissions to grant.
   * @param {Object} options The options for the action.
   * @param {string} [options.reason] The reason for the action.
   * @returns {Promise<Role>} A Promise that resolves to the modified Role.
   */
  async grant(
    permissions: PermissionResolvable,
    options: {
      reason?: string;
    } = {}
  ): Promise<Role> {
    let bits = this.permissions.clone();
    bits.add(permissions);
    return await this.set(bits.bitfield, options);
  }

  /**
   * Revoke the specified permissions from the Role.
   *
   * @param {Permissions.FLAGS | Permissions.FLAGS[] | number} permissions The permissions to revoke.
   * @param {Object} options The options for the action.
   * @param {string} [options.reason] The reason for the action.
   * @returns {Promise<Role>} A Promise that resolves to the modified Role.
   */
  async revoke(
    permissions: PermissionResolvable,
    options: {
      reason?: string;
    } = {}
  ): Promise<Role> {
    let bits = this.permissions.clone();
    bits.remove(permissions);
    return await this.set(bits.bitfield, options);
  }

  /**
   * Set the permissions for the Role.
   *
   * @param {Permissions.FLAGS | Permissions.FLAGS[] | number} permissions The permissions to set.
   * @param {Object} options The options for the action.
   * @param {string} [options.reason] The reason for the action.
   * @returns {Promise<Role>} A Promise that resolves to the modified Role.
   */
  async set(
    permissions: PermissionResolvable,
    options: {
      reason?: string;
    } = {}
  ): Promise<Role> {
    let bits = new Permissions(0);
    bits.set(permissions);
    if (bits.bitfield == this.permissions.bitfield) return this.role;
    return await this.role.modify({ permissions: bits.bitfield }, options.reason);
  }
}
