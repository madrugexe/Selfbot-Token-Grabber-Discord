const cacas = require('../../poop.json');

module.exports = {
    name: 'caca',
    description: 'Throw "caca" on a user with random response',
    execute: async (client, message, args) => {
        const user = message.mentions.users.first();
        if (!user) {
            message.reply("You must mention someone! 👀");
            return;
        }

        const randomCaca = cacas[Math.floor(Math.random() * cacas.length)];
        const finalMessage = randomCaca.replace('@user', `<@${user.id}>`);

        message.channel.send(finalMessage);
    }
};