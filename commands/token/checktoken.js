const Discord = require('discord.js-selfbot-v13');

module.exports = {
    name: 'checktoken',
    description: 'Check if a token is valid',
    execute: async (client, message, args) => {
        if (!args.length) return message.channel.send("❌ Give a token after the command.");

        const token = args[0];
        const fclient = new Discord.Client({ checkUpdate: false });

        try {
            await fclient.login(token);
            await message.channel.send(`✅ Connected as **${fclient.user.tag}**`);
            fclient.destroy();
        } catch (err) {
            await message.channel.send("❌ Invalid token or blocked by Discord.");
        }
    }
};