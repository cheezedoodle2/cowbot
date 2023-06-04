import { Events } from 'discord.js';
import reactionTable from '../reactionTable.json' assert { type: 'json' };

let eventName = Events.MessageCreate;
let once = false;
async function execute(message) {
    if (message.author.bot) return;
    dbg("message: " + message.cleanContent);
    if (message.cleanContent.search("e-girl") >= 0) {
        message.reply("I'm not an e-girl!  -- Brooke");
    }
    for(let reaction of reactionTable.reactionTableEntries) {
        try {
            if (message.cleanContent.match(reaction.pattern)) {
                message.react(reaction.reactions[Math.floor(Math.random() * reaction.reactions.length)]);
            }
        }
        catch(error) {
            console.log("Error adding reaction: ", error);
        }
    }
}

export { eventName, once, execute }
