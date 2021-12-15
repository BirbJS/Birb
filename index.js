const BirbJS = require('./dist/index');
const client = new BirbJS.Client({
    intents: new BirbJS.Intents(BirbJS.Intents.FLAGS.ALL)
})

client.listen('ready',() => {
    console.log('I is ready');
})

client.connect('');