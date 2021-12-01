import BaseUser from '../classes/BaseUser';
import ClientUser from '../classes/ClientUser';
import Guild from '../classes/Guild';
import Role from '../classes/Role';
import User from '../classes/User';

export type GuildResolvable = Guild | string;
export type RoleResolvable = Role | string;
export type UserResolvable = User | ClientUser | BaseUser | string;
export type EventResolvable = 'ready' | 'guildAvailable' | 'guildCreate' | 'guildUpdate' | 'message';
