const IntentsError = require("./errors/IntentsError");
const ParsingError = require("./errors/ParsingError");

const FLAGS = {
    GUILDS: 1 << 0,
    GUILD_MEMBERS: 1 << 1,
    GUILD_BANS: 1 << 2,
    GUILD_EMOJIS_AND_STICKERS: 1 << 3,
    GUILD_INTEGRATIONS: 1 << 4,
    GUILD_WEBHOOKS: 1 << 5,
    GUILD_INVITES: 1 << 6,
    GUILD_VOICE_STATES: 1 << 7,
    GUILD_PRESENCES: 1 << 8,
    GUILD_MESSAGES: 1 << 9,
    GUILD_MESSAGE_REACTIONS: 1 << 10,
    GUILD_MESSAGE_TYPING: 1 << 11,
    DIRECT_MESSAGES: 1 << 12,
    DIRECT_MESSAGE_REACTIONS: 1 << 13,
    DIRECT_MESSAGE_TYPING: 1 << 14,
    GUILD_SCHEDULED_EVENTS: 1 << 15,
}

class Intents {

    flags = 0;

    constructor (...flags) {
        if (flags.length > 0) {
            this.add(...flags);
            this.flags = flags.reduce((a, b) => a | b, 0);
        }
    }

    has (flag) {
        return (this.flags & flag) == flag;
    }

    add (...flags) {
        let result = this.flags || 0;
        if (flags.length === 0) {
            throw new IntentsError('no flags provided');
        }
        for ( let i = 0; i < flags.length; i++ ) {
            let valid = false;
            for ( let flag in FLAGS ) {
                if ( FLAGS[flag] === flags[i] ) {
                    valid = true;
                    break;
                }
            }

            if (!valid) {
                throw new IntentsError(`invalid intent flag provided at flags[${i}]`);
            }
            if ((result & flags[i]) == flags[i]) {
                throw new IntentsError(`intent flag ${flags[i]} at flags[${i}] is already set`);
            }
            result |= flags[i];
        }
        this.flags = result;
        return this;
    }

    remove (...flags) {
        if (flags.length === 0) {
            throw new IntentsError('no flags provided');
        }
        for ( let i = 0; i < flags.length; i++ ) {
            if ( !(flags[i] in FLAGS && typeof flags[i] === 'number') ) {
                throw new IntentsError(`invalid intent flag provided at flags[${i}]`);
            }
        }
        this.flags &= ~flags.reduce((a, b) => a | b, 0);
        return this;
    }

    toString () {
        return `Intents{${this.flags}}`;
    }

}

Intents.fromString = function (str) {
    if (!str.startsWith('Intents{') || !str.endsWith('}')) {
        throw new ParsingError('invalid intents string provided');
    }
    let parsed = str.substring(9, str.length - 1);
    let flags = parseInt(parsed);
    if (isNaN(flags)) {
        throw new ParsingError('invalid intents string provided');
    }
    return new Intents(flags);
}

Intents.FLAGS = FLAGS;
module.exports = Intents;
