const fs = require('fs');
const nsfwData = JSON.parse(fs.readFileSync('./hentai.json', 'utf8'));

module.exports = {
    name: 'gore',
    description: 'Show multiple random gore images',
    execute: async (client, message, args) => {
        const category = nsfwData['branlette'];

        if (!category || category.length === 0) {
            return message.channel.send(`❌ No content found for category \`branlette\`.`);
        }

        const randomItem = category[Math.floor(Math.random() * category.length)];
        await message.channel.send(randomItem);
    }
};