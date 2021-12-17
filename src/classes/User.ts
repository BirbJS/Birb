/*
 * Copyright (c) 2021, knokbak and contributors.
 *
 * The Birb.JS Project: https://birb.js.org
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UserResolvable } from "../util/Types";
import BaseUser from "./BaseUser";
import Client from "./Client";
import HTTPChannel from "./http/HTTPChannel";
import HTTPUser from "./http/HTTPUser";
import Message from "./Message";
import PartialUser from "./PartialUser";

export default class User extends BaseUser {
    dmChannel: any = null;

    constructor(client: Client, data: any) {
        super(client, data);
        this.build(data);
    }

    private build(data: any) {
        this.username = data.username ?? 'Unknown';
        this.discriminator = data.discriminator ?? '0000';
        this.tag = `${this.username}#${this.discriminator}`;
        this.bot = data.bot ?? false;
        this.system = data.system ?? false;
        this.flags = data.public_flags ?? 0;

        if ('avatar' in data) {
            this.avatar = data.avatar;
        }
        if ('banner' in data) {
            this.banner = data.banner;
        }
        if ('accent_color' in data) {
            this.accentColor = data.accent_color;
        }
    }

    /**
     * Generate a link to the user's avatar.
     *
     * @param {Object} [options] The options to use when generating the URL.
     * @param {string} [options.format=png] The image format to use for the URL.
     * @param {boolean} [options.dynamic=false] Whether or not a GIF should be returned autoamtically if the user's avatar is animated.
     * @returns {string} The URL to the user's avatar.
     * @public
     */
    getAvatar(options?: { format?: 'png' | 'webp' | 'jpg' | 'gif'; dynamic?: boolean }): string {
        options = options ?? {};
        options = {
            format: options.format || 'png',
            dynamic: options.dynamic ?? false
        };

        if (!this.avatar) {
            return `https://cdn.discord.com/avatars/${this.id}/${parseInt(this.discriminator) % 5}.png`;
        }

        if (options.dynamic && this.avatar.startsWith('a_')) {
            return `https://cdn.discord.com/avatars/${this.id}/${this.avatar}.gif`;
        } else {
            return `https://cdn.discord.com/avatars/${this.id}/${this.avatar}.${options.format}`;
        }
    }

    /**
     * Generate a link to the user's avatar.
     *
     * @param {Object} [options] The options to use when generating the URL.
     * @param {string} [options.format=png] The image format to use for the URL.
     * @param {boolean} [options.dynamic=false] Whether or not a GIF should be returned autoamtically if the user's banner is animated.
     * @returns {string} The URL to the user's banner.
     * @public
     */
    getBanner(options?: { format?: 'png' | 'webp' | 'jpg' | 'gif'; dynamic?: boolean }): string {
        options = options ?? {};
        options = {
            format: options.format || 'png',
            dynamic: options.dynamic ?? false
        };

        if (!this.banner) {
            return `https://cdn.discord.com/banners/${this.id}/${parseInt(this.discriminator) % 5}.png`;
        }

        if (options.dynamic && this.banner.startsWith('a_')) {
            return `https://cdn.discord.com/banners/${this.id}/${this.banner}.gif`;
        } else {
            return `https://cdn.discord.com/banners/${this.id}/${this.banner}.${options.format}`;
        }
    }

    /**
     * Determine if the user's avatar is default.
     *
     * @returns {boolean} Whether or not the user's avatar is default.
     * @public
     */
    hasDefaultAvatar(): boolean {
        return this.avatar === null;
    }

    /**
     * Fetch this user again.
     *
     * @param {Object} [options] The options to use when fetching the user.
     * @param {boolean} [options.shouldCache=true] Whether or not to cache the result.
     * @param {boolean} [options.bypassCache=true] Whether or not to bypass the cache.
     * @returns {Promise<User>} A promise that resolves with the updated user.
     * @public
     */
    async fetch(options?: { shouldCache?: boolean | undefined; bypassCache?: boolean | undefined }): Promise<User> {
        options = options ?? {};
        options.bypassCache = options.bypassCache ?? true;
        return this.client.users.fetch(this.id, options);
    }

    /**
     * Send a message to the user.
     *
     * @param {string} [content] The content of the message.
     * @returns {Promise<Message>} A promise that resolves with the new message.
     * @public
     */
    async send(content: string): Promise<Message> {
        if (!this.dmChannel) {
            this.dmChannel = await HTTPUser.createDM(this.client, this.id);
        }
        let message = await HTTPChannel.createMessage(this.client, this.dmChannel.id, { content });
        message = (await new Message(this.client, message))['waitForAuthor']();
        return message;
    }

    /**
     * Convert this User into a mention (string).
     *
     * @returns {string} A string that mentions this user.
     */
    toString(): string {
        return `<@${this.id}>`;
    }

    /**
     * Set the User's data to the cache.
     *
     * @returns {User} This User instance.
     * @private
     */
    private set(): User {
        this.client.users.cache.set(this.id, this);
        return this;
    }

    /**
     * Either fetch a User from the cache or return a
     * PartialUser instance to avoid fetching from the API.
     *
     * @param {Client} client The client to use.
     * @param {Object} data The data on the user (`id` is required).
     * @returns {User | PartialUser} The User or PartialUser.
     */
    private static retrieveOrBuildPartial(client: Client, data: any): User | PartialUser {
        let cached = client.users.cache.get(data.id);
        if (cached) return cached;
        return new PartialUser(client, data);
    }

    private static toIdOnly(user: UserResolvable): string {
        if (typeof user === 'string') {
            return user;
        } else if (user instanceof User) {
            return user.id;
        } else {
            throw new TypeError(`Expected a string or User, received ${typeof user}`);
        }
    }
}
