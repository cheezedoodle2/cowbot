import { Events } from 'discord.js';
import reactionTable from '../reactionTable.json' assert { type: 'json' };

let eventName = Events.MessageCreate;
let once = false;
async function execute(message) {
    if (message.author.bot) return;
    dbg("message: " + message.cleanContent);
    for(let reaction of reactionTable.reactionTableEntries) {
        try {
            if (message.cleanContent.match(reaction.pattern)) {
                if(reaction.reactions?.length > 0) {
                    message.react(reaction.reactions[Math.floor(Math.random() * reaction.reactions.length)]);
                }
                if(reaction.replyMessages?.length > 0) {
                    message.reply(reaction.replyMessages[Math.floor(Math.random() * reaction.replyMessages.length)]);
                }
            }
        }
        catch(error) {
            console.log("Error adding reaction: ", error);
        }
    }
}

export { eventName, once, execute }
