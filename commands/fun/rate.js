const fs = require('fs');
const rates = JSON.parse(fs.readFileSync("./rate.json", "utf8"));

module.exports = {
    name: 'rate',
    description: 'Rate a user with random appreciation',
    execute: async (client, message, args) => {
        const mention = message.mentions.users.first();
        if (!mention) return message.reply("You must mention someone!");

        const note = Math.floor(Math.random() * 99) + 1;
        const rateInfo = rates.find(r => r.note === note);

        message.channel.send(`I rate **${mention.username}** : ${note}/99 (${rateInfo.appreciation})`);
    }
};