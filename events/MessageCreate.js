const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (message.author.bot) return;
        //console.log("message: " + message.cleanContent);
        if (message.author == "551571201437466625" &&
            message.cleanContent.search("e-girl") >= 0) {
                message.react("I'm not an e-girl!  -- Brooke");
        }
        if (message.cleanContent.search("moo") >= 0) {
            try {
                switch(Math.floor(Math.random() * 2)) {
                    case 0:
                        message.react("🐮");
                        break;
                    case 1:
                        message.react("moo:1056104701839548456");
                        break;
                }
            }
            catch(error) {
                console.log(error);
            }
        }
	},
};