/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import GuildError from '../errors/GuildError';
import Client from './Client';
import Color from '../util/Color';
import Guild from './Guild';
import HTTPGuild from './http/HTTPGuild';
import OptionError from '../errors/OptionError';
import RolePermissionsBlock from './blocks/RolePermissionsBlock';
import { RoleResolvable } from '../util/Types';

export default class Role {
    
    /**
     * The client that this Role belongs to.
     */
    client: Client = null!;
    /**
     * The ID of this Role.
     */
    readonly id: string;
    /**
     * The guild this Role belongs to.
     */
    guild: Guild = null!;
    /**
     * The name of this Role.
     */
    name: string | null = null;
    /**
     * The color of this Role as a hex color string.
     */
    color: string | null = null;
    /**
     * Whether or not this Role is hoisted on the member
     * list.
     */
    hoist: boolean | null = null;
    /**
     * The icon hash of this Role.
     */
    icon: string | null = null;
    /**
     * Whether or not this Role is managed by Discord,
     * another application or a bot. If so, it cannot be
     * deleted.
     */
    managed: boolean | null = null;
    /**
     * Whether or not anyone can mention this Role.
     */
    mentionable: boolean | null = null;
    /**
     * The permissions of this Role.
     */
    permissions: RolePermissionsBlock = null!;
    /**
     * The position of this Role.
     */
    position: number | null = null;
    /**
     * The unicode emoji of this Role.
     */
    unicodeEmoji: string | null = null;

    /**
     * A Role represents a role in a guild on Discord.
     * 
     * @param {Client} client The client that this Role belongs to.
     * @param {any} data The data of this Role.
     * @param {Guild} guild The guild this Role belongs to.
     */
    constructor (client: Client, data: any, guild: Guild) {
        if (typeof data.id !== 'string') {
            throw new GuildError('invalid role data provided');
        }
        this.client = client;
        this.id = data.id;
        this.guild = guild;
        this.build(data);
    }

    /**
     * Build this Role.
     * 
     * @param {any} data The data to build this Role with.
     * @returns {Role} This Role.
     */
    private build (data: any): Role {
        if ('name' in data) {
            this.name = data.name;
        }
        if ('color' in data) {
            let hex: string = Color.intToHex(data.color);
            this.color = `#${hex === '00' ? '000000' : hex}`;
        }
        if ('hoist' in data) {
            this.hoist = data.hoist;
        }
        if ('icon' in data) {
            this.icon = data.icon;
        }
        if ('managed' in data) {
            this.managed = data.managed;
        }
        if ('mentionable' in data) {
            this.mentionable = data.mentionable;
        }
        if ('permissions' in data) {
            this.permissions = new RolePermissionsBlock(this.client, this, BigInt(data.permissions) ?? 0n);
        }
        if ('position' in data) {
            this.position = data.position;
        }
        if ('unicode_emoji' in data) {
            this.unicodeEmoji = data.unicode_emoji;
        }

        return this;
    }

    /**
     * Delete this Role.
     * 
     * @param {string} [reason] The reason for deleting this Role.
     * @returns {Promise<void>} A Promise that voids when the Role has been deleted.
     */
    async delete (reason?: string): Promise<void> {
        await HTTPGuild.deleteRole(this.client, this.guild.id, this.id, reason);
    }

    /**
     * Set the name of this Role.
     * 
     * @param {string} name The name to set this Role to.
     * @param {string} [reason] The reason for modifying this Role.
     * @returns {Promise<Role>} A Promise that resolves to the modified Role.
     */
    setName (name: string, reason?: string): Promise<Role> {
        if (name === undefined) {
            throw new OptionError('name [at 0] must be provided');
        }
        if (typeof name !== 'string') {
            throw new OptionError('name [at 0] must be a string with a length of at least 1 character');
        }
        return this.modify({ name }, reason);
    }

    /**
     * Set the position of this Role.
     * 
     * @param {number} position The position to set this Role to.
     * @param {string} [reason] The reason for modifying this Role.
     * @returns {Promise<Role>} A Promise that resolves to the modified Role.
     */
    setPosition (position: number, reason?: string): Promise<Role> {
        if (position === undefined) {
            throw new OptionError('position [at 0] must be provided');
        }
        if (typeof position !== 'number' || position < 0) {
            throw new OptionError('position [at 0] must be a positive number');
        }
        return HTTPGuild.modifyRolePositions(this.client, this.guild.id, [{ id: this.id, position }], reason);
    }

