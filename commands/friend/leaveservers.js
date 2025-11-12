module.exports = {
    name: 'leaveservers',
    description: 'Leave all servers',
    execute: async (client, message, args) => {
        try {
            await message.delete().catch(() => false);

            const statusMsg = await message.channel.send("Leaving all servers...");

            let count = 0;

            for (const guild of client.guilds.cache.values()) {
                try {
                    await guild.leave();
                    count++;
                    console.log(`Left the guild: ${guild.name}`);
                } catch (err) {
                    console.error(`Could not leave guild ${guild.name}: ${err}`);
                }
            }

            await statusMsg.edit(`✅ I left ${count} server(s) successfully!`);

        } catch (error) {
            console.error("❌ Leaveservers error:", error);
            await message.channel.send("❌ An error occurred while closing servers.");
        }
    }
};