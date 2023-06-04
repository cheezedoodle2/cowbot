import { Events } from 'discord.js';
import '../util.js';

let eventName = Events.Debug;
let once = false;
async function execute(info) {
    try {
        dbg(info);
    }
    catch(error) {
        console.error(`well, that didn't work: ${error}`);
    }
}

export { eventName, once, execute }