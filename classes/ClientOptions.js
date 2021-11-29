const Intents = require('./Intents');

class ClientOptions {

    constructor (options) {
        if (!options.intents) {
            throw new ClientInitializationError('options.intents must be provided');
        }
        if (!(options.intents instanceof Intents)) {
            throw new ClientInitializationError('options.intents must be an instance of Intents');
        }

        this.intents = options.intents;
        this.cdnDomain = options.cdnDomain || 'cdn.discord.com';
        this.inviteDomain = options.inviteDomain || 'discord.gg';
        this.gatewayVersion = options.gatewayVersion || 9;
        this.debug = options.debug || false;
    }

    get (key) {
        return this[key];
    }

    set (key, value) {
        this[key] = value;
        return this;
    }

    remove (key) {
        delete this[key];
        return this;
    }

    has (key) {
        return this.hasOwnProperty(key);
    }

    clear () {
        Object.keys(this).forEach(key => {
            delete this[key];
        });
        return this;
    }

    toDefault () {
        this.intents = new Intents(Intents.FLAGS.NOT_PRIVILEGED);
        this.cdnDomain = 'cdn.discord.com';
        this.inviteDomain = 'discord.gg';
        this.debug = false;
        return this;
    }

}

module.exports = ClientOptions;
