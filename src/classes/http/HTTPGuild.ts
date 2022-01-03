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
import AddMember from "./guilds/AddMember";
import AddMemberRole from './guilds/AddMemberRole';
import BeginPrune from './guilds/BeginPrune';
import CreateBan from './guilds/CreateBan';
import CreateChannel from './guilds/CreateChannel';
import CreateRole from './guilds/CreateRole';
import Delete from './guilds/Delete';
import DeleteIntegration from './guilds/DeleteIntegration';
import DeleteRole from './guilds/DeleteRole';
import Get from './guilds/Get';
import GetActiveThreads from './guilds/GetActiveThreads';
import GetBan from './guilds/GetBan';
import GetBans from './guilds/GetBans';
import GetChannels from './guilds/GetChannels';
import GetIntegrations from './guilds/GetIntegrations';
import GetInvites from './guilds/GetInvites';
import GetMember from './guilds/GetMember';
import GetMembers from './guilds/GetMembers';
import GetPreview from './guilds/GetPreview';
import GetPruneCount from './guilds/GetPruneCount';
import GetRoles from './guilds/GetRoles';
import GetVanityURL from './guilds/GetVanityURL';
import GetVoiceRegions from './guilds/GetVoiceRegions';
import GetWelcomeScreen from './guilds/GetWelcomeScreen';
import GetWidget from './guilds/GetWidget';
import GetWidgetSettings from './guilds/GetWidgetSettings';
import Modify from './guilds/Modify';
import ModifyChannelPositions from './guilds/ModifyChannelPositions';
import ModifyCurrentMember from './guilds/ModifyCurrentMember';
import ModifyMember from './guilds/ModifyMember';
import ModifyRole from './guilds/ModifyRole';
import ModifyRolePositions from './guilds/ModifyRolePositions';
import ModifyVoiceState from './guilds/ModifyVoiceState';
import ModifyWelcomeScreen from './guilds/ModifyWelcomeScreen';
import ModifyWidget from './guilds/ModifyWidget';
import RemoveBan from './guilds/RemoveBan';
import RemoveMember from './guilds/RemoveMember';
import RemoveMemberRole from './guilds/RemoveMemberRole';
import SearchMembers from './guilds/SearchMembers';

export default class HTTPGuild {
    
    static addMember (client: Client, guildId: string, userId: string, data: any) {
        let request = new AddMember(client, guildId, userId, data);
        return request.make();
    }
    
    static addMemberRole (client: Client, guildId: string, userId: string, roleId: string, data: any, reason?: string) {
        let request = new AddMemberRole(client, guildId, userId, roleId, data, reason);
        return request.make();
    }

    static beginPrune (client: Client, guildId: string, data: any, reason?: string) {
        let request = new BeginPrune(client, guildId, data, reason);
        return request.make();
    }

    static createBan (client: Client, guildId: string, userId: string, data: any, reason?: string) {
        let request = new CreateBan(client, guildId, userId, data, reason);
        return request.make();
    }

    static createChannel (client: Client, guildId: string, data: any, reason?: string) {
        let request = new CreateChannel(client, guildId, data, reason);
        return request.make();
    }

    static createRole (client: Client, guildId: string, data: any, reason?: string) {
        let request = new CreateRole(client, guildId, data, reason);
        return request.make();
    }

    static delete (client: Client, guildId: string) {
        let request = new Delete(client, guildId);
        return request.make();
    }

    static deleteIntegration (client: Client, guildId: string, integrationId: string, reason?: string) {
        let request = new DeleteIntegration(client, guildId, integrationId, reason);
        return request.make();
    }

    static deleteRole (client: Client, guildId: string, roleId: string, reason?: string) {
        let request = new DeleteRole(client, guildId, roleId, reason);
        return request.make();
    }

    static get (client: Client, guildId: string) {
        let request = new Get(client, guildId);
        return request.make();
    }

    static getActiveThreads (client: Client, guildId: string) {
        let request = new GetActiveThreads(client, guildId);
        return request.make();
    }

    static getBan (client: Client, guildId: string, userId: string) {
        let request = new GetBan(client, guildId, userId);
        return request.make();
    }

