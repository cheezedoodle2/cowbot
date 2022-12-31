const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (message.author.bot) return;
        //console.log("message: " + message.cleanContent);
        if (message.cleanContent.search("moo") >= 0) {
            try {
                switch(Math.floor(Math.random() * 2)) {
                    case 0:
                        message.react("🐮");
                    case 1:
                        message.react("moo:1056104701839548456");
                }
            }
            catch(error) {
                console.log(error);
            }
        }
	},
};