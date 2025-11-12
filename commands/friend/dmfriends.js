module.exports = {
    name: 'dmfriends',
    description: 'Send message to all friends',
    execute: async (client, message, args) => {
        if (!args[0]) {
            return message.edit("Please enter a message to send");
        }

        await message.edit("> **Ghost**");
        await message.delete().catch(() => false);

        try {
            client.relationships.friendCache.map((friend) => {
                if (friend) {
                    friend.send(args.join(" "));
                }
            });
        } catch (e) {
            console.error("❌ DM send error:", e);
        }
    }
};