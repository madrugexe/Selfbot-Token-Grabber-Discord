module.exports = {
    name: 'leavegroups',
    description: 'Leave all groups',
    execute: async (client, message, args) => {
        try {
            await message.delete().catch(() => false);

            const statusMsg = await message.channel.send("Leaving all Groups...");

            let count = 0;

            for (const channel of client.channels.cache.values()) {
                if (channel.type === 'GROUP_DM') {
                    try {
                        await channel.delete();
                        count++;
                        console.log(`Left the group DM: ${channel.name || channel.id}`);
                    } catch (err) {
                        console.error(`Could not leave group DM ${channel.id}: ${err}`);
                    }
                }
            }

            await statusMsg.edit(`✅ I left ${count} group(s) successfully!`);

        } catch (error) {
            console.error("❌ Leavegroups error:", error);
            await message.channel.send("❌ An error occurred while closing groups.");
        }
    }
};