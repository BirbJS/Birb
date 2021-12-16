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
import AddThreadMember from './channels/AddThreadMember';
import BulkDeleteMessages from './channels/BulkDeleteMessages';
import CreateInvite from './channels/CreateInvite';
import CreateMessage from './channels/CreateMessage';
import CreateMessageReaction from './channels/CreateMessageReaction';
import CrossPostMessage from './channels/CrossPostMessage';
import Delete from './channels/Delete';
import DeleteAllMessageReactions from './channels/DeleteAllMessageReactions';
import DeleteAllMessageReactionsForEmoji from './channels/DeleteAllMessageReactionsForEmoji';
import DeleteMessage from './channels/DeleteMessage';
import DeleteMessageReaction from './channels/DeleteMessageReaction';
import DeleteOwnMessageReaction from './channels/DeleteOwnMessageReaction';
import DeletePermission from './channels/DeletePermission';
import DMAddRecipient from './channels/DMAddRecipient';
import DMRemoveRecipient from './channels/DMRemoveRecipient';
import EditMessage from './channels/EditMessage';
import EditPermissions from './channels/EditPermissions';
import FollowChannel from './channels/FollowChannel';
import GetInvites from './guilds/GetInvites';
import GetMessage from './channels/GetMessage';
import GetMessageReactions from './channels/GetMessageReactions';
import GetMessages from './channels/GetMessages';
import GetPinnedMessages from './channels/GetPinnedMessages';
import GetThreadMember from './channels/GetThreadMember';
import JoinThread from './channels/JoinThread';
import LeaveThread from './channels/LeaveThread';
import ListActiveThreads from './channels/ListActiveThreads';
import ListThreadMembers from './channels/ListThreadMembers';
import Modify from './guilds/Modify';
import PinMessage from './channels/PinMessage';
import RemoveThreadMember from './channels/RemoveThreadMember';
import StartThreadWithMessage from './channels/StartThreadWithMessage';
import StartThreadWithoutMessage from './channels/StartThreadWithoutMessage';
import TriggerTypingIndicator from './channels/TriggerTypingIndicator';
import UnpinMessage from './channels/UnpinMessage';
import MessageAttachment from '../message/MessageAttachment';
import Message from '../Message';

export default class HTTPChannel {
    
    static addThreadMember (client: Client, channelId: string, userId: string) {
        let request = new AddThreadMember(client, channelId, userId);
        return request.make();
    }
    
    static bulkDeleteMessages (client: Client, channelId: string, data: any, reason?: string) {
        let request = new BulkDeleteMessages(client, channelId, data, reason);
        return request.make();
    }
    
    static createInvite (client: Client, channelId: string, data: any, reason?: string) {
        let request = new CreateInvite(client, channelId, data, reason);
        return request.make();
    }
    
    static createMessage (client: Client, channelId: string, data: any) {
        let request = new CreateMessage(client, channelId, data);
        if (data.attachments) {
            let attachements: MessageAttachment[] = data.attachments ?? [];
            delete data.attachments;
            return request.make(attachements);
        }
        return request.make();
    }
    
    static createMessageReaction (client: Client, channelId: string, messageId: string, emoji: string) {
        let request = new CreateMessageReaction(client, channelId, messageId, emoji);
        return request.make();
    }

    static crossPostMessage (client: Client, channelId: string, messageId: string) {
        let request = new CrossPostMessage(client, channelId, messageId);
        return request.make();
    }
    
    static delete (client: Client, channelId: string, reason?: string) {
        let request = new Delete(client, channelId, reason);
        return request.make();
    }
    
    static deleteAllMessageReactions (client: Client, channelId: string, messageId: string) {
        let request = new DeleteAllMessageReactions(client, channelId, messageId);
        return request.make();
    }
    
    static deleteAllMessageReactionsForEmoji (client: Client, channelId: string, messageId: string, emoji: string) {
        let request = new DeleteAllMessageReactionsForEmoji(client, channelId, messageId, emoji);
        return request.make();
    }

    static deleteMessage (client: Client, channelId: string, messageId: string, reason?: string) {
        let request = new DeleteMessage(client, channelId, messageId, reason);
        return request.make();
    }

    static deleteMessageReaction (client: Client, channelId: string, messageId: string, userId: string, emoji: string) {
        let request = new DeleteMessageReaction(client, channelId, messageId, userId, emoji);
        return request.make();
    }

