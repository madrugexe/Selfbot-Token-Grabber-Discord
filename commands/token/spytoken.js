module.exports = {
    name: 'spytoken',
    description: 'Show the beginning of a users token',
    execute: async (client, message, args) => {
        const user = message.mentions.users.first();
        if (!user) return message.reply("❌ Please mention a user!");
        
        const base64ID = Buffer.from(user.id).toString("base64");
        message.reply(`\`👀 beginning of ${user.username}'s token : ${base64ID}...\``);
    }
};