    static getBans (client: Client, guildId: string) {
        let request = new GetBans(client, guildId);
        return request.make();
    }

    static getChannels (client: Client, guildId: string) {
        let request = new GetChannels(client, guildId);
        return request.make();
    }

    static getIntegrations (client: Client, guildId: string) {
        let request = new GetIntegrations(client, guildId);
        return request.make();
    }

    static getInvites (client: Client, guildId: string) {
        let request = new GetInvites(client, guildId);
        return request.make();
    }

    static getMember (client: Client, guildId: string, userId: string) {
        let request = new GetMember(client, guildId, userId);
        return request.make();
    }

    static getMembers (client: Client, guildId: string) {
        let request = new GetMembers(client, guildId);
        return request.make();
    }

    static getPreview (client: Client, guildId: string) {
        let request = new GetPreview(client, guildId);
        return request.make();
    }

    static getPruneCount (client: Client, guildId: string, days: number, includeRoles?: string) {
        let request = new GetPruneCount(client, guildId, days, includeRoles);
        return request.make();
    }

    static getRoles (client: Client, guildId: string) {
        let request = new GetRoles(client, guildId);
        return request.make();
    }

    static getVanityUrl (client: Client, guildId: string) {
        let request = new GetVanityURL(client, guildId);
        return request.make();
    }

    static getVoiceRegions (client: Client, guildId: string) {
        let request = new GetVoiceRegions(client, guildId);
        return request.make();
    }

    static getWelcomeScreen (client: Client, guildId: string) {
        let request = new GetWelcomeScreen(client, guildId);
        return request.make();
    }

    static getWidget (client: Client, guildId: string) {
        let request = new GetWidget(client, guildId);
        return request.make();
    }

    static getWidgetSettings (client: Client, guildId: string) {
        let request = new GetWidgetSettings(client, guildId);
        return request.make();
    }

    static modify (client: Client, guildId: string, data: any, reason?: string) {
        let request = new Modify(client, guildId, data, reason);
        return request.make();
    }

    static modifyChannelPositions (client: Client, guildId: string, data: any, reason?: string) {
        let request = new ModifyChannelPositions(client, guildId, data, reason);
        return request.make();
    }

    static modifyCurrentMember (client: Client, guildId: string, data: any, reason?: string) {
        let request = new ModifyCurrentMember(client, guildId, data, reason);
        return request.make();
    }

    static modifyMember (client: Client, guildId: string, userId: string, data: any, reason?: string) {
        let request = new ModifyMember(client, guildId, userId, data, reason);
        return request.make();
    }

    static modifyRole (client: Client, guildId: string, roleId: string, data: any, reason?: string) {
        let request = new ModifyRole(client, guildId, roleId, data, reason);
        return request.make();
    }

    static modifyRolePositions (client: Client, guildId: string, data: any, reason?: string) {
        let request = new ModifyRolePositions(client, guildId, data, reason);
        return request.make();
    }

    static modifyVoiceState (client: Client, guildId: string, userId: string, data: any, reason?: string) {
        let request = new ModifyVoiceState(client, guildId, userId, data, reason);
        return request.make();
    }

    static modifyWelcomeScreen (client: Client, guildId: string, data: any, reason?: string) {
        let request = new ModifyWelcomeScreen(client, guildId, data, reason);
        return request.make();
    }

    static modifyWidget (client: Client, guildId: string, data: any, reason?: string) {
        let request = new ModifyWidget(client, guildId, data, reason);
        return request.make();
    }

    static removeBan (client: Client, guildId: string, userId: string, reason?: string) {
        let request = new RemoveBan(client, guildId, userId, reason);
        return request.make();
    }

    static removeMember (client: Client, guildId: string, userId: string, reason?: string) {
        let request = new RemoveMember(client, guildId, userId, reason);
        return request.make();
    }

    static removeMemberRole (client: Client, guildId: string, userId: string, roleId: string, reason?: string) {
        let request = new RemoveMemberRole(client, guildId, userId, roleId, reason);
        return request.make();
    }

    static searchMembers (client: Client, guildId: string, query: string) {
        let request = new SearchMembers(client, guildId, query);
        return request.make();
    }

}