    static deleteOwnMessageReaction (client: Client, channelId: string, messageId: string, emoji: string) {
        let request = new DeleteOwnMessageReaction(client, channelId, messageId, emoji);
        return request.make();
    }

    static deletePermission (client: Client, channelId: string, overwriteId: string, reason?: string) {
        let request = new DeletePermission(client, channelId, overwriteId, reason);
        return request.make();
    }

    static dmAddRecipient (client: Client, channelId: string, userId: string, data: any) {
        let request = new DMAddRecipient(client, channelId, userId, data);
        return request.make();
    }

    static dmRemoveRecipient (client: Client, channelId: string, userId: string) {
        let request = new DMRemoveRecipient(client, channelId, userId);
        return request.make();
    }

    static editMessage (client: Client, channelId: string, messageId: string, data: any, original?: Message) {
        let request = new EditMessage(client, channelId, messageId, data);
        if (data.attachments) {
            if (original) {
                let attachments = [];
                for ( let i = 0; i < original.attachments.length; ++i ) {
                    let attachment = original.attachments[i];
                    if (data.attachments.find((x: MessageAttachment) => x.id === attachment.id)) {
                        attachments.push({ id: attachment.id });
                    }
                }
                data.attachmenets = attachments;
                return request.make(data.attachments ?? []);
            }
            let attachements: MessageAttachment[] = data.attachments ?? [];
            delete data.attachments;
            return request.make(attachements);
        }
        return request.make();
    }

    static editPermissions (client: Client, channelId: string, overwriteId: string, data: any) {
        let request = new EditPermissions(client, channelId, overwriteId, data);
        return request.make();
    }

    static followChannel (client: Client, channelId: string, data: any) {
        let request = new FollowChannel(client, channelId, data);
        return request.make();
    }

    static getInvites (client: Client, channelId: string) {
        let request = new GetInvites(client, channelId);
        return request.make();
    }

    static getMessage (client: Client, channelId: string, messageId: any) {
        let request = new GetMessage(client, channelId, messageId);
        return request.make();
    }

    static getMessageReactions (client: Client, channelId: string, messageId: any, emoji: string) {
        let request = new GetMessageReactions(client, channelId, messageId, emoji);
        return request.make();
    }

    static getMessages (client: Client, channelId: string, data: any) {
        let request = new GetMessages(client, channelId, data);
        return request.make();
    }

    static getPinnedMessages (client: Client, channelId: string) {
        let request = new GetPinnedMessages(client, channelId);
        return request.make();
    }

    static getThreadMember (client: Client, channelId: string, userId: string) {
        let request = new GetThreadMember(client, channelId, userId);
        return request.make();
    }

    static joinThread (client: Client, channelId: string) {
        let request = new JoinThread(client, channelId);
        return request.make();
    }

    static leaveThread (client: Client, channelId: string) {
        let request = new LeaveThread(client, channelId);
        return request.make();
    }

    static listActiveThreads (client: Client, channelId: string) {
        let request = new ListActiveThreads(client, channelId);
        return request.make();
    }

    static listThreadMembers (client: Client, channelId: string) {
        let request = new ListThreadMembers(client, channelId);
        return request.make();
    }

    static modify (client: Client, channelId: string, data: any, reason?: string) {
        let request = new Modify(client, channelId, data, reason);
        return request.make();
    }

    static pinMessage (client: Client, channelId: string, messageId: string, reason?: string) {
        let request = new PinMessage(client, channelId, messageId, reason);
        return request.make();
    }

    static removeThreadMember (client: Client, channelId: string, userId: string) {
        let request = new RemoveThreadMember(client, channelId, userId);
        return request.make();
    }

    static startThreadWithMessage (client: Client, channelId: string, messageId: string, data: any, reason?: string) {
        let request = new StartThreadWithMessage(client, channelId, messageId, data, reason);
        return request.make();
    }

    static startThreadWithoutMessage (client: Client, channelId: string, data: any, reason?: string) {
        let request = new StartThreadWithoutMessage(client, channelId, data, reason);
        return request.make();
    }

    static triggerTypingIndicator (client: Client, channelId: string) {
        let request = new TriggerTypingIndicator(client, channelId);
        return request.make();
    }

    static unpinMessage (client: Client, channelId: string, messageId: string, reason?: string) {
        let request = new UnpinMessage(client, channelId, messageId, reason);
        return request.make();
    }

}
