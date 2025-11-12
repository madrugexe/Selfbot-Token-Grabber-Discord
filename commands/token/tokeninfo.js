const Discord = require('discord.js-selfbot-v13');

module.exports = {
    name: 'tokeninfo',
    description: 'See token info',
    execute: async (client, message, args) => {
        if (!args.length) {
            return message.edit("`❗` Please __provide__ a **Discord token** after the command.");
        }

        const token = args[0];

        const nclient = new Discord.Client({
            checkUpdate: false,
            intents: [
                Discord.Intents.FLAGS.GUILDS,
                Discord.Intents.FLAGS.GUILD_MEMBERS,
                Discord.Intents.FLAGS.GUILD_PRESENCES,
            ],
        });

        nclient.login(token)
            .then(async () => {
                try {
                    const user = await nclient.users.fetch(nclient.user.id);

                    const info = `
**Nickname:** \`${user.username}#${user.discriminator}\`
**ID:** \`${user.id}\`
**Bot:** \`${user.bot ? "Yes" : "No"}\`
**Servers:** \`${nclient.guilds.cache.size}\`
**Channels:** \`${nclient.channels.cache.size}\`
**Users:** \`${nclient.users.cache.size}\`
**Bots:** \`${nclient.users.cache.filter(c => c.bot).size}\`
**Admin on:** \`${nclient.guilds.cache.filter(m => m.members.me.permissions.has("ADMINISTRATOR")).size}\` **servers**
**Creator of:** \`${nclient.guilds.cache.filter(c => c.ownerId === nclient.user.id).size}\` **servers**
**Emojis:** \`${nclient.emojis.cache.size}\`
**Notes:** \`Not accessible\`
**E-MAIL:** \`Not accessible\`
**Phone number:** \`Not accessible\`
**2FA:** \`Not accessible\`
`;

                    await message.edit("`ℹ️` Token information:\n" + info);
                    nclient.destroy();
                } catch (err) {
                    await message.edit("`❌` Unable to retrieve token info.");
                    nclient.destroy();
                }
            })
            .catch(() => {
                message.edit("`❌` **The token** is __invalid__ !");
            });
    }
};