    /**
     * Move this Role's position.
     * 
     * @param {number} velocity The velocity to apply to this Role's position. Provide a positive integer to move this Role up, and a negative integer to move this Role down.
     * @param {string} [reason] The reason for modifying this Role.
     * @returns {Promise<Role>} A Promise that resolves to the modified Role.
     */
    move (velocity: number, reason?: string): Promise<Role> {
        if (velocity === undefined) {
            throw new OptionError('velocity [at 0] must be provided');
        }
        if (typeof velocity !== 'number') {
            throw new OptionError('velocity [at 0] must be a number');
        }
        let position = this.position != null ? this.position + velocity : 1;
        return this.setPosition(position, reason);
    }

    /**
     * Set the color of this Role.
     * 
     * @param {number | string} color The new color for this Role. Accepts HEX color codes (e.g. ffffff for white) or an RGB integer.
     * @param {string} [reason] The reason for modifying this Role.
     * @returns {Promise<Role>} A Promise that resolves to the modified Role.
     */
    setColor (color: number | string, reason?: string): Promise<Role> {
        if (color === undefined) {
            throw new OptionError('color [at 0] must be provided');
        }
        if (typeof color == 'number') {
            return this.modify({ color }, reason);
        } else if (typeof color == 'string') {
            return this.modify({ color: Color.hexToInt(color) }, reason);
        } else {
            throw new OptionError('color [at 0] must be a number or string');
        }
    }

    /**
     * Set if this Role can be mentioned.
     * 
     * @param {boolean} mentionable Whether or not this Role can be mentioned.
     * @param {string} [reason] The reason for modifying this Role.
     * @returns {Promise<Role>} A Promise that resolves to the modified Role.
     */
    setIsMentionable (mentionable: boolean, reason?: string): Promise<Role> {
        if (mentionable === undefined) {
            throw new OptionError('mentionable [at 0] must be provided');
        }
        if (typeof mentionable !== 'boolean') {
            throw new OptionError('mentionable [at 0] must be a boolean');
        }
        return this.modify({ mentionable }, reason);
    }

    /**
     * Set if this members of this Role should be hoisted
     * on the member list.
     * 
     * @param {boolean} hoisted Whether or not this Role should be hoisted on the member list.
     * @param {string} [reason] The reason for modifying this Role.
     * @returns {Promise<Role>} A Promise that resolves to the modified Role.
     */
    setIsHoisted (hoisted: boolean, reason?: string): Promise<Role> {
        if (hoisted === undefined) {
            throw new OptionError('hoisted [at 0] must be provided');
        }
        if (typeof hoisted !== 'boolean') {
            throw new OptionError('hoisted [at 0] must be a boolean');
        }
        return this.modify({ hoist: hoisted }, reason);
    }

    /**
     * Modify this Role.
     * 
     * @param {Object} data The data to modify this Role with.
     * @param {string} [reason] The reason for modifying this Role.
     * @returns {Promise<Role>} A Promise that resolves to the modified Role.
     */
    async modify (data: any, reason?: string): Promise<Role> {
        let res = await HTTPGuild.modifyRole(this.client, this.guild.id, this.id, data, reason);
        this.build(res);
        return this.set();
    }

    /**
     * Convert this Role into a mention (string).
     * 
     * @returns {string} A string that mentions this role.
     */
    toString (): string {
        return `<@&${this.id}>`;
    }

    /**
     * Handle updates from the Discord Gateway.
     * 
     * @param {Client} client The client that received the update.
     * @param {any} data The data to handle.
     * @param {Guild} guild The Guild this Role belongs to.
     * @returns {Role} A reference to this Role.
     */
    private static handleUpdate (client: Client, data: any, guild: Guild): Role {
        let role: Role = guild.roles.cache.get(data.id);
        if (role) {
            role.build(data);
            guild.roles.cache.set(data.id, role);
            return role;
        }
        role = new Role(client, data, guild);
        guild.roles.cache.set(data.id, role);
        return role;
    }

    /**
     * Set the Role's data to the cache.
     * 
     * @returns {Role} This Role instance.
     * @private
     */
    private set (): Role {
        this.client.guilds.cache.set(this.id, this);
        return this;
    }

    /**
     * Convert a RoleResolvable into a role ID (string).
     * 
     * @param {RoleResolvable} role The Role to convert.
     * @returns {string} The ID of the Role.
     */
    protected static toIdOnly (role: RoleResolvable): string {
        if (typeof role === 'string') {
            return role;
        } else if (role instanceof Role) {
            return role.id;
        } else {
            throw new TypeError(`Expected a string or Role, received ${typeof role}`);
        }
    }

}
