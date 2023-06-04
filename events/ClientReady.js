import { Events } from 'discord.js';
import os from 'os';

import reactionTable from '../reactionTable.json' assert { type: 'json' };
import config from '../config.json' assert { type: 'json' };
import '../util.js';

async function addReactions(message) {
    let reactionTests = [];
    for (let reactionEntry of reactionTable.reactionTableEntries) {
        for (let reaction of reactionEntry.reactions) {
            dbg(`checking emoji ${reaction}...`);
            reactionTests.push((async (reaction) => {
                let messageReaction = await message.react(reaction);
                dbg(`checked emoji ${reaction}`)
                return messageReaction;
            })(reaction).catch(error => {
                let errorString = `Error when checking emoji ${reaction}: ${error}`;
                console.error(errorString);
                return Promise.reject(errorString);
            }));
        }
    }

    const outcomes = await Promise.allSettled(reactionTests);
    return outcomes;
}

async function removeReactions(messageReactions) {
    let reactionRemovalTests = [];
    for (let messageReaction of messageReactions) {
        dbg(`removing emoji ${messageReaction.emoji}...`);
        reactionRemovalTests.push((async (messageReaction) => {
            await messageReaction.remove();
            dbg(`removed emoji ${messageReaction.emoji}`);
        })(messageReaction).catch(error => {
            let errorString = `Error when removing emoji ${messageReaction.emoji}: ${error}`;
            if (error.code == 50013) { // missing permissions
                errorString += `\n`;
                errorString += `You need to grant the MANAGE_MESSAGES permission (8192) to the bot:`;
                errorString += `\n`;
                errorString += `Server Settings -> Roles -> Cowbot -> Permissions, then set "Manage Messages" to on.`;
            }
            console.error(errorString);
            return Promise.reject(errorString);
        }));
    }

    const results = await Promise.allSettled(reactionRemovalTests);
    return results;
}

async function startUp(client) {
    try {
        const guild = client.guilds.resolve(config.guildId);
        if(! guild) {
            console.error(`Error: config.guildId (${config.guildId}) does not seem to resolve to a valid guild`);
        }

        const channel = guild.channels.resolve(config.logChannelId);
        if(! channel) {
            console.error(`Error: config.logChannelId (${config.logChannelId}) does not seem to resolve to a valid channel`);
        }
        
        if(! channel.isTextBased()) {
            console.error(`Error: config.logChannelId (${config.logChannelId}) seems to be a non text-based channel`);
        }

        const startupMessageString = `
\`${client.user.tag}\` starting up on \`${os.hostname()} ${process.execPath} ${process.version} ${process.arch}\`
`;
        const startupMessage = await channel.send(startupMessageString);

        const reactionOutcomes= await addReactions(startupMessage);
        const errorCount = reactionOutcomes.filter(outcome => outcome.status === 'rejected').length;
        const messageReactions = reactionOutcomes.filter(outcome => outcome.status === 'fulfilled').map(outcome => outcome.value);

        const removalOutcomes = await removeReactions(messageReactions);
        const totalErrorCount = errorCount + removalOutcomes.filter(outcome => outcome.status === 'rejected').length;

        let startupMessageCompleteString = "";
        if (totalErrorCount > 0) {
            startupMessageCompleteString = `${totalErrorCount} errors occurred during startup, check logs.`;
        }
        else {
            startupMessageCompleteString = `No errors detected during startup.`;
        }
        startupMessageCompleteString += `  initialization time was ${process.uptime()} seconds`;
        channel.send(startupMessageCompleteString);

    } catch (error) {
        console.error(`Error when checking emoji: ${error}`);
    }
}

let eventName = Events.ClientReady;
let once = true;
function execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    startUp(client);
}

export { eventName, once, execute }