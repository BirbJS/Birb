const DiscordHTTPError = require('../classes/errors/DiscordHTTPError');

module.exports = {
    '400': (body) => {
        return new DiscordHTTPError(`400 Bad Request: ${body.message || 'Your request was invalid.'}`);
    },
    '401': (body) => {
        return new DiscordHTTPError(`401 Unauthorized: ${body.message || 'Invalid token provided.'}`);
    },
    '403': (body) => {
        return new DiscordHTTPError(`403 Forbidden: ${body.message || 'You do not have permission to perform that action.'}`);
    },
    '404': (body) => {
        return new DiscordHTTPError(`404 Not Found: ${body.message || 'That resource does not exist.'}`);
    },
    '405': (body) => {
        return new DiscordHTTPError(`405 Method Not Allowed: ${body.message || 'Invalid request method.'}`);
    },
    '429': (body) => {
        return new DiscordHTTPError(`429 Too Many Requests: ${body.message || 'You\'re being rate limited!'}`);
    },
    '500': (body) => {
        return new DiscordHTTPError(`500 Internal Server Error: ${body.message || 'Something went wrong on Discord\'s end. Wait a bit and retry.'}`);
    },
    '502': (body) => {
        return new DiscordHTTPError(`502 Gateway Unavailable: ${body.message || 'There was not a gateway available to process your request. Wait a bit and retry.'}`);
    },
}
