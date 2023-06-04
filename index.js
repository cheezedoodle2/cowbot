import fs from 'node:fs';
import path from 'node:path';
import { Client, Collection, Events, GatewayIntentBits, parseEmoji } from 'discord.js';
import config from './config.json' assert { type: 'json' };
import './util.js';

const client = new Client(
    { 
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers, 
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.MessageContent
        ]
    }
);

client.commands = new Collection();

const commandsPath = path.join(path.dirname(new URL(import.meta.url).pathname), 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    dbg(`Loading command file ${filePath}...`);
    const { command } = await import(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

const eventsPath = path.join(path.dirname(new URL(import.meta.url).pathname), 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    dbg(`Loading event file ${filePath}...`);
    const eventModule = await import(filePath)
    const { eventName, once, execute } = eventModule;
    if (once) {
        client.once(eventName, (...args) => execute(...args));
    } else {
        client.on(eventName, (...args) => execute(...args));
    }
    dbg(`Loaded event file ${filePath}, eventName: ${eventName}, once: ${once}`);
}

// Log in to Discord with your client's token
client.login(config.token);

