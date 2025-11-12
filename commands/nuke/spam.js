module.exports = {
    name: 'spam',
    description: 'Start massive spam',
    execute: async (client, message, args) => {
        const amount = args[0];
        const messageToSend = args.slice(1).join(" ");

        message.delete().catch(() => false);

        if (!amount) {
            return message.channel.send(
                "❌ Usage: !spam <number> <message>\nExample: !spam 5 Hello!"
            ).catch(() => false);
        }

        if (isNaN(parseInt(amount))) {
            return message.channel.send("❌ Please enter a valid number").catch(() => false);
        }

        if (!messageToSend) {
            return message.channel.send("❌ Please enter a message to send").catch(() => false);
        }

        for (let i = 0; i < parseInt(amount); i++) {
            setTimeout(() => {
                message.channel.send(messageToSend).catch(() => false);
            }, i * 500);
        }
    }
};