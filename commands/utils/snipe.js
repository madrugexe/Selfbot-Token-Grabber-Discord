module.exports = {
    name: 'snipe',
    description: 'View last deleted message',
    execute: async (client, message, args) => {
        const msg = client.snipes.get(message.channel.id);
        if (!msg) return message.edit("❌ No message recorded.").catch(() => false);

        await message.edit(
            `# 📌 Snipe
   > **Author:** *${msg.author}*
   > **Message:** \`${msg.content || "No content"}\`
   > **Image:** ${msg.image ? `**${msg.image}**` : "None"}
   > **Date:** <t:${parseInt(msg.date / 1000, 10)}:R>`
        ).catch(() => false);
    }
};