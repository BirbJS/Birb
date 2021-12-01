[![huntr](https://cdn.huntr.dev/huntr_security_badge_mono.svg)](https://huntr.dev)
[![Known Vulnerabilities](https://snyk.io/test/github/BirbJS/Birb/badge.svg)](https://snyk.io/test/github/BirbJS/Birb)

[![NPM](https://nodei.co/npm/birb.png)](https://nodei.co/npm/birb/)

# Birb.JS
Birb.JS is a Discord API wrapper for Node.JS. It’s built to be simple, yet powerful. With just a few lines of code, you can get a Discord bot connected to the Discord API. **Birb.JS is still in development. It is highly recommended you don’t use it until it’s ready.**

## Links
[Documentation](https://birb.js.org/)    
[GitHub Repo](https://github.com/BirbJS/Birb)    
[NPM Page](https://npmjs.com/package/birb)

## Installation
Birb.JS is listed on [npm](https://www.npmjs.com/package/birb)! You can install it by running `npm install birb --save`.

### Optional Dependencies
These dependencies aren't required, but will allow Birb.JS to do things more efficiently.

- [erlpack](https://npmjs.com/package/erlpack) for faster serialization of websocket data: `npm install erlpack --save`
- [zlib-sync](https://npmjs.com/package/zlib-sync) for websocket compression: `npm install zlib-sync --save`
- [bufferutil](https://npmjs.com/package/bufferutil) quicker masking and unmasking of websocket data and packets: `npm install bufferutil --save`
- [utf-8-validate](https://npmjs.com/package/utf-8-validate) more efficient websocket data validation: `npm install utf-8-validate --save`

Most of these dependencies require [node-gyp](https://github.com/nodejs/node-gyp) which some users may struggle to install (mostly due to very unhelpful errors). If you're on Windows and having issues, try running `npm install windows-build-tools --global` in an **administrator** command prompt. If you're on Ubuntu, try `sudo apt install build-tools`. *Remember that these are optional dependencies. If you're struggling, feel free to ignore them. Birb.JS will only use them if they are available.*

## Example
```js
const { Client, Intents } = require('birb');
let client = new Client({
    intents: new Intents(Intents.FLAGS.ALL),
});

client.on('ready', () => {
    console.log('Connected to Discord!');
});

client.connect('your_token');
```

## Licensing
Birb.JS is currently licensed under the [Mozilla Public License 2.0](https://github.com/BirbJS/Birb/blob/main/LICENSE). You're free to use it as a library in both personal and commercial projects, free-of-charge